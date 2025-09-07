import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import type { Control } from 'react-hook-form';
import { type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils.ts';
import * as React from 'react';

type InputFieldProps = {
    name: string;
    label: string;
    control: Control<any>;
    type?: InputHTMLAttributes<HTMLInputElement>['type'];
} & React.ComponentProps<'input'>;

export default function InputField({ name, control, label, type = 'text', ...props }: InputFieldProps) {
    return (
        <FormField
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            {...props}
                            type={type}
                            className={cn(
                                fieldState.invalid
                                    ? [
                                          '!ring-0 !focus:ring-0 !focus-visible:ring-0',
                                          '!ring-offset-0 !focus-visible:ring-offset-0',
                                          '!outline-none !focus:outline-none !focus-visible:outline-none',
                                          '!shadow-none !focus:shadow-none !focus-visible:shadow-none',
                                          '!border-destructive !text-destructive !placeholder:text-destructive',
                                      ].join(' ')
                                    : [
                                          'focus-visible:ring-0',
                                          'focus-visible:ring-ring',
                                          'focus-visible:ring-offset-0',
                                          'focus-visible:ring-offset-background',
                                          'focus-visible:outline-none',
                                      ].join(' '),
                                'bg-white',
                            )}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
