import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updatePassword
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { apiGet, apiPut, apiUploadFile } from '@/services/apiClient';
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types/auth.types';

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        credentials.email, 
        credentials.password
      );
      
      const user = userCredential.user;
      const token = await user.getIdToken();
      
      return {
        user: {
          id: user.uid,
          email: user.email || '',
          name: user.displayName || '',
          role: 'user' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        token,
        refreshToken: user.refreshToken,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        credentials.email, 
        credentials.password
      );
      
      const user = userCredential.user;
      const token = await user.getIdToken();
      
      return {
        user: {
          id: user.uid,
          email: user.email || '',
          name: user.displayName || credentials.name || '',
          role: 'user' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        token,
        refreshToken: user.refreshToken,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  },

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  },

  async refreshToken(): Promise<{ token: string; refreshToken: string }> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }
      
      const token = await user.getIdToken(true); // Force refresh
      return {
        token,
        refreshToken: user.refreshToken,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Token refresh failed');
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }
      
      return {
        id: user.uid,
        email: user.email || '',
        name: user.displayName || '',
        role: 'user' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get current user');
    }
  },

  async forgotPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send reset email');
    }
  },

  async resetPassword(_token: string, password: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }
      
      await updatePassword(user, password);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to reset password');
    }
  },

  async fetchUserInfo(): Promise<User> {
    try {
      const user = await apiGet<User>('/me');
      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user info');
    }
  },

  async updateUserProfile(profileData: Partial<User & { avatar?: File | string }>): Promise<User> {
    try {
      // If avatar is a File object, upload it first
      if (profileData.avatar && typeof profileData.avatar === 'object' && (profileData.avatar as any) instanceof File) {
        // Upload the image file
        const uploadResult = await apiUploadFile<{ url: string }>('/upload/avatar', profileData.avatar);
        
        // Update profile with the uploaded image URL
        const { avatar: file, ...restData } = profileData;
        const updatedUser = await apiPut<User>('/me', {
          ...restData,
          avatar: uploadResult.url
        });
        
        return updatedUser;
      } else {
        // Regular profile update without file upload
        const updatedUser = await apiPut<User>('/me', profileData);
        return updatedUser;
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update user profile');
    }
  },
};
