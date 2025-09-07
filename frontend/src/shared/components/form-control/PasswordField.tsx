import type { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { useState } from 'react';
import { cn } from '@/lib/utils.ts';

type PasswordFieldProps = {
    name: string;
    label: string;
    control: Control<any>;
};

export default function PasswordField({ name, control, label }: PasswordFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormField
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input
                                {...field}
                                autoComplete="new-password"
                                type={showPassword ? 'text' : 'password'}
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
                                )}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    'absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8 hover:bg-transparent cursor-pointer',
                                    fieldState.invalid && 'text-destructive hover:text-destructive',
                                )}
                                onClick={() => setShowPassword((value) => !value)}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
