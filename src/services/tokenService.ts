import { getAuth } from 'firebase/auth';
import type { User } from 'firebase/auth';

/**
 * Token service for handling Firebase authentication tokens
 */
class TokenService {
  private static instance: TokenService;
  private auth = getAuth();

  private constructor() {}

  static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  /**
   * Get the current Firebase user
   */
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  /**
   * Get the current user's ID token
   * @param forceRefresh - Whether to force refresh the token
   * @returns Promise<string | null> - The ID token or null if no user
   */
  async getIdToken(forceRefresh: boolean = false): Promise<string | null> {
    const user = this.getCurrentUser();
    if (!user) {
      return null;
    }

    try {
      const token = await user.getIdToken(forceRefresh);
      return token;
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  }

  /**
   * Get authorization header for API requests
   * @param forceRefresh - Whether to force refresh the token
   * @returns Promise<{ authtoken: string } | null> - Auth token header or null
   */
  async getAuthHeader(forceRefresh: boolean = false): Promise<{ authtoken: string } | null> {
    const token = await this.getIdToken(forceRefresh);
    if (!token) {
      return null;
    }

    return {
      authtoken: token,
    };
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * Get user UID
   */
  getUserId(): string | null {
    const user = this.getCurrentUser();
    return user?.uid || null;
  }

  /**
   * Refresh the token if needed
   * @returns Promise<string | null> - New token or null
   */
  async refreshToken(): Promise<string | null> {
    return this.getIdToken(true);
  }

  /**
   * Wait for auth state to be ready
   * @returns Promise<User | null> - Current user or null
   */
  async waitForAuth(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = this.auth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }
}

// Export singleton instance
export const tokenService = TokenService.getInstance();

// Export convenience functions
export const getAuthToken = () => tokenService.getIdToken();
export const getAuthHeader = () => tokenService.getAuthHeader();
export const getCurrentUser = () => tokenService.getCurrentUser();
export const isAuthenticated = () => tokenService.isAuthenticated();
export const getUserId = () => tokenService.getUserId();
export const refreshAuthToken = () => tokenService.refreshToken();
