import type { HTMLAttributes } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

// Omit transition from HTMLAttributes to allow framer-motion transition prop
type BaseDivProps = Omit<HTMLAttributes<HTMLDivElement>, 'transition'>;

export function Skeleton({ className, ...props }: BaseDivProps & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{
        repeat: Infinity,
        repeatType: 'reverse',
        duration: 1,
        ease: 'easeInOut',
      }}
      className={cn('rounded-md bg-slate-200 dark:bg-slate-800', className)}
      {...props}
    />
  );
}
