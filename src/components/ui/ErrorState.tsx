import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils/cn';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading this content. Please try again later.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-slate-500 dark:text-slate-400">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}
