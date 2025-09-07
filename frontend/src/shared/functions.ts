import { isAxiosError } from 'axios';
import type { ValidationErrorResponse } from '@/shared/types.ts';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';

export function handleError<TFieldValues extends FieldValues>(error: Error, form?: UseFormReturn<TFieldValues>) {
    if (isAxiosError(error)) {
        if (error.response?.status === 422 && (error.response?.data as ValidationErrorResponse).errors && form) {
            const errors = (error.response?.data as ValidationErrorResponse).errors;
            for (const [serverKey, messages] of Object.entries(errors)) {
                form.setError(serverKey as Path<TFieldValues>, {
                    type: 'server',
                    message: messages[0],
                });
            }
        }
    } else {
        throw error;
    }
}
