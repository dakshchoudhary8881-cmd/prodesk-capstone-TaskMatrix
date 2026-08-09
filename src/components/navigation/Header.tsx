import { useState } from 'react';
import { Bell, Search, Settings, UserCircle, LogOut } from 'lucide-react';
import { Modal } from '@/components/modals/Modal';
import { CreateTaskForm } from '@/components/forms/CreateTaskForm';
import { NotificationPanel } from '@/components/panels/NotificationPanel';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '@/store/useNotificationStore';
import toast from 'react-hot-toast';

export function Header() {
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const { user, logout } = useAuthStore();
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const navigate = useNavigate();

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex-1 max-w-xl flex items-center">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
              className="w-full flex items-center gap-2 pl-4 pr-3 py-2 bg-slate-50 border border-slate-200 hover:border-indigo-500/50 rounded-lg text-sm text-slate-500 transition-all dark:bg-slate-900/50 dark:border-slate-800 dark:hover:border-indigo-500/50"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span className="flex-1 text-left">Search tasks, boards, or people...</span>
              <kbd className="hidden sm:inline-block border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded px-2 py-0.5 text-xs font-sans font-medium text-slate-400 shadow-sm">
                Ctrl K
              </kbd>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 ml-4">
          <ThemeToggle />
          <button
            onClick={() => setIsNotificationPanelOpen(true)}
            className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          <Dropdown
            isOpen={isProfileMenuOpen}
            onClose={() => setIsProfileMenuOpen(false)}
            trigger={
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 rounded-full ring-2 ring-transparent hover:ring-indigo-100 transition-all focus:outline-none focus:ring-indigo-500"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </button>
            }
          >
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user?.email || 'admin@taskmatrix.com'}
              </p>
            </div>
            <DropdownItem
              icon={<UserCircle />}
              onClick={() => {
                setIsProfileMenuOpen(false);
                navigate('/profile');
              }}
            >
              Profile
            </DropdownItem>
            <DropdownItem
              icon={<Settings />}
              onClick={() => {
                setIsProfileMenuOpen(false);
                navigate('/settings');
              }}
            >
              Settings
            </DropdownItem>
            <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
            <DropdownItem
              icon={<LogOut />}
              onClick={() => {
                setIsProfileMenuOpen(false);
                logout();
                toast.success('Logged out');
              }}
              className="text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Log out
            </DropdownItem>
          </Dropdown>

          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="hidden sm:flex px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors shadow-indigo-200"
          >
            + New Task
          </button>
        </div>
      </header>

      <Modal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        title="Create New Task"
      >
        <CreateTaskForm onSuccess={() => setIsNewTaskModalOpen(false)} />
      </Modal>

      <NotificationPanel
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
      />
    </>
  );
}
