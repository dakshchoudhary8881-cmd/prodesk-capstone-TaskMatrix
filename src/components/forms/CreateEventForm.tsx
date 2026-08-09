import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEventStore } from '@/store/useEventStore';
import type { CalendarEvent } from '@/store/useEventStore';
import toast from 'react-hot-toast';

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  type: z.enum(['meeting', 'planning', 'review', 'milestone'] as const),
  start: z.string().min(1, 'Start time is required'),
  end: z.string().min(1, 'End time is required'),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface CreateEventFormProps {
  onSuccess: () => void;
  initialData?: CalendarEvent;
}

export function CreateEventForm({ onSuccess, initialData }: CreateEventFormProps) {
  const { addEvent, updateEvent } = useEventStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      type: initialData?.type || 'meeting',
      start: initialData?.start ? new Date(initialData.start).toISOString().slice(0, 16) : '',
      end: initialData?.end ? new Date(initialData.end).toISOString().slice(0, 16) : '',
    },
  });

  const onSubmit = async (data: EventFormValues) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const eventPayload = {
        ...data,
        description: data.description || '',
        start: new Date(data.start).toISOString(),
        end: new Date(data.end).toISOString(),
        attendees: initialData?.attendees || ['usr_001'],
      };

      if (initialData) {
        updateEvent(initialData.id, eventPayload);
        toast.success('Event updated successfully');
      } else {
        addEvent(eventPayload);
        toast.success('Event created successfully');
      }

      onSuccess();
    } catch {
      toast.error(initialData ? 'Failed to update event' : 'Failed to create event');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Title *
        </label>
        <input
          {...register('title')}
          className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm dark:text-white"
          placeholder="e.g. Sprint Planning"
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm dark:text-white"
          placeholder="Add more details..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Type
        </label>
        <select
          {...register('type')}
          className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm appearance-none dark:text-white"
        >
          <option value="meeting">Meeting</option>
          <option value="planning">Planning</option>
          <option value="review">Review</option>
          <option value="milestone">Milestone</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Start Time *
          </label>
          <input
            type="datetime-local"
            {...register('start')}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm dark:text-white"
          />
          {errors.start && <p className="text-red-500 text-xs mt-1">{errors.start.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            End Time *
          </label>
          <input
            type="datetime-local"
            {...register('end')}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm dark:text-white"
          />
          {errors.end && <p className="text-red-500 text-xs mt-1">{errors.end.message}</p>}
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
          {isSubmitting
            ? initialData
              ? 'Saving...'
              : 'Creating...'
            : initialData
              ? 'Save Changes'
              : 'Create Event'}
        </button>
      </div>
    </form>
  );
}
