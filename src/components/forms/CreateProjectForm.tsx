import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useProjectStore } from '@/store/useProjectStore';
import toast from 'react-hot-toast';
import type { Project } from '@/types';

const projectSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['planning', 'active', 'on-hold', 'completed'] as const),
  dueDate: z.string().min(1, 'Due date is required'),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface CreateProjectFormProps {
  onSuccess: () => void;
  initialData?: Project;
}

import { useWorkspaceStore } from '@/store/useWorkspaceStore';

export function CreateProjectForm({ onSuccess, initialData }: CreateProjectFormProps) {
  const { addProject, updateProject } = useProjectStore();
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      status: (initialData?.status as any) || 'planning',
      dueDate: initialData?.dueDate
        ? new Date(initialData.dueDate).toISOString().split('T')[0]
        : '',
    },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      // Mock API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (initialData) {
        updateProject(initialData.id, {
          ...data,
          dueDate: new Date(data.dueDate).toISOString(),
        });
        toast.success('Project updated successfully');
      } else {
        await addProject({
          ...data,
          progress: 0,
          startDate: new Date().toISOString(),
          dueDate: new Date(data.dueDate).toISOString(),
          workspace: currentWorkspace?.id || '',
        } as any);
        toast.success('Project created successfully');
      }
      onSuccess();
    } catch {
      toast.error('Failed to create project');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Project Name *
        </label>
        <input
          {...register('name')}
          className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm dark:text-white"
          placeholder="e.g. Website Redesign"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Description *
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm dark:text-white"
          placeholder="Brief description of the project..."
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Status
          </label>
          <select
            {...register('status')}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm appearance-none dark:text-white"
          >
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Due Date *
          </label>
          <input
            type="date"
            {...register('dueDate')}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm dark:text-white"
          />
          {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>}
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
          {isSubmitting ? 'Creating...' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}
