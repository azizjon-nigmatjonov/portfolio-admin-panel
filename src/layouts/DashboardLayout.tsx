import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/shared/components/Sidebar/Sidebar';
import { Header } from '@/shared/components/Header/Header';
import { useSidebar } from '@/app/store';

export const DashboardLayout: React.FC = () => {
  const { sidebarOpen } = useSidebar();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className={`flex min-w-0 flex-1 flex-col transition-[margin] duration-200 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
