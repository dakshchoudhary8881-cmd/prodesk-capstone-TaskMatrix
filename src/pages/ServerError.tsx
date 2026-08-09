import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ServerCrash, RefreshCcw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ServerError() {
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
            <span className="text-[15rem] font-bold text-amber-500">500</span>
          </div>
          <h1 className="relative text-9xl font-black text-slate-900 dark:text-white tracking-tight">
            500
          </h1>
        </div>

        <div className="space-y-2 relative z-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-600 dark:text-amber-500">
              <ServerCrash className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Internal Server Error
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Oops! Something went wrong on our end. We're looking into it. Please try refreshing the
            page or come back later.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 relative z-10">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white border-none"
            onClick={() => window.location.reload()}
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
