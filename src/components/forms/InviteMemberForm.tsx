import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUserStore } from '@/store/useUserStore';
import toast from 'react-hot-toast';

const inviteSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['Admin', 'Manager', 'Member'] as const),
  department: z.string().min(2, 'Department is required'),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface InviteMemberFormProps {
  onSuccess: () => void;
}

export function InviteMemberForm({ onSuccess }: InviteMemberFormProps) {
  const addUser = useUserStore((state) => state.addUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      role: 'Member',
    },
  });

  const onSubmit = async (data: InviteFormValues) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      addUser(data);
      toast.success('Member invited successfully');
      onSuccess();
    } catch {
      toast.error('Failed to invite member');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Full Name *
        </label>
        <input
          {...register('name')}
          className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm dark:text-white"
          placeholder="e.g. Jane Doe"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Email Address *
        </label>
        <input
          type="email"
          {...register('email')}
          className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm dark:text-white"
          placeholder="jane.doe@example.com"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Role
          </label>
          <select
            {...register('role')}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm appearance-none dark:text-white"
          >
            <option value="Member">Member</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Department *
          </label>
          <input
            {...register('department')}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm dark:text-white"
            placeholder="e.g. Engineering"
          />
          {errors.department && (
            <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>
          )}
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={onSuccess}
          className="px-4 py-2 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors text-sm shadow-indigo-200 dark:shadow-none disabled:opacity-50"
        >
          {isSubmitting ? 'Inviting...' : 'Send Invite'}
        </button>
      </div>
    </form>
  );
}
