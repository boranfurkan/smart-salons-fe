import React from 'react';
import { ReactQueryProvider } from './react-query-provider';
import { AuthProvider } from '@/context/auth-context';

interface ProvidersWrapperProps {
  children: React.ReactNode;
}

const ProvidersWrapper = ({ children }: ProvidersWrapperProps) => {
  return (
    <ReactQueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </ReactQueryProvider>
  );
};

export default ProvidersWrapper;
