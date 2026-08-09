import { BaseRepository } from './baseRepository';
import type { Task } from '@/types';
import db from '@/mock/db.json';

class TaskRepository extends BaseRepository<Task> {
  constructor() {
    super('tasks', db.tasks as Task[]);
  }

  // Add any task-specific repository methods here if needed
}

export const taskRepository = new TaskRepository();
