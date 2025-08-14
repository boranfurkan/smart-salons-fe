'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ModernAuthLayout } from '@/components/shared/auth/modern-auth-layout';
import { PasswordInput } from '@/components/shared/auth/password-input';
import { FormField, FormError } from '@/components/shared/auth/form-components';

import { useAuth } from '@/context/auth-context';
import { useAuthControllerSignIn } from '@/lib/api/generated/authentication/authentication';
import { signInSchema, type SignInFormData } from '@/lib/schemas/auth';
import type { ApiError } from '@/types/api';
import { getErrorMessage } from '@/lib/utils/error';
import { AuthResponseDto } from '@/lib/api/generated/smartSalonsAPI.schemas';

export function SignInForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const signInMutation = useAuthControllerSignIn({
    mutation: {
      onSuccess: (data: AuthResponseDto) => {
        login(data.access_token, data.user);
        router.push('/dashboard');
      },
      onError: (error: ApiError) => {
        setError(getErrorMessage(error, 'An error occurred during sign in'));
      },
    },
  });

  const onSubmit = (formData: SignInFormData) => {
    setError(null);
    signInMutation.mutate({ data: formData });
  };

  const footer = (
    <p className="text-center text-sm text-gray-600">
      Don&apos;t have an account?{' '}
      <Link
        href="/auth/signup"
        className="font-medium text-gray-900 hover:text-gray-700 transition-colors"
      >
        Sign up
      </Link>
    </p>
  );

  return (
    <ModernAuthLayout
      title="Welcome back"
      subtitle="Sign in to your Smart Salons account"
      footer={footer}
      backgroundImage="/signin-bg.jpg"
      imageAlt="Modern salon interior"
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

        <FormField error={errors.password?.message}>
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            placeholder="Enter your password"
            {...register('password')}
            error={!!errors.password}
          />
        </FormField>

        <div className="flex items-center justify-between">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={signInMutation.isPending}
        >
          {signInMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>
    </ModernAuthLayout>
  );
}
