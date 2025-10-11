import { useCallback, useState } from 'react';
import { authApi } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/features/auth/store/authSlice";
import type { UserInfo } from "@/features/auth/types/auth.types";

export const useProfileLogic = () => {
  const { userInfo, setUserInfo, setError } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchUserInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const user = await authApi.fetchUserInfo();
      setUserInfo(user);
      return user;
    } catch (error: any) {
      setError(error.message || 'Failed to fetch user info');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setUserInfo, setError, setIsLoading]);

  const updateUserProfile = async (profileData: Partial<UserInfo>) => {
    try {
      setIsUpdating(true);
      setError(null);
      
      const updatedUser = await authApi.updateUserProfile(profileData);
      setUserInfo(updatedUser);
      return updatedUser;
      
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    userInfo,
    isLoading,
    isUpdating,
    fetchUserInfo,
    updateUserProfile,
    refetch: fetchUserInfo,
  };
};