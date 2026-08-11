import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  KanbanSquare,
  FolderKanban,
  Calendar,
  BarChart2,
  UserCircle,
  Settings,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useUIStore } from '@/store/useUIStore';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import { Logo } from '@/components/ui/Logo';
import { useEffect } from 'react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: FolderKanban, label: 'Projects', href: '/projects' },
  { icon: KanbanSquare, label: 'Kanban', href: '/board' },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
  { icon: Users, label: 'Team', href: '/team' },
  { icon: BarChart2, label: 'Reports', href: '/reports' },
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: UserCircle, label: 'Profile', href: '/profile' },
];

function SidebarContent({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const { toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <>
      <div className="h-16 flex items-center px-4 border-b border-slate-800">
        <div className="flex items-center gap-2 overflow-hidden w-full">
          {collapsed ? (
            <div className="w-full flex justify-center">
              <Logo iconOnly />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <Logo />
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 group',
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400'
                    : 'hover:bg-slate-800/50 hover:text-white',
                  collapsed && 'justify-center px-0'
                )
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={cn(
                  'w-5 h-5 shrink-0',
                  'group-hover:scale-110 transition-transform duration-200'
                )}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        {/* Only show collapse toggle on desktop */}
        <button
          onClick={toggleSidebar}
          className="hidden md:flex items-center justify-center w-full py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors mb-4"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>

        <div
          className={cn(
            'flex items-center gap-3 rounded-lg bg-slate-800/50 overflow-hidden transition-all',
            collapsed ? 'justify-center p-2' : 'px-3 py-2'
          )}
        >
          <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex flex-col whitespace-nowrap flex-1"
              >
                <span className="text-sm font-medium text-white text-left truncate">
                  {user?.name || 'Admin User'}
                </span>
                <span className="text-xs text-slate-500 text-left truncate">
                  {user?.role || 'Pro Plan'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!collapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-md transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

export function Sidebar() {
  const { sidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname, setMobileSidebarOpen]);

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarCollapsed ? 80 : 256,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="bg-slate-900 text-slate-300 flex-col h-screen fixed left-0 top-0 border-r border-slate-800 z-50 hidden md:flex"
      >
        <SidebarContent collapsed={sidebarCollapsed} />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed left-0 top-0 w-[280px] h-screen bg-slate-900 text-slate-300 flex flex-col z-[70] md:hidden border-r border-slate-800 shadow-2xl"
            >
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent collapsed={false} onNavigate={() => setMobileSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
