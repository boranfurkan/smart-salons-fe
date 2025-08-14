'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ModernAuthLayout } from '@/components/shared/auth/modern-auth-layout';

import { useAuthControllerVerifyEmail } from '@/lib/api/generated/authentication/authentication';
import type { ApiError } from '@/types/api';
import { getErrorMessage } from '@/lib/utils/error';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [verificationState, setVerificationState] = useState<
    'pending' | 'success' | 'error' | 'no-token'
  >('pending');
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedVerification, setHasAttemptedVerification] =
    useState(false);

  const verifyEmailMutation = useAuthControllerVerifyEmail({
    mutation: {
      onSuccess: () => {
        setVerificationState('success');
        setError(null);
        // Redirect to sign in after 3 seconds
        setTimeout(() => {
          router.push('/auth/signin?message=email-verified');
        }, 3000);
      },
      onError: (error: ApiError) => {
        setVerificationState('error');
        setError(getErrorMessage(error, 'Email verification failed'));
      },
    },
  });

  useEffect(() => {
    if (!token) {
      setVerificationState('no-token');
      return;
    }

    // Only attempt verification once
    if (!hasAttemptedVerification) {
      setHasAttemptedVerification(true);
      verifyEmailMutation.mutate({ data: { token } });
    }
  }, [token, hasAttemptedVerification, verifyEmailMutation]);

  // No token provided - user probably visited the page directly
  if (verificationState === 'no-token') {
    return (
      <ModernAuthLayout
        title="Check your email"
        subtitle="We've sent you a verification link"
        backgroundImage="/email-confirmations-bg.jpg"
        imageAlt="Email verification"
      >
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600 mb-6">
            Please check your email and click the verification link to activate
            your account.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => router.push('/auth/signin')}
              variant="outline"
              className="w-full"
            >
              Back to sign in
            </Button>
            <Link
              href="/auth/signup"
              className="block text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Didn&apos;t receive an email? Sign up again
            </Link>
          </div>
        </div>
      </ModernAuthLayout>
    );
  }

  // Verification in progress
  if (verificationState === 'pending') {
    return (
      <ModernAuthLayout
        title="Verifying your email"
        subtitle="Please wait while we verify your email address"
        backgroundImage="/email-confirmations-bg.jpg"
        imageAlt="Email verification"
      >
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
          </div>
          <p className="text-gray-600">Verifying your email address...</p>
        </div>
      </ModernAuthLayout>
    );
  }

  // Verification successful
  if (verificationState === 'success') {
    return (
      <ModernAuthLayout
        title="Email verified successfully"
        subtitle="Your account has been activated"
        backgroundImage="/email-confirmations-bg.jpg"
        imageAlt="Email verification success"
      >
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-gray-600 mb-4">
            Great! Your email has been verified. You can now sign in to your
            account.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Redirecting to sign in page...
          </p>
          <Button
            onClick={() => router.push('/auth/signin')}
            className="w-full"
          >
            Continue to sign in
          </Button>
        </div>
      </ModernAuthLayout>
    );
  }

  // Verification failed
  return (
    <ModernAuthLayout
      title="Verification failed"
      subtitle="We couldn't verify your email address"
      backgroundImage="/email-confirmations-bg.jpg"
      imageAlt="Email verification failed"
    >
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
        <p className="text-gray-600 mb-4">
          {error || 'The verification link is invalid or has expired.'}
        </p>
        <div className="space-y-3">
          <Link href="/auth/signup">
            <Button variant="outline" className="w-full">
              Sign up again
            </Button>
          </Link>
          <Link
            href="/auth/signin"
            className="block text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </ModernAuthLayout>
  );
}

export function VerifyEmailForm() {
  return (
    <Suspense
      fallback={
        <ModernAuthLayout
          title="Loading..."
          subtitle="Please wait..."
          backgroundImage="/email-confirmations-bg.jpg"
          imageAlt="Loading"
        >
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        </ModernAuthLayout>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
