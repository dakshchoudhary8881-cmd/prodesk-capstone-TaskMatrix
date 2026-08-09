import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Forbidden() {
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
            <span className="text-[15rem] font-bold text-red-600">403</span>
          </div>
          <h1 className="relative text-9xl font-black text-slate-900 dark:text-white tracking-tight flex justify-center items-center gap-4">
            403
          </h1>
        </div>

        <div className="space-y-2 relative z-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-500">
              <ShieldAlert className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Access Denied
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            You don't have permission to access this resource. Please contact your workspace
            administrator if you believe this is a mistake.
          </p>
        </div>

        <div className="flex justify-center pt-4 relative z-10">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
