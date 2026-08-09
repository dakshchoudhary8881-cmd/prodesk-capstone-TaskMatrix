import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            ref={ref}
            className={cn(
              'peer h-4 w-4 shrink-0 appearance-none rounded-sm border border-slate-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:checked:border-indigo-500 dark:checked:bg-indigo-500 dark:focus:ring-offset-slate-950 transition-all',
              className
            )}
            {...props}
          />
          <svg
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden h-3 w-3 text-white peer-checked:block"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm font-medium text-slate-700 select-none cursor-pointer dark:text-slate-300"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';
