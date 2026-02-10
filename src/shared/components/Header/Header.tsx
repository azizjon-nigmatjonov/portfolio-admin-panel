import React, { useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useLocation } from 'react-router-dom';
import { useSidebar } from '@/app/store';
import { Button } from '@/shared/components/Button/Button';
import { useProfileLogic } from '@/pages/profile/Logic';

const routeTitles: Record<string, { title: string; description?: string }> = {
  '/profile': { title: 'Profile', description: 'Manage your profile' },
  '/portfolio': { title: 'Portfolio', description: 'Manage portfolio items' },
  '/experience': { title: 'Experience', description: 'Experience management' },
  '/experience/about-me': { title: 'About Me', description: 'Personal introduction' },
  '/experience/contacts': { title: 'Contacts', description: 'Contact information' },
  '/experience/experiences': { title: 'Experiences', description: 'Work experience' },
  '/experience/skills': { title: 'Skills', description: 'Skills & proficiencies' },
  '/blog': { title: 'Blog', description: 'Blog posts' },
  '/images': { title: 'Images', description: 'Image library' },
  '/settings': { title: 'Settings', description: 'App settings' },
};

function getPageTitle(pathname: string): { title: string; description?: string } {
  if (routeTitles[pathname]) return routeTitles[pathname];
  const base = Object.keys(routeTitles).find((k) => pathname.startsWith(k + '/'));
  if (base) return routeTitles[base];
  return { title: 'Admin', description: '' };
}

export const Header: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const { userInfo, fetchUserInfo } = useProfileLogic();
  const { toggleSidebar } = useSidebar();
  const { title, description } = useMemo(() => getPageTitle(location.pathname), [location.pathname]);

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

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={title}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col"
              >
                <h1 className="text-sm font-semibold text-foreground">{title}</h1>
                {description && (
                  <p className="text-xs text-muted-foreground">{description}</p>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="text-sm text-muted-foreground hidden sm:block">
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
