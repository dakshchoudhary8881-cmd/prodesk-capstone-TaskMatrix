import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      // Mock API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Reset password for:', data.email);
      setIsSubmitted(true);
      toast.success('Password reset instructions sent!');
    } catch {
      toast.error('Failed to send reset instructions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="z-10 w-full max-w-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none my-8"
    >
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 dark:shadow-indigo-900/50">
          <KeyRound className="h-7 w-7" />
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Reset password
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium border border-emerald-100 dark:border-emerald-800/50 mb-6">
            Check your email for a link to reset your password. If it doesn't appear within a few
            minutes, check your spam folder.
          </div>
          <Link to="/login">
            <Button className="w-full">Return to login</Button>
          </Link>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">
              Email
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              autoFocus
              error={!!errors.email}
              {...register('email')}
            />
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-red-500"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <Button type="submit" className="mt-6 w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                Send Reset Link
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      )}

      {!isSubmitted && (
        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Remember your password?{' '}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Sign in
          </Link>
        </div>
      )}
    </motion.div>
  );
}
