import { TAny } from '@/types/global';
import { QueryClient, onlineManager } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5,
      //cache Time
      gcTime: 1000 * 60 * 60 * 24,
      retry: (failureCount, error: TAny) => {
        // Don't retry if we're offline
        if (!onlineManager.isOnline()) return false;
        // Retry up to 3 times for network errors
        if (failureCount < 2 && error?.name === 'NetworkError') return true;
        return false;
      },
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      enabled: typeof navigator !== 'undefined' ? navigator.onLine : true,
    },
    mutations: {
      retry: (failureCount) => {
        // Don't retry mutations if offline
        if (!onlineManager.isOnline()) return false;
        return failureCount < 2;
      },
    },
  },
});
