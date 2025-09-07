import { useQuery } from '@tanstack/react-query';
import { authKeys } from '@/features/auth/apis/keys.ts';
import { http } from '@/shared/apis/http.ts';
import type { User } from '@/features/auth/types.ts';

export function useMeQuery() {
    return useQuery<User>({
        queryKey: authKeys.me,
        queryFn: () => http.get<User>('/auth/me'),
    });
}
