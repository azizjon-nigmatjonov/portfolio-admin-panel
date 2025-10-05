import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store/authSlice';

/**
 * Hook to initialize stores after user authentication
 * This hook should be called after successful login to populate stores with user data
 */
export const useStoreInitializer = () => {
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Initialize stores with user data after authentication
      const initializeStores = async () => {
        try {
          // Add any initialization logic here when needed
          console.log('Stores initialized for user:', user.email);
        } catch (error) {
          console.error('Failed to initialize stores:', error);
        }
      };

      initializeStores();
    }
  }, [isAuthenticated, user]);

  return {
    isInitialized: isAuthenticated && user !== null,
  };
};

// Note: useStoreCleanup hook removed since dashboard and products stores were removed
// Auth store cleanup is handled directly by the auth store's clearAuth method
