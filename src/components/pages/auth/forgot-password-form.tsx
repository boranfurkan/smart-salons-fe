'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/components/shared/auth/auth-layout';
import { FormField, FormError } from '@/components/shared/auth/form-components';

import { useAuthControllerForgotPassword } from '@/lib/api/generated/authentication/authentication';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@/lib/schemas/auth';
import type { ApiError } from '@/types/api';
import { getErrorMessage } from '@/lib/utils/error';

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const forgotPasswordMutation = useAuthControllerForgotPassword({
    mutation: {
      onSuccess: () => {
        setSuccess(true);
        setError(null);
      },
      onError: (error: ApiError) => {
        setError(
          getErrorMessage(error, 'An error occurred while sending reset email')
        );
        setSuccess(false);
      },
    },
  });

  const onSubmit = (formData: ForgotPasswordFormData) => {
    setError(null);
    setSuccess(false);
    forgotPasswordMutation.mutate({ data: formData });
  };

  const footer = (
    <Link
      href="/auth/signin"
      className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to sign in
    </Link>
  );

  if (success) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We've sent password reset instructions to your email"
        footer={footer}
      >
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-gray-600 mb-4">
            If an account with <strong>{getValues('email')}</strong> exists,
            you&apos;ll receive password reset instructions.
          </p>
          <p className="text-sm text-gray-500">
            Please check your email and follow the instructions to reset your
            password.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email address and we'll send you a reset link"
      footer={footer}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormError message={error || undefined} />

        <FormField error={errors.email?.message}>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register('email')}
            className={
              errors.email
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : ''
            }
          />
        </FormField>

        <Button
          type="submit"
          className="w-full"
          disabled={forgotPasswordMutation.isPending}
        >
          {forgotPasswordMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending reset link...
            </>
          ) : (
            'Send reset link'
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
