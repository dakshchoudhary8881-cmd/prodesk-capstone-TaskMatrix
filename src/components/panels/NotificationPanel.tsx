import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Bell,
  AtSign,
  Briefcase,
  Info,
  AlertCircle,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { cn } from '@/utils/cn';
import { useNotificationStore } from '@/store/useNotificationStore';
import { Search } from '@/components/ui/Search';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
  } = useNotificationStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'Unread') return !n.read;
    if (filter === 'Mentions') return n.type === 'mention';
    if (filter === 'Assignments') return n.type === 'assignment';
    if (filter === 'Updates') return n.type === 'system' || n.type === 'alert';
    return true;
  });

  const paginatedNotifications = filtered.slice(0, visibleCount);

  const simulateNotification = () => {
    addNotification({
      userId: 'usr_001',
      title: 'New Mock Notification',
      message: 'This is a simulated notification that arrived just now!',
      type: 'mention',
      link: '/some/link',
    });
    toast.success('Mock notification generated');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'mention':
        return <AtSign className="h-4 w-4 text-purple-500" />;
      case 'assignment':
        return <Briefcase className="h-4 w-4 text-blue-500" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'system':
        return <Info className="h-4 w-4 text-slate-500" />;
      default:
        return <Bell className="h-4 w-4 text-slate-500" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'mention':
        return 'bg-purple-100 dark:bg-purple-900/30 ring-purple-50 dark:ring-purple-900/10';
      case 'assignment':
        return 'bg-blue-100 dark:bg-blue-900/30 ring-blue-50 dark:ring-blue-900/10';
      case 'alert':
        return 'bg-red-100 dark:bg-red-900/30 ring-red-50 dark:ring-red-900/10';
      case 'system':
        return 'bg-slate-100 dark:bg-slate-800 ring-slate-50 dark:ring-slate-900/10';
      default:
        return 'bg-slate-100 dark:bg-slate-800 ring-slate-50 dark:ring-slate-900/10';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity"
          />

          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-2xl dark:bg-slate-950 sm:w-[400px] border-l border-slate-200 dark:border-slate-800"
          >
            {/* Header */}
            <div className="flex flex-col border-b border-slate-200 px-6 py-4 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Notifications
                  </h2>
                  {unreadCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={simulateNotification}
                    className="h-8 text-xs"
                  >
                    Simulate
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 text-slate-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mb-4">
                <Search
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Tabs className="w-full overflow-x-auto kanban-scrollbar pb-1">
                  <TabsList className="bg-transparent h-8 p-0 gap-4">
                    {['All', 'Unread', 'Mentions', 'Assignments', 'Updates'].map((tab) => (
                      <TabsTrigger
                        key={tab}
                        active={filter === tab}
                        onClick={() => setFilter(tab)}
                        className={cn(
                          'px-0 py-1 rounded-none border-b-2 border-transparent',
                          filter === tab &&
                            'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-transparent shadow-none'
                        )}
                      >
                        {tab}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-2 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-medium text-slate-500">
                {filtered.length} {filtered.length === 1 ? 'Notification' : 'Notifications'}
              </span>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-7 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1.5" /> Mark all read
                </Button>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto kanban-scrollbar p-2">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="h-16 w-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                    <Bell className="h-8 w-8 text-slate-300 dark:text-slate-700" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                    All caught up!
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    You don't have any {filter.toLowerCase()} notifications right now.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <AnimatePresence mode="popLayout">
                    {paginatedNotifications.map((notification) => (
                      <motion.div
                        layout
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={cn(
                          'relative p-4 rounded-xl border transition-colors group cursor-pointer hover:shadow-sm',
                          !notification.read
                            ? 'bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/50'
                            : 'bg-white dark:bg-slate-950/50 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        )}
                        onClick={() => markAsRead(notification.id)}
                      >
                        {!notification.read && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full" />
                        )}

                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                              toast.success('Notification deleted');
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex gap-4 items-start pl-2 pr-4">
                          <div
                            className={cn(
                              'h-10 w-10 shrink-0 rounded-full flex items-center justify-center ring-4 mt-1',
                              getBg(notification.type)
                            )}
                          >
                            {getIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col gap-0.5 mb-1">
                              <p
                                className={cn(
                                  'text-sm font-medium text-slate-900 dark:text-white',
                                  !notification.read && 'font-bold'
                                )}
                              >
                                {notification.title}
                              </p>
                              <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">
                                {new Date(notification.createdAt).toLocaleDateString([], {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug pr-2">
                              {notification.message}
                            </p>
                            {notification.link && (
                              <div className="mt-2 flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400 opacity-80 group-hover:opacity-100 transition-opacity">
                                View details <ChevronRight className="h-3 w-3 ml-0.5" />
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {visibleCount < filtered.length && (
                    <Button
                      variant="ghost"
                      className="w-full text-slate-500 my-2"
                      onClick={() => setVisibleCount((v) => v + 10)}
                    >
                      Load More
                    </Button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
