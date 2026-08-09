import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { Toaster } from 'react-hot-toast';
import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { NotFound } from '@/pages/NotFound';
import { Forbidden } from '@/pages/Forbidden';
import { ServerError } from '@/pages/ServerError';
import { socketService } from '@/services/SocketService';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

const Dashboard = lazy(() => import('@/pages/dashboard').then((m) => ({ default: m.Dashboard })));
const Projects = lazy(() => import('@/pages/projects').then((m) => ({ default: m.Projects })));
const BoardPage = lazy(() => import('@/pages/kanban').then((m) => ({ default: m.BoardPage })));
const Login = lazy(() => import('@/pages/auth').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('@/pages/auth').then((m) => ({ default: m.Register })));
const ForgotPassword = lazy(() =>
  import('@/pages/auth').then((m) => ({ default: m.ForgotPassword }))
);
const Calendar = lazy(() => import('@/pages/calendar').then((m) => ({ default: m.Calendar })));
const Reports = lazy(() => import('@/pages/reports').then((m) => ({ default: m.Reports })));
const Settings = lazy(() => import('@/pages/settings').then((m) => ({ default: m.Settings })));
const Profile = lazy(() => import('@/pages/profile').then((m) => ({ default: m.Profile })));
const Team = lazy(() => import('@/pages/team').then((m) => ({ default: m.Team })));

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      <p className="text-slate-500 font-medium">Loading...</p>
    </div>
  </div>
);

function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { theme, setTheme } = useThemeStore();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Initial application of the theme from the store
    setTheme(theme);
    
    // Check real backend authentication state on mount
    useAuthStore.getState().checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      socketService.connect();
      // Fetch user's workspaces
      useWorkspaceStore.getState().fetchWorkspaces();
    } else {
      socketService.disconnect();
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="board" element={<BoardPage />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="team" element={<Team />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Error Pages */}
          <Route path="/403" element={<Forbidden />} />
          <Route path="/500" element={<ServerError />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="bottom-right" />
    </Router>
  );
}

export default App;
