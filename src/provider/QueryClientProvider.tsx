'use client';

import type React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/query-persist-client-core';

import { useEffect } from 'react';
import { idbPersister } from '@/lib/idbPersister';
import { queryClient } from '@/lib/queryClient';

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Initialize persistence when component mounts
    if (typeof window !== 'undefined') {
      persistQueryClient({
        queryClient: queryClient,
        persister: idbPersister,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        buster: '', // Change this to invalidate all cached data
      });
      // window.addEventListener('online', () => {
      //   queryClient.refetchQueries();
      // });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
