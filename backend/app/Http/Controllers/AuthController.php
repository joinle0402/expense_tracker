<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\RefreshToken;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    const REFRESH_TOKEN_COOKIE = 'refresh_token';

    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create($request->validated());
        return $this->respond($request, $user);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::query()->where('email', $request->email)->first();

        if (empty($user) || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 422);
        }

        return $this->respond($request, $user);
    }

    public function logout(Request $request): JsonResponse
    {
        optional($request->user())->currentAccessToken()->delete();

        if ($plain = $request->cookie(self::REFRESH_TOKEN_COOKIE)) {
            if ($refreshToken = RefreshToken::query()->where('token', hash('sha256', $plain))->first()) {
                $refreshToken->expires_at = now();
                $refreshToken->save();
            }
        }

        return response()
            ->json(['message' => 'logged out Successfully!'])
            ->cookie(cookie()->forget(self::REFRESH_TOKEN_COOKIE, '/', config('session.domain')));
    }

    public function me(Request $request)
    {
        return $request->user();
    }

    public function refresh(Request $request): JsonResponse
    {
        $plainToken = $request->cookie(self::REFRESH_TOKEN_COOKIE);
        if (empty($plainToken)) {
            return response()->json(['message' => 'Missing refresh token'], 401);
        }

        $refreshToken = RefreshToken::query()->where('token', hash('sha256', $plainToken))->first();
        if (empty($refreshToken) || $refreshToken->expires_at || $refreshToken->expires_at->isPast()) {
            return response()
                ->json(['message' => 'Invalid refresh token'], 401)
                ->cookie(cookie()->forget(self::REFRESH_TOKEN_COOKIE, '/', config('session.domain')));
        }

        return $this->respond($request, $refreshToken->user, $refreshToken);
    }

    public function respond(Request $request, User $user, ?RefreshToken $rotateFrom = null): JsonResponse
    {
        $accessToken = $user->createToken($user->email, ['*'], now()->addMinutes(15))->plainTextToken;

        $plainRefreshToken = Str::random(64);
        $refreshToken = RefreshToken::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $plainRefreshToken),
            'expires_at' => now()->addDays(7),
            'ip' => $request->ip(),
            'user_agent' => (string) $request->userAgent(),
        ]);

        if (!empty($rotateFrom)) {
            $rotateFrom->update(['replaced_by_id' => $refreshToken->id, 'revoked_at' => now()]);
        }

        return response()
            ->json([
                'user' => $user,
                'token' => $accessToken,
            ])
            ->cookie(cookie(
                name: self::REFRESH_TOKEN_COOKIE,
                value: $plainRefreshToken,
                minutes: 60 * 24 * 7,
                path: '/',
                domain: config('session.domain'),
                secure: app()->environment('production'),
                sameSite: 'Lax'
            ));
    }
}
