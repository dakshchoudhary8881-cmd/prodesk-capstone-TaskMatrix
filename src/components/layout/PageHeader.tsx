import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, ArrowRight, Home } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <div className={cn('mb-6 space-y-4', className)}>
      <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
        <button
          onClick={() => navigate(-1)}
          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors mr-2"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => navigate(1)}
          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors mr-2"
          aria-label="Go forward"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        <Link to="/" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Home</span>
        </Link>

        {pathnames.map((value, index) => {
          const isLast = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;

          return (
            <div key={to} className="flex items-center gap-1">
              <ChevronRight className="w-3.5 h-3.5" />
              {isLast ? (
                <span className="text-slate-900 dark:text-slate-200 font-medium capitalize">
                  {value.replace(/-/g, ' ')}
                </span>
              ) : (
                <Link to={to} className="hover:text-indigo-600 transition-colors capitalize">
                  {value.replace(/-/g, ' ')}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
