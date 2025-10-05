import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '../utils/validation';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/shared/components/Button/Button';
import { Input } from '@/shared/components/Input/Input';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const { register: registerUser, isLoading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      clearError();
      await registerUser(data);
      onSuccess?.();
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Or{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            sign in to your existing account
          </button>
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="space-y-4">
        <Input
          type="text"
          label="Full name"
          placeholder="Enter your full name"
          error={errors.name?.message}
          disabled={isLoading}
          onChange={(value) => register('name', { value })}
          onBlur={() => {}}
        />

        <Input
          type="email"
          label="Email address"
          placeholder="Enter your email"
          error={errors.email?.message}
          disabled={isLoading}
          onChange={(value) => register('email', { value })}
          onBlur={() => {}}
        />

        <Input
          type="password"
          label="Password"
          placeholder="Create a password"
          error={errors.password?.message}
          disabled={isLoading}
          onChange={(value) => register('password', { value })}
          onBlur={() => {}}
        />

        <Input
          type="password"
          label="Confirm password"
          placeholder="Confirm your password"
          error={errors.confirmPassword?.message}
          disabled={isLoading}
          onChange={(value) => register('confirmPassword', { value })}
          onBlur={() => {}}
        />
      </div>

      <div className="flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          required
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
          I agree to the{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500">
            Privacy Policy
          </a>
        </label>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
};
