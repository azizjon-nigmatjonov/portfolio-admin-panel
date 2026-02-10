import React, { useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useSidebar } from '@/app/store';
import { Button } from '@/shared/components/Button/Button';
import { useProfileLogic } from '@/pages/profile/Logic';

export const Header: React.FC = () => {
  const { logout } = useAuth();
  const { userInfo, fetchUserInfo } = useProfileLogic();
  const { toggleSidebar } = useSidebar();

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    (async () => {
      await fetchUserInfo();
    })();
  }, []);

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border px-6">
      <div className="flex flex-1 items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="text-sm text-muted-foreground">
              Welcome back, <span className="font-medium text-foreground">{userInfo?.name}</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5v-5zM4 19h5l-5 5v-5z"
                />
              </svg>
            </button>

            {/* User menu */}
            <div className="relative">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    {userInfo?.profilePicture ? (
                      <img src={userInfo?.profilePicture} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <span className="text-sm font-medium text-white">
                        {userInfo?.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-foreground">{userInfo?.name}</p>
                  <p className="text-xs text-muted-foreground">{userInfo?.email}</p>
                </div>
              </div>
            </div>

            <Button size="sm" onClick={handleLogout}>
              Sign out
            </Button>
          </div>
        </div>
    </header>
  );
};
