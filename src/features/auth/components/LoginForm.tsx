import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { loginSchema, type LoginFormData } from '../utils/validation';
import { HFInput } from '@/shared/components/HFElements/HFInput';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authSlice';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser, setTokens, setLoading, setError: setStoreError, setUserInfo } = useAuthStore();

  const {
    control,
    handleSubmit,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setLoading(true);
      setError(null);
      setStoreError(null);
      
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      
      // Set tokens in store
      setTokens(token, user.refreshToken);
      
      // Fetch user info from /me endpoint
      const userInfo = await authApi.fetchUserInfo();
      
      // Set user info in store
      setUserInfo(userInfo);
      setUser(userInfo);
      
      navigate('/');
      onSuccess?.();
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      setStoreError(errorMessage);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <HFInput<LoginFormData>
        control={control}
        name="email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        required
      />

      <HFInput<LoginFormData>
        control={control}
        name="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        required
      />

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>

      {/* {onSwitchToRegister && (
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Sign up
          </button>
        </p>
      )} */}
    </form>
  );
};
