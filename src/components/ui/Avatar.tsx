import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, fallback, size = 'md', ...props }, ref) => {
    const sizes = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex shrink-0 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900',
          sizes[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img src={src} alt={fallback} className="aspect-square h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-medium text-slate-600 dark:text-slate-300">
            {fallback.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';
