'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useAuthControllerVerifyEmail } from '@/lib/api/generated/authentication/authentication';
import type { ApiError } from '@/types/api';
import { getErrorMessage } from '@/lib/utils/error';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [verificationState, setVerificationState] = useState<
    'pending' | 'success' | 'error'
  >('pending');
  const [error, setError] = useState<string | null>(null);

  const verifyEmailMutation = useAuthControllerVerifyEmail({
    mutation: {
      onSuccess: () => {
        setVerificationState('success');
        setError(null);
      },
      onError: (error: ApiError) => {
        setVerificationState('error');
        setError(getErrorMessage(error, 'Email verification failed'));
      },
    },
  });

  useEffect(() => {
    if (!token) {
      setVerificationState('error');
      setError('No verification token provided');
      return;
    }

    // Automatically verify email when component mounts
    verifyEmailMutation.mutate({ data: { token } });
  }, [token, verifyEmailMutation]);

  if (verificationState === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              Verifying Your Email
            </CardTitle>
            <CardDescription>
              Please wait while we verify your email address...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (verificationState === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              Email Verified!
            </CardTitle>
            <CardDescription>
              Your email address has been successfully verified. You can now
              sign in to your account.
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              onClick={() => router.push('/auth/signin')}
              className="w-full"
            >
              Sign In to Your Account
            </Button>

            <p className="text-center text-sm text-gray-600">
              Welcome to Smart Salons! Start exploring our premium salon
              furniture collection.
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Verification Failed
          </CardTitle>
          <CardDescription>
            {error || 'There was an error verifying your email address.'}
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            onClick={() => router.push('/auth/signup')}
            variant="outline"
            className="w-full"
          >
            Try Signing Up Again
          </Button>

          <Button
            onClick={() => router.push('/auth/signin')}
            className="w-full"
          >
            Back to Sign In
          </Button>

          <p className="text-center text-sm text-gray-600">
            If you continue to have issues, please contact our support team.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">
                Loading...
              </CardTitle>
              <CardDescription>
                Please wait while we prepare the page...
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
