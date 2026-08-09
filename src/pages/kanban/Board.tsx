import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Column } from './Column';
import { TaskCard } from '@/components/cards/TaskCard';
import { TaskDetailsPanel } from '@/components/panels/TaskDetailsPanel';
import { useTaskStore } from '@/store/useTaskStore';
import type { Task, Column as ColumnType, TaskStatus } from '@/types';

const columns: ColumnType[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

export function Board({
  searchQuery = '',
  filterPriority = 'all',
  onCreateTask,
}: {
  searchQuery?: string;
  filterPriority?: string;
  onCreateTask?: (status: TaskStatus) => void;
}) {
  const { tasks, optimisticMove, finalizeMove } = useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;

    return matchesSearch && matchesPriority;
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const isOverColumn = over.data.current?.type === 'Column';

    let newStatus: TaskStatus | null = null;

    if (isOverColumn) {
      newStatus = overId as TaskStatus;
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    if (newStatus) {
      finalizeMove(activeId, newStatus);
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isOverColumn = over.data.current?.type === 'Column';
    const isOverTask = over.data.current?.type === 'Task';

    if (isOverColumn || isOverTask) {
      optimisticMove(activeId, overId, isOverColumn);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className="flex gap-6 overflow-x-auto pb-4 pt-2 h-full items-start kanban-scrollbar">
        {columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            tasks={filteredTasks.filter((t) => t.status === col.id)}
            onTaskClick={(task) => setSelectedTask(task)}
            onCreateTask={() => onCreateTask?.(col.id)}
          />
        ))}
      </div>

      <DragOverlay>{activeTask ? <TaskCard task={activeTask} /> : null}</DragOverlay>

      <TaskDetailsPanel
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </DndContext>
  );
}
