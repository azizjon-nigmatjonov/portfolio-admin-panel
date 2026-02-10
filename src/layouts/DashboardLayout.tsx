import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, useOutlet } from 'react-router-dom';
import { Sidebar } from '@/shared/components/Sidebar/Sidebar';
import { Header } from '@/shared/components/Header/Header';
import { useSidebar } from '@/app/store';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

const pageVariants = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
};

const pageTransition = { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const };

function AnimatedOutlet() {
  const outlet = useOutlet();
  const [outletCache] = useState(outlet);
  return <>{outletCache ?? outlet}</>;
}

export const DashboardLayout: React.FC = () => {
  const { sidebarOpen } = useSidebar();
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? { initial: {}, animate: {}, exit: {} } : pageVariants;
  const transition = prefersReducedMotion ? { duration: 0 } : pageTransition;

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
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}
              transition={transition}
              className="h-full"
            >
              <AnimatedOutlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
