import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center space-y-6"
      >
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10 dark:opacity-5 blur-xl">
            <span className="text-[15rem] font-bold text-indigo-600">404</span>
          </div>
          <h1 className="relative text-9xl font-black text-slate-900 dark:text-white tracking-tight">
            404
          </h1>
        </div>

        <div className="space-y-2 relative z-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Page not found
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't
            exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 relative z-10">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700"
            onClick={() => navigate('/')}
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
