import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '@/types';
import { GripVertical, Clock, MessageSquare, Paperclip, CheckSquare } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useUserStore } from '@/store/useUserStore';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const priorityVariants: Record<string, 'secondary' | 'default' | 'destructive'> = {
    low: 'secondary',
    medium: 'default',
    high: 'destructive',
    urgent: 'destructive',
  };

  const labelColors: Record<string, string> = {
    bug: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    feature: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    design: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    frontend: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    backend: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  };

  // Mock numbers for comments and attachments just for UI if not provided
  const commentsCount = task.commentsCount ?? task.id.charCodeAt(0) % 5;
  const attachmentsCount = task.attachmentsCount ?? (task.id.charCodeAt(0) * 2) % 4;
  const { users } = useUserStore();
  const assigneeName = typeof task.assignee === 'object' && task.assignee
    ? (task.assignee as any).name
    : typeof task.assignee === 'string' ? task.assignee : undefined;
  const assigneeUser = users.find((u) => u.id === task.assigneeId) || {
    name: assigneeName || 'Unassigned',
    avatar: assigneeName ? `https://i.pravatar.cc/150?u=${assigneeName}` : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/50',
        isDragging && 'opacity-50 ring-2 ring-indigo-500 shadow-xl z-50',
        !isDragging && 'cursor-pointer active:cursor-grabbing'
      )}
      onClick={onClick}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute right-3 top-3 cursor-grab text-slate-400 opacity-0 transition-opacity active:cursor-grabbing group-hover:opacity-100 dark:text-slate-500"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="mb-3 flex items-center flex-wrap gap-2">
        <Badge
          variant={priorityVariants[task.priority]}
          className="uppercase text-[10px] tracking-wider px-2 py-0"
        >
          {task.priority}
        </Badge>
        {task.labels?.map((label) => (
          <span
            key={label}
            className={cn(
              'text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium',
              labelColors[label.toLowerCase()] ||
                'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            )}
          >
            {label}
          </span>
        ))}
      </div>

      <h4 className="mb-1.5 pr-6 text-sm font-semibold text-slate-900 dark:text-white line-clamp-2">
        {task.title}
      </h4>

      {task.description && (
        <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {task.description}
        </p>
      )}

      {task.checklist && !Array.isArray(task.checklist) && (task.checklist as any).total > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <div className="flex items-center gap-1.5">
              <CheckSquare className="h-3.5 w-3.5" />
              <span>Checklist</span>
            </div>
            <span>
              {(task.checklist as any).completed}/{(task.checklist as any).total}
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{ width: `${((task.checklist as any).completed / (task.checklist as any).total) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div
            className="flex items-center gap-1"
            title={task.dueDate ? 'Due date' : 'Created date'}
          >
            <Clock
              className={cn(
                'h-3.5 w-3.5',
                task.dueDate && new Date(task.dueDate) < new Date() ? 'text-red-500' : ''
              )}
            />
            <span
              className={cn(
                task.dueDate && new Date(task.dueDate) < new Date()
                  ? 'text-red-500 font-medium'
                  : ''
              )}
            >
              {new Date(task.dueDate || task.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          {commentsCount > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{commentsCount}</span>
            </div>
          )}
          {attachmentsCount > 0 && (
            <div className="flex items-center gap-1">
              <Paperclip className="h-3.5 w-3.5" />
              <span>{attachmentsCount}</span>
            </div>
          )}
        </div>

        {(task.assignee || task.assigneeId) && (
          <Avatar
            src={assigneeUser?.avatar}
            fallback={assigneeUser?.name || 'U'}
            size="sm"
            className="ring-2 ring-white dark:ring-slate-900"
          />
        )}
      </div>
    </div>
  );
}
