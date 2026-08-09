import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Folder, CheckSquare, Users, FileText, Terminal, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { useProjectStore } from '@/store/useProjectStore';
import { useTaskStore } from '@/store/useTaskStore';
import { useUserStore } from '@/store/useUserStore';
import { ReportService } from '@/services/ReportService';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    const handleOpenEvent = () => setIsOpen(true);

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleOpenEvent);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleOpenEvent);
    };
  }, []);

  const { projects, fetchProjects } = useProjectStore();
  const { tasks, fetchTasks } = useTaskStore();
  const { users, fetchUsers } = useUserStore();
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';

      fetchProjects();
      fetchTasks();
      fetchUsers();
      ReportService.getReports().then(setReports).catch(console.error);
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, fetchProjects, fetchTasks, fetchUsers]);

  const searchResults = () => {
    if (!query) return [];
    const q = query.toLowerCase();

    const results = [];

    // Commands
    const commands = [
      { id: 'c1', title: 'Go to Dashboard', icon: Terminal, type: 'Command', path: '/' },
      { id: 'c2', title: 'Go to Projects', icon: Terminal, type: 'Command', path: '/projects' },
      { id: 'c3', title: 'Go to Kanban Board', icon: Terminal, type: 'Command', path: '/kanban' },
      { id: 'c4', title: 'Go to Calendar', icon: Terminal, type: 'Command', path: '/calendar' },
      { id: 'c5', title: 'Go to Team', icon: Terminal, type: 'Command', path: '/team' },
      { id: 'c6', title: 'Go to Reports', icon: Terminal, type: 'Command', path: '/reports' },
      { id: 'c7', title: 'Go to Settings', icon: Terminal, type: 'Command', path: '/settings' },
    ];
    results.push(...commands.filter((c) => c.title.toLowerCase().includes(q)));

    // Projects
    results.push(
      ...projects
        .filter((p) => p.name.toLowerCase().includes(q))
        .map((p) => ({
          id: p.id,
          title: p.name,
          icon: Folder,
          type: 'Project',
          path: '/projects',
        }))
    );

    // Tasks
    results.push(
      ...tasks
        .filter((t) => t.title.toLowerCase().includes(q))
        .map((t) => ({
          id: t.id,
          title: t.title,
          icon: CheckSquare,
          type: 'Task',
          path: '/kanban',
        }))
    );

    // Members
    results.push(
      ...users
        .filter((u) => u.name.toLowerCase().includes(q))
        .map((u) => ({
          id: u.id,
          title: u.name,
          icon: Users,
          type: 'Member',
          path: '/team',
        }))
    );

    // Reports
    results.push(
      ...reports
        .filter((r) => r.title.toLowerCase().includes(q))
        .map((r) => ({
          id: r.id,
          title: r.title,
          icon: FileText,
          type: 'Report',
          path: '/reports',
        }))
    );

    return results.slice(0, 8); // Max 8 results
  };

  const results = searchResults();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % (results.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + (results.length || 1)) % (results.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0 && results[activeIndex]) {
        navigate(results[activeIndex].path);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative w-full max-w-xl bg-white dark:bg-slate-950 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
          >
            <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800/60">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search projects, tasks, members, or commands..."
                className="flex-1 bg-transparent border-none focus:outline-none px-3 text-slate-900 dark:text-white placeholder:text-slate-400"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {query && results.length === 0 && (
              <div className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                No results found for "{query}".
              </div>
            )}

            {query && results.length > 0 && (
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {results.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={`${item.type}-${item.id}`}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => {
                        navigate(item.path);
                        setIsOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                        activeIndex === idx
                          ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-900/50 text-slate-700 dark:text-slate-300'
                      )}
                    >
                      <div
                        className={cn(
                          'p-1.5 rounded-md',
                          activeIndex === idx
                            ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            'text-sm font-medium truncate',
                            activeIndex === idx
                              ? 'text-indigo-700 dark:text-indigo-300'
                              : 'text-slate-900 dark:text-slate-200'
                          )}
                        >
                          {item.title}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded uppercase tracking-wider">
                        {item.type}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {!query && (
              <div className="px-4 py-8 text-center border-t border-slate-50 dark:border-slate-900/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Search across the entire workspace or type{' '}
                  <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-xs text-slate-600 dark:text-slate-300 mx-1">
                    /
                  </kbd>{' '}
                  for commands.
                </p>
              </div>
            )}

            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/30">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 shadow-sm font-sans">
                    ↑
                  </kbd>{' '}
                  <kbd className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 shadow-sm font-sans">
                    ↓
                  </kbd>{' '}
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 shadow-sm font-sans">
                    ↵
                  </kbd>{' '}
                  to select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 shadow-sm font-sans">
                    ESC
                  </kbd>{' '}
                  to close
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
