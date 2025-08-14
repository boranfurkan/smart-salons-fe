import React from 'react';
import { ReactQueryProvider } from './react-query-provider';
import { AuthProvider } from '@/context/auth-context';
import { CartProvider } from '@/context/cart-context';

interface ProvidersWrapperProps {
  children: React.ReactNode;
}

const ProvidersWrapper = ({ children }: ProvidersWrapperProps) => {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
};

export default ProvidersWrapper;
