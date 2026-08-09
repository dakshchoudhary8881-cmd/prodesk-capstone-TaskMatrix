import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTaskStore } from '@/store/useTaskStore';
import toast from 'react-hot-toast';
import type { Task } from '@/types';

const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const),
  status: z.enum(['todo', 'in-progress', 'review', 'done'] as const),
  assignee: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface CreateTaskFormProps {
  onSuccess: () => void;
  initialData?: Task;
}

import { useWorkspaceStore } from '@/store/useWorkspaceStore';

export function CreateTaskForm({ onSuccess, initialData }: CreateTaskFormProps) {
  const { addTask, updateTask } = useTaskStore();
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      priority: initialData?.priority || 'medium',
      status: initialData?.status || 'todo',
      assignee: (typeof initialData?.assignee === 'object' ? (initialData.assignee as any).id : initialData?.assignee) || initialData?.assigneeId || '',
    },
  });

  const onSubmit = async (data: TaskFormValues) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (initialData) {
        await updateTask(initialData.id, data);
        toast.success('Task updated successfully');
      } else {
        await addTask({ 
          ...data, 
          projectId: 'prj_001', 
          workspace: currentWorkspace?.id || '' 
        } as any);
        toast.success('Task created successfully');
      }
      onSuccess();
    } catch {
      toast.error('Failed to create task');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
        <input
          {...register('title')}
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
          placeholder="e.g. Design homepage layout"
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
          placeholder="Add more details about this task..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select
            {...register('status')}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm appearance-none"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
          <select
            {...register('priority')}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm appearance-none"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Assignee</label>
        <input
          {...register('assignee')}
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
          placeholder="e.g. John Doe"
        />
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={onSuccess}
          className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors text-sm shadow-indigo-200 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
