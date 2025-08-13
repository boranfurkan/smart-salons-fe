import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "relative z-0 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 overflow-hidden before:absolute before:inset-0 before:-z-10 before:translate-y-[200%] before:scale-[2.5] before:rounded-[100%] before:transition-transform before:duration-1000 before:content-[''] hover:scale-105 active:scale-100",
  {
    variants: {
      variant: {
        default: '',
        destructive: '',
        outline: '',
        secondary: '',
        ghost: '',
        link: 'border-0 underline-offset-4 hover:underline hover:scale-100 before:hidden',
        green: '',
      },
      theme: {
        light: '',
        dark: '',
      },
      size: {
        default: 'h-11 px-6 py-2.5',
        sm: 'h-9 px-4 py-1.5',
        lg: 'h-12 px-8 py-3',
        icon: 'size-11 px-0',
      },
    },
    compoundVariants: [
      // Light theme variants
      {
        variant: 'default',
        theme: 'light',
        className:
          'border border-neutral-300 text-neutral-600 hover:border-neutral-900 hover:text-white focus-visible:ring-neutral-900/20 before:bg-neutral-900 hover:before:translate-y-[0%]',
      },
      {
        variant: 'destructive',
        theme: 'light',
        className:
          'border border-red-300 text-red-600 hover:border-red-600 hover:text-white focus-visible:ring-red-600/20 before:bg-red-600 hover:before:translate-y-[0%]',
      },
      {
        variant: 'outline',
        theme: 'light',
        className:
          'border border-neutral-300 bg-transparent text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 focus-visible:ring-neutral-900/20 before:bg-neutral-50 hover:before:translate-y-[0%]',
      },
      {
        variant: 'secondary',
        theme: 'light',
        className:
          'border border-neutral-200 text-white hover:border-neutral-300 hover:text-neutral-900 focus-visible:ring-neutral-900/20 before:bg-neutral-100 hover:before:translate-y-[0%]',
      },
      {
        variant: 'ghost',
        theme: 'light',
        className:
          'border border-transparent text-neutral-600 hover:border-neutral-200 hover:text-neutral-900 focus-visible:ring-neutral-900/20 before:bg-neutral-100 hover:before:translate-y-[0%]',
      },
      {
        variant: 'link',
        theme: 'light',
        className: 'text-neutral-900 focus-visible:ring-neutral-900/20',
      },
      {
        variant: 'green',
        theme: 'light',
        className:
          'border border-green-600 bg-green-600 text-white hover:border-green-700 hover:text-white focus-visible:ring-green-600/20 before:bg-green-700 hover:before:translate-y-[0%] disabled:bg-green-400 disabled:border-green-400',
      },
      // Dark theme variants
      {
        variant: 'default',
        theme: 'dark',
        className:
          'border border-neutral-700 text-neutral-400 hover:border-neutral-50 hover:text-black focus-visible:ring-neutral-50/20 before:bg-white hover:before:translate-y-[0%]',
      },
      {
        variant: 'destructive',
        theme: 'dark',
        className:
          'border border-red-400 text-red-400 hover:border-red-300 hover:text-black focus-visible:ring-red-400/20 before:bg-red-300 hover:before:translate-y-[0%]',
      },
      {
        variant: 'outline',
        theme: 'dark',
        className:
          'border border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600 focus-visible:ring-neutral-50/20 before:bg-neutral-800 hover:before:translate-y-[0%]',
      },
      {
        variant: 'secondary',
        theme: 'dark',
        className:
          'border border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-100 focus-visible:ring-neutral-50/20 before:bg-neutral-700 hover:before:translate-y-[0%]',
      },
      {
        variant: 'ghost',
        theme: 'dark',
        className:
          'border border-transparent text-neutral-400 hover:border-neutral-800 hover:text-neutral-100 focus-visible:ring-neutral-50/20 before:bg-neutral-800 hover:before:translate-y-[0%]',
      },
      {
        variant: 'link',
        theme: 'dark',
        className: 'text-neutral-100 focus-visible:ring-neutral-50/20',
      },
      {
        variant: 'green',
        theme: 'dark',
        className:
          'border border-green-500 bg-green-600 text-white hover:border-green-400 hover:text-white focus-visible:ring-green-500/20 before:bg-green-500 hover:before:translate-y-[0%] disabled:bg-green-700 disabled:border-green-700',
      },
    ],
    defaultVariants: {
      variant: 'default',
      theme: 'light',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
