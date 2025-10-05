import { useCallback, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useAuthStore } from '../store/authSlice';
import { authApi } from '../api/authApi';
import { type LoginCredentials, type RegisterCredentials } from '../types/auth.types';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    setUser,
    setTokens,
    setLoading,
    setError,
    clearAuth,
  } = useAuthStore();

  // Listen to Firebase auth state changes
  useEffect(() => {
    let isMounted = true;
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isMounted) return;
      
      if (firebaseUser) {
        try {
          setLoading(true);
          const token = await firebaseUser.getIdToken();
          
          if (isMounted) {
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || '',
              role: 'user' as const,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
            setTokens(token, firebaseUser.refreshToken);
          }
        } catch (error) {
          console.error('Error getting user token:', error);
          if (isMounted) {
            clearAuth();
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      } else {
        clearAuth();
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [setUser, setTokens, clearAuth, setLoading]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authApi.login(credentials);
      
      setUser(response.user);
      setTokens(response.token, response.refreshToken);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUser, setTokens, setLoading, setError]);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authApi.register(credentials);
      
      setUser(response.user);
      setTokens(response.token, response.refreshToken);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUser, setTokens, setLoading, setError]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearAuth();
      setLoading(false);
    }
  }, [clearAuth, setLoading]);

  const refreshToken = useCallback(async () => {
    try {
      const response = await authApi.refreshToken();
      setTokens(response.token, response.refreshToken);
      return response.token;
    } catch (err) {
      clearAuth();
      throw err;
    }
  }, [setTokens, clearAuth]);

  const getCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      const user = await authApi.getCurrentUser();
      setUser(user);
      return user;
    } catch (err) {
      clearAuth();
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUser, clearAuth, setLoading]);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      await authApi.forgotPassword(email);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const resetPassword = useCallback(async (token: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await authApi.resetPassword(token, password);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset password';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshToken,
    getCurrentUser,
    forgotPassword,
    resetPassword,
    clearError: () => setError(null),
  };
};
