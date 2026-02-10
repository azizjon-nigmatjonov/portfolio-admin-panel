// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time - data qancha vaqt "yangi" hisoblanadi
      staleTime: 1000 * 60 * 5, // 5 minutes
      
      // Cache time - data cache da qancha saqlanadi
      gcTime: 1000 * 60 * 10, // 10 daqiqa (eski nomi: cacheTime)
      
      // Refetch strategiyalari
      refetchOnWindowFocus: true, // Tab ga qaytganda yangilanadi
      refetchOnReconnect: true,   // Internet qaytganda
      refetchOnMount: true,       // Component mount bo'lganda
      
      // Retry logic
      retry: (failureCount, error: any) => {
        // 404 da retry qilmasin
        if (error?.response?.status === 404) return false;
        // Maximum 3 marta
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Mutation xatolik bo'lsa retry qilmasin
      retry: false,
    },
  },
});