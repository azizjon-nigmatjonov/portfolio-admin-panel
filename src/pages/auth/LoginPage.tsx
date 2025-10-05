import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { useAuth } from '@/features/auth/hooks/useAuth';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/profile';
    return <Navigate to={from} replace />;
  }

  const handleSuccess = () => {
    const from = (location.state as any)?.from?.pathname || '/profile';
    window.location.href = from;
  };

  return (
    <div>
      {isLogin ? (
        <LoginForm
          onSuccess={handleSuccess}
          // onSwitchToRegister={() => setIsLogin(false)}
        />
      ) : (
        <RegisterForm
          onSuccess={handleSuccess}
          onSwitchToLogin={() => setIsLogin(true)}
        />
      )}
    </div>
  );
};

export default LoginPage;
