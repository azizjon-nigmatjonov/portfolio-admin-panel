import { useEffect, useRef } from 'react';

/**
 * Hook to monitor performance and log loading times
 * Useful for debugging slow loading issues
 */
export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useRef<number>(Date.now());
  const mountTime = useRef<number>(0);

  useEffect(() => {
    mountTime.current = Date.now();
    const loadTime = mountTime.current - startTime.current;
    
    if (import.meta.env.DEV) {
      console.log(`🚀 ${componentName} loaded in ${loadTime}ms`);
    }

    return () => {
      const unmountTime = Date.now();
      const totalTime = unmountTime - startTime.current;
      
      if (import.meta.env.DEV) {
        console.log(`⏹️ ${componentName} unmounted after ${totalTime}ms`);
      }
    };
  }, [componentName]);

  return {
    getLoadTime: () => mountTime.current - startTime.current,
  };
};

/**
 * Hook to measure async operations
 */
export const useAsyncTimer = () => {
  const startTime = useRef<number>(0);

  const startTimer = () => {
    startTime.current = Date.now();
  };

  const endTimer = (operationName: string) => {
    const duration = Date.now() - startTime.current;
    
    if (import.meta.env.DEV) {
      console.log(`⏱️ ${operationName} completed in ${duration}ms`);
    }
    
    return duration;
  };

  return { startTimer, endTimer };
};
