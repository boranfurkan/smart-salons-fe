'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">Smart Salons</h1>
          <p className="text-lg text-slate-600">
            Premium Hair Salon Furniture & Equipment
          </p>
          <p className="text-slate-500">
            Discover professional styling chairs, shampoo units, reception desks
            and more.
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/auth/signup">Get Started</Link>
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>

        <div className="text-sm text-slate-500">
          <p>
            New to Smart Salons? Create an account to explore our collection.
          </p>
        </div>
      </div>
    </div>
  );
}
