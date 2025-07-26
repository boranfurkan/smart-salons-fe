'use client';

import { cn } from '@/lib/utils';

interface FormFieldProps {
  children: React.ReactNode;
  error?: string;
  className?: string;
}

export function FormField({ children, error, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {children}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-600 rounded-full flex-shrink-0 mt-1.5" />
          {error}
        </p>
      )}
    </div>
  );
}

interface FormErrorProps {
  message?: string;
  className?: string;
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        'p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3',
        className
      )}
    >
      <div className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0 mt-1.5" />
      <span>{message}</span>
    </div>
  );
}

interface FormSuccessProps {
  message?: string;
  className?: string;
}

export function FormSuccess({ message, className }: FormSuccessProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        'p-4 text-sm text-green-800 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3',
        className
      )}
    >
      <div className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0 mt-1.5" />
      <span>{message}</span>
    </div>
  );
}
