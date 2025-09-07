import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http } from '@/shared/apis/http.ts';
import type { AuthResponse } from '@/features/auth/types.ts';
import { authKeys } from '@/features/auth/apis/keys.ts';
import InputField from '@/shared/components/form-control/InputField.tsx';
import PasswordField from '@/shared/components/form-control/PasswordField.tsx';
import { handleError } from '@/shared/functions.ts';
import SubmitButton from '@/shared/components/form-control/SubmitButton.tsx';

const Schema = z
    .object({
        name: z.string({ error: 'Name is required!' }).min(1, 'Name is required!').trim(),
        email: z.email('Invalid email address!').toLowerCase(),
        password: z.string().min(4, 'Password must be at least 4 characters!'),
        password_confirmation: z.string().min(4, 'Confirm Password must be at least 4 characters!'),
    })
    .refine(({ password, password_confirmation }) => password === password_confirmation, {
        message: "Passwords don't match",
        path: ['password_confirmation'],
    });

export type FormValues = z.infer<typeof Schema>;

export default function Register() {
    const queryClient = useQueryClient();
    const form = useForm<FormValues>({
        resolver: zodResolver(Schema),
        defaultValues: { name: '', email: '', password: '', password_confirmation: '' },
    });

    const { mutate: onSubmit, isPending } = useMutation({
        mutationFn: async (payload: FormValues) => {
            const response = await http.post<AuthResponse>('/auth/register', payload);
            localStorage.setItem('access_token', response.token);
            return response;
        },
        onSuccess: (response: AuthResponse) => {
            queryClient.setQueryData(authKeys.me, response.user);
        },
        onError: (error: Error) => handleError(error, form),
    });

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-background to-muted p-4">
            <Card className="w-full max-w-sm py-6 gap-2">
                <CardHeader>
                    <CardTitle className="text-2xl">Register</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit((values) => onSubmit(values))} className="space-y-4">
                            <InputField control={form.control} name="name" label="Name" />
                            <InputField control={form.control} name="email" label="Email" />
                            <PasswordField control={form.control} name="password" label="Password" />
                            <PasswordField control={form.control} name="password_confirmation" label="Confirm Password" />
                            <SubmitButton className="w-full" isLoading={isPending}>
                                Submit
                            </SubmitButton>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
