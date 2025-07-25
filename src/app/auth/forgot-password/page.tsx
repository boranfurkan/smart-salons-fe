'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuthControllerForgotPassword } from '@/lib/api/generated/authentication/authentication';
import type { ApiError } from '@/types/api';
import { getErrorMessage } from '@/lib/utils/error';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      },
    },
  });

  const onSubmit = (formData: ForgotPasswordFormData) => {
    setError(null);
    forgotPasswordMutation.mutate({ data: formData });
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              Check Your Email
            </CardTitle>
            <CardDescription>
              We&apos;ve sent a password reset link to{' '}
              <span className="font-medium">{getValues('email')}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Click the link in the email to reset your password. The link will
              expire in 1 hour.
            </p>
            <p className="text-xs text-gray-500">
              Didn&apos;t receive the email? Check your spam folder.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              onClick={() => setSuccess(false)}
              variant="outline"
              className="w-full"
            >
              Try Different Email
            </Button>

            <Button asChild className="w-full">
              <Link href="/auth/signin">Back to Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-900">
            Forgot Password?
          </CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you a link to reset
            your password
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={forgotPasswordMutation.isPending}
            >
              {forgotPasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Reset Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>

            <Button asChild variant="ghost" className="w-full">
              <Link href="/auth/signin" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
