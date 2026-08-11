import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task, Column as ColumnType } from '@/types';
import { TaskCard } from '@/components/cards/TaskCard';
import { cn } from '@/utils/cn';
import { MoreHorizontal, Plus, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onCreateTask?: () => void;
}

export function Column({ column, tasks, onTaskClick, onCreateTask }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  return (
    <div className="flex h-full w-[85vw] sm:w-80 shrink-0 flex-col overflow-hidden rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200/60 bg-slate-50/50 p-4 dark:border-slate-800/60 dark:bg-slate-900/30">
        <div className="flex items-center gap-2.5">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">{column.title}</h3>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCreateTask?.()}
            className="h-8 w-8 text-slate-500 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex flex-1 flex-col gap-3 overflow-y-auto p-3 transition-colors kanban-scrollbar',
          isOver && 'bg-indigo-50/50 dark:bg-indigo-900/10'
        )}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <TaskCard task={task} onClick={() => onTaskClick(task)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </SortableContext>

        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              'mt-2 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed rounded-xl transition-colors',
              isOver
                ? 'border-indigo-300 bg-indigo-50/50 dark:border-indigo-700/50 dark:bg-indigo-900/20'
                : 'border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30'
            )}
          >
            <div
              className={cn(
                'p-3 rounded-full mb-3',
                isOver
                  ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
                  : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
              )}
            >
              <Inbox className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No tasks yet</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Drop a task here to add it to this column
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
