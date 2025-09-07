import { useFormContext } from 'react-hook-form';
import { Button, buttonVariants } from '@/components/ui/button.tsx';
import * as React from 'react';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import { Fragment } from 'react';
import { Loader2 } from 'lucide-react';

type SubmitButtonProps = {
    isLoading?: boolean;
    loadingText?: string;
} & React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    };

export default function SubmitButton({ isLoading = false, loadingText = '', className, children, disabled, ...props }: SubmitButtonProps) {
    const form = useFormContext();
    const isSubmitting = form?.formState?.isSubmitting ?? false;
    return (
        <Button type="submit" {...props} className={cn('inline-flex items-center', className)} disabled={isLoading || isSubmitting || disabled}>
            {isLoading || isSubmitting ? (
                <Fragment>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {loadingText || 'Submitting...'}
                </Fragment>
            ) : (
                children
            )}
        </Button>
    );
}
