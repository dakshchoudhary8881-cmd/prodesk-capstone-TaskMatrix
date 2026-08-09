import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

export const Search = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon className="h-4 w-4 text-slate-400" aria-hidden="true" />
        </div>
        <input
          ref={ref}
          type="search"
          className={cn(
            'block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100 dark:placeholder:text-slate-400',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Search.displayName = 'Search';
