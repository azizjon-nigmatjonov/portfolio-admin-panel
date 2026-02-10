import React, { Suspense } from 'react';
import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/app/ThemeProvider';

// Create a client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Reduce retries
      retryDelay: 1000, // Fixed delay
      staleTime: 10 * 60 * 1000, // 10 minutes - longer cache
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Don't refetch on mount if data is fresh
      refetchOnReconnect: false, // Don't refetch on reconnect
    },
    mutations: {
      retry: 0, // No retries for mutations
    },
  },
});

interface AppProvidersProps {
  children: ReactNode;
}

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full bg-card border border-border shadow-lg rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-foreground">Something went wrong</h3>
          </div>
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          <p>{error.message}</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={resetErrorBoundary}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center px-3 py-2 border border-border text-sm leading-4 font-medium rounded-md text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
};

// Optimized Loading Screen Component
const LoadingScreen = React.memo(() => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-muted border-t-primary mx-auto"></div>
        <p className="mt-3 text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
});

LoadingScreen.displayName = 'LoadingScreen';

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Application Error:', error, errorInfo);
        // Here you could send error to monitoring service
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Suspense fallback={<LoadingScreen />}>
            {children}
          </Suspense>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
