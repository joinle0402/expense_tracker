<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::get('/user', function () {
    return User::query()->find(1);
});
