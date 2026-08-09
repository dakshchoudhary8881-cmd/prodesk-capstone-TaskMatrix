import { create } from 'zustand';
import type { Task, TaskStatus } from '@/types';
import { TaskService } from '@/services/TaskService';
import { ReportService } from '@/services/ReportService';
import toast from 'react-hot-toast';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (workspaceId?: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (id: string, status: TaskStatus) => Promise<void>;
  optimisticMove: (activeId: string, overId: string, isOverColumn: boolean) => void;
  finalizeMove: (id: string, newStatus: TaskStatus) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (workspaceId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await TaskService.getTasks(workspaceId);
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch tasks', isLoading: false });
    }
  },

  addTask: async (taskData) => {
    const previousState = get().tasks;

    // Create optimistic task
    const optimisticTask: Task = {
      ...taskData,
      id: `tmp_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      commentsCount: 0,
      attachmentsCount: 0,
      projectId: taskData.projectId || 'prj_001',
    } as Task;

    set({ tasks: [...previousState, optimisticTask] });
    const savingToast = toast.loading('Creating task...');

    try {
      const newTask = await TaskService.createTask(taskData);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === optimisticTask.id ? newTask : t)),
      }));
      toast.success('Task created successfully', { id: savingToast });
    } catch (error) {
      set({ tasks: previousState });
      toast.error('Failed to create task', { id: savingToast });
      throw error;
    }
  },

  updateTask: async (id, updates) => {
    const previousState = get().tasks;

    // Optimistic update
    set({
      tasks: previousState.map((t: Task) => (t.id === id ? { ...t, ...updates } : t)),
    });

    const savingToast = toast.loading('Updating task...');

    try {
      await TaskService.updateTask(id, updates);
      toast.success('Task updated', { id: savingToast });
    } catch (error) {
      set({ tasks: previousState });
      toast.error('Failed to update task, reverting', { id: savingToast });
      throw error;
    }
  },

  deleteTask: async (id) => {
    const previousState = get().tasks;

    // Optimistic update
    set({
      tasks: previousState.filter((t: Task) => t.id !== id),
    });

    const savingToast = toast.loading('Deleting task...');

    try {
      await TaskService.deleteTask(id);
      toast.success('Task deleted', { id: savingToast });
    } catch (error) {
      set({ tasks: previousState });
      toast.error('Failed to delete task, reverting', { id: savingToast });
      throw error;
    }
  },

  moveTask: async (id, status) => {
    const previousState = get().tasks;
    const task = previousState.find((t: Task) => t.id === id);
    if (!task || task.status === status) return;

    // Optimistic update
    set({
      tasks: previousState.map((t: Task) => (t.id === id ? { ...t, status } : t)),
    });

    // Subtle saving state
    const savingToast = toast.loading('Moving task...');

    try {
      await TaskService.moveTask(id, status);

      await ReportService.addActivity({
        action: `moved task`,
        taskId: id,
        newStatus: status,
      });

      toast.success('Task moved successfully', { id: savingToast });
    } catch (error) {
      // Rollback
      set({ tasks: previousState });
      toast.error('Failed to move task, reverting changes', { id: savingToast });
      throw error;
    }
  },

  optimisticMove: (activeId, overId, isOverColumn) => {
    set((state) => {
      const activeTaskIndex = state.tasks.findIndex((t) => t.id === activeId);
      if (activeTaskIndex === -1) return state;

      const activeTask = state.tasks[activeTaskIndex];
      let newStatus = activeTask.status;
      let overIndex = -1;

      if (isOverColumn) {
        newStatus = overId as TaskStatus;
      } else {
        overIndex = state.tasks.findIndex((t) => t.id === overId);
        if (overIndex !== -1) {
          newStatus = state.tasks[overIndex].status;
        }
      }

      if (activeTask.status === newStatus && activeTaskIndex === overIndex) return state;

      const newTasks = [...state.tasks];
      // Update status
      newTasks[activeTaskIndex] = { ...activeTask, status: newStatus };

      // Reorder if we know overIndex and it's different
      if (overIndex !== -1 && overIndex !== activeTaskIndex) {
        const [movedTask] = newTasks.splice(activeTaskIndex, 1);
        newTasks.splice(overIndex, 0, movedTask);
      }

      return { tasks: newTasks };
    });
  },

  finalizeMove: async (id, newStatus) => {
    const savingToast = toast.loading('Saving task position...');
    try {
      await TaskService.moveTask(id, newStatus);
      const { ReportService } = await import('@/services/ReportService');
      await ReportService.addActivity({
        action: `moved task`,
        taskId: id,
        newStatus,
      });
      toast.success('Task moved successfully', { id: savingToast });
    } catch (error) {
      // Full rollback might be tricky here because `optimisticMove` happened before.
      // Ideally we would store the exact previous state before `optimisticMove`.
      // For now, we revert by fetching tasks or doing a basic rollback.
      toast.error('Failed to save position', { id: savingToast });
      get().fetchTasks(); // Fallback without workspaceId is okay here or could be retrieved from state if needed
      throw error;
    }
  },
}));
