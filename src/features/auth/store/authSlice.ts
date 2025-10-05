import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User } from '../types/auth.types';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setUserInfo: (userInfo: any) => void;
  setTokens: (token: string | null, refreshToken: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      userInfo: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true, // Start with loading true
      error: null,

      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: !!user 
        });
      },

      setUserInfo: (userInfo: any) => {
        set({ userInfo });
      },

      setTokens: (token, refreshToken) => {
        set({ token, refreshToken });
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      clearAuth: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // Skip hydration in SSR or when no persisted state exists
      skipHydration: false,
      // Only persist essential data
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);
