import type { ReactNode } from 'react';
import { useState } from 'react';
import { cn } from '@/utils/cn';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function Tooltip({ content, children, position = 'top', className }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            'absolute z-50 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs text-white opacity-100 shadow-sm dark:bg-slate-50 dark:text-slate-900',
            positions[position],
            className
          )}
          role="tooltip"
        >
          {content}
          <div
            className={cn(
              'absolute h-2 w-2 bg-slate-900 dark:bg-slate-50',
              position === 'top' && 'bottom-[-4px] left-1/2 -translate-x-1/2 rotate-45',
              position === 'bottom' && 'top-[-4px] left-1/2 -translate-x-1/2 rotate-45',
              position === 'left' && 'right-[-4px] top-1/2 -translate-y-1/2 rotate-45',
              position === 'right' && 'left-[-4px] top-1/2 -translate-y-1/2 rotate-45'
            )}
          />
        </div>
      )}
    </div>
  );
}
