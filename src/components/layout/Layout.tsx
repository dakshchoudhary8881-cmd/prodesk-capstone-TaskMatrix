import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Header } from '@/components/navigation/Header';
import { useUIStore } from '@/store/useUIStore';
import { CommandPalette } from '@/components/modals/CommandPalette';

export function Layout() {
  const location = useLocation();
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <Sidebar />
      <motion.div
        layout
        className="flex-1 flex flex-col min-h-screen"
        initial={false}
        animate={{
          marginLeft: sidebarCollapsed ? '80px' : '256px',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="container mx-auto p-6 max-w-7xl h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>
      <CommandPalette />
    </div>
  );
}
