import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  trigger: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  align?: 'left' | 'right';
}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ className, trigger, isOpen, onClose, align = 'right', children, ...props }, ref) => {
    return (
      <div className="relative inline-block text-left" ref={ref} {...props}>
        <div onClick={(e) => e.stopPropagation()}>{trigger}</div>

        <AnimatePresence>
          {isOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={onClose} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className={cn(
                  'absolute z-50 mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:ring-white/10',
                  align === 'right' ? 'right-0' : 'left-0',
                  className
                )}
              >
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {children}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
Dropdown.displayName = 'Dropdown';

interface DropdownItemProps extends HTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
}

export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  ({ className, children, icon, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50 transition-colors',
          className
        )}
        role="menuitem"
        {...props}
      >
        {icon && <span className="h-4 w-4">{icon}</span>}
        {children}
      </button>
    );
  }
);
DropdownItem.displayName = 'DropdownItem';
