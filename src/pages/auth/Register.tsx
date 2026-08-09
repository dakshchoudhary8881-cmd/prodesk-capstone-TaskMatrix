import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/store/useAuthStore';

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    company: z.string().min(2, 'Company name is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    terms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms and conditions' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch('password', '');

  useEffect(() => {
    let score = 0;
    if (!passwordValue) {
      setPasswordStrength(0);
      return;
    }
    if (passwordValue.length > 7) score += 1;
    if (/[A-Z]/.test(passwordValue)) score += 1;
    if (/[0-9]/.test(passwordValue)) score += 1;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score += 1;
    setPasswordStrength(score);
  }, [passwordValue]);

  const registerAction = useAuthStore((state) => state.register);

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await registerAction({
        name: data.fullName,
        email: data.email,
        password: data.password,
      });
      toast.success('Account created successfully! Please sign in.');
      navigate('/login');
    } catch {
      toast.error('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = (provider: string) => {
    toast.success(`Redirecting to ${provider}...`);
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
          <CheckSquare className="h-7 w-7" />
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Create an account
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Start managing your projects efficiently today.
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialSignup('Google')}
          className="w-full relative"
        >
          <svg className="h-5 w-5 absolute left-4" aria-hidden="true" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign up with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialSignup('GitHub')}
          className="w-full relative"
        >
          <svg
            className="h-5 w-5 absolute left-4 text-slate-900 dark:text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
          Sign up with GitHub
        </Button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            Or register with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">
            Full Name
          </label>
          <Input
            type="text"
            placeholder="John Doe"
            error={!!errors.fullName}
            {...register('fullName')}
          />
          <AnimatePresence>
            {errors.fullName && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-500"
              >
                {errors.fullName.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">
            Email
          </label>
          <Input
            type="email"
            placeholder="name@company.com"
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

        <div className="space-y-1.5">
          <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">
            Company Name
          </label>
          <Input
            type="text"
            placeholder="Acme Inc."
            error={!!errors.company}
            {...register('company')}
          />
          <AnimatePresence>
            {errors.company && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-500"
              >
                {errors.company.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">
            Password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              error={!!errors.password}
              className="pr-10"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Password Strength Meter */}
          {passwordValue.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="pt-1 flex gap-1"
            >
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={cn(
                    'h-1 w-1/4 rounded-full transition-colors duration-300',
                    passwordStrength >= level
                      ? passwordStrength < 2
                        ? 'bg-red-500'
                        : passwordStrength === 2
                          ? 'bg-amber-500'
                          : passwordStrength === 3
                            ? 'bg-blue-500'
                            : 'bg-emerald-500'
                      : 'bg-slate-200 dark:bg-slate-700'
                  )}
                />
              ))}
            </motion.div>
          )}

          <AnimatePresence>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-500"
              >
                {errors.password.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">
            Confirm Password
          </label>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            error={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
          <AnimatePresence>
            {errors.confirmPassword && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-500"
              >
                {errors.confirmPassword.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="pt-2">
          <Checkbox id="terms" label="I accept the Terms and Conditions" {...register('terms')} />
          <AnimatePresence>
            {errors.terms && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-500 mt-1"
              >
                {errors.terms.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <Button type="submit" className="mt-6 w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
              Create Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          Sign in
        </Link>
      </div>
    </motion.div>
  );
}
