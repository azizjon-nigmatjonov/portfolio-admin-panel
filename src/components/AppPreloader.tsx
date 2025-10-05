import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/store/authSlice';

interface AppPreloaderProps {
  children: React.ReactNode;
}

/**
 * AppPreloader component that shows a loading screen while the app initializes
 * This improves perceived performance by showing immediate feedback
 */
export const AppPreloader: React.FC<AppPreloaderProps> = ({ children }) => {
  const [isAppReady, setIsAppReady] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const { isLoading } = useAuthStore();

  useEffect(() => {
    // Minimum loading time to prevent flash
    const minLoadTime = 800;
    const startTime = Date.now();

    const checkAppReady = () => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsed);

      setTimeout(() => {
        if (!isLoading) {
          setIsAppReady(true);
          // Fade out loader
          setTimeout(() => setShowLoader(false), 300);
        }
      }, remainingTime);
    };

    checkAppReady();
  }, [isLoading]);

  if (!isAppReady || showLoader) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Portfolio Admin</h1>
          <p className="text-sm text-gray-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
