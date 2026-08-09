import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Logo } from '@/components/ui/Logo';

export function AuthLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 relative">
      <div className="absolute top-6 left-6 z-20">
        <Logo />
      </div>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-transparent dark:from-indigo-900/20 pointer-events-none"></div>
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <Outlet />
      </div>
    </div>
  );
}
