'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Loader2, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/components/shared/auth/auth-layout';
import { PasswordInput } from '@/components/shared/auth/password-input';
import { FormField, FormError } from '@/components/shared/auth/form-components';

import { useAuthControllerSignUp } from '@/lib/api/generated/authentication/authentication';
import { signUpSchema, type SignUpFormData } from '@/lib/schemas/auth';
import type { ApiError } from '@/types/api';
import { getErrorMessage } from '@/lib/utils/error';

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const signUpMutation = useAuthControllerSignUp({
    mutation: {
      onSuccess: () => {
        setSuccess(true);
        setError(null);
        // Redirect to verification page after 2 seconds
        setTimeout(() => {
          router.push('/verify-email');
        }, 2000);
      },
      onError: (error: ApiError) => {
        setError(getErrorMessage(error, 'An error occurred during sign up'));
        setSuccess(false);
      },
    },
  });

  const onSubmit = (formData: SignUpFormData) => {
    setError(null);
    setSuccess(false);
    signUpMutation.mutate({ data: formData });
  };

  const footer = !success ? (
    <p className="text-center text-sm text-gray-600">
      Already have an account?{' '}
      <Link
        href="/auth/signin"
        className="font-medium text-gray-900 hover:text-gray-700 transition-colors"
      >
        Sign in
      </Link>
    </p>
  ) : null;

  if (success) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We've sent a verification link to your email address"
      >
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-gray-600 mb-6">
            Please check your email and click the verification link to activate
            your account.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to verification page...
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Get started with Smart Salons today"
      footer={footer}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormError message={error || undefined} />

        <div className="grid grid-cols-2 gap-4">
          <FormField error={errors.firstName?.message}>
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              {...register('firstName')}
              className={
                errors.firstName
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  : ''
              }
            />
          </FormField>

          <FormField error={errors.lastName?.message}>
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              {...register('lastName')}
              className={
                errors.lastName
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  : ''
              }
            />
          </FormField>
        </div>

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

        <FormField error={errors.password?.message}>
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            placeholder="Create a strong password"
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

        <Button
          type="submit"
          className="w-full"
          disabled={signUpMutation.isPending}
        >
          {signUpMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
