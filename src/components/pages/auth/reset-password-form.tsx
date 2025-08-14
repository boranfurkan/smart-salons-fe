'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ModernAuthLayout } from '@/components/shared/auth/modern-auth-layout';
import { PasswordInput } from '@/components/shared/auth/password-input';
import { FormField, FormError } from '@/components/shared/auth/form-components';
import { Label } from '@/components/ui/label';

import { useAuthControllerResetPassword } from '@/lib/api/generated/authentication/authentication';
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from '@/lib/schemas/auth';
import type { ApiError } from '@/types/api';
import { getErrorMessage } from '@/lib/utils/error';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const resetPasswordMutation = useAuthControllerResetPassword({
    mutation: {
      onSuccess: () => {
        setSuccess(true);
        setError(null);
        // Redirect to sign in after 3 seconds
        setTimeout(() => {
          router.push('/auth/signin?message=password-reset-success');
        }, 3000);
      },
      onError: (error: ApiError) => {
        setError(
          getErrorMessage(error, 'An error occurred while resetting password')
        );
        setSuccess(false);
      },
    },
  });

  const onSubmit = (formData: ResetPasswordFormData) => {
    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    setError(null);
    setSuccess(false);
    resetPasswordMutation.mutate({
      data: {
        token,
        newPassword: formData.password,
      },
    });
  };

  // Invalid token or missing token
  if (!token) {
    return (
      <ModernAuthLayout
        title="Invalid reset link"
        subtitle="This password reset link is invalid or has expired"
        backgroundImage="/signin-bg.jpg"
        imageAlt="Invalid reset link illustration"
      >
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-gray-600 mb-6">
            This link may have expired or already been used. Please request a
            new password reset.
          </p>
          <Link href="/auth/forgot-password">
            <Button variant="outline" className="w-full">
              Request new reset link
            </Button>
          </Link>
        </div>
      </ModernAuthLayout>
    );
  }

  // Success state
  if (success) {
    return (
      <ModernAuthLayout
        title="Password reset successful"
        subtitle="Your password has been updated successfully"
        backgroundImage="/email-confirmations-bg.jpg"
        imageAlt="Password reset success illustration"
      >
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-gray-600 mb-4">
            Your password has been successfully reset. You can now sign in with
            your new password.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to sign in page...
          </p>
        </div>
      </ModernAuthLayout>
    );
  }

  const footer = (
    <Link
      href="/auth/signin"
      className="text-sm text-gray-600 hover:text-gray-900 transition-colors inline-block"
    >
      ← Back to sign in
    </Link>
  );

  return (
    <ModernAuthLayout
      title="Set new password"
      subtitle="Enter a new password for your account"
      footer={footer}
      backgroundImage="/signin-bg.jpg"
      imageAlt="Set new password illustration"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormError message={error || undefined} />

        <FormField error={errors.password?.message}>
          <Label htmlFor="password">New password</Label>
          <PasswordInput
            id="password"
            placeholder="Enter your new password"
            {...register('password')}
            error={!!errors.password}
          />
          <div className="text-xs text-gray-500 space-y-1 mt-2">
            <p>
              Password must be at least 8 characters and include uppercase,
              lowercase, and a number.
            </p>
          </div>
        </FormField>

        <FormField error={errors.confirmPassword?.message}>
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Confirm your new password"
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
          />
        </FormField>

        <Button
          type="submit"
          className="w-full"
          disabled={resetPasswordMutation.isPending}
        >
          {resetPasswordMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Updating password...
            </>
          ) : (
            'Update password'
          )}
        </Button>
      </form>
    </ModernAuthLayout>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <ModernAuthLayout
          title="Loading..."
          subtitle="Please wait..."
          backgroundImage="/signin-bg.jpg"
          imageAlt="Loading"
        >
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        </ModernAuthLayout>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
