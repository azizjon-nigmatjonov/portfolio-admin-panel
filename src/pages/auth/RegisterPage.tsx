import React from 'react';
import { Navigate } from 'react-router-dom';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { useAuth } from '@/features/auth/hooks/useAuth';

const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  const handleSuccess = () => {
    window.location.href = '/profile';
  };

  return (
    <div>
      <RegisterForm
        onSuccess={handleSuccess}
        onSwitchToLogin={() => window.location.href = '/auth/login'}
      />
    </div>
  );
};

export default RegisterPage;
