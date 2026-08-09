import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  indicatorClassName?: string;
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, max = 100, indicatorClassName, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div
        ref={ref}
        className={cn(
          'relative h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800',
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'h-full bg-indigo-600 transition-all duration-300 ease-in-out',
            indicatorClassName
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);
ProgressBar.displayName = 'ProgressBar';
