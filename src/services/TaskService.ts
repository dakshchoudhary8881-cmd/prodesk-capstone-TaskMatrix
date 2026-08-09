import { apiClient } from '@/api/client';
import type { Task, TaskStatus, Comment } from '@/types';

export class TaskService {
  static async getTasks(workspaceId?: string): Promise<Task[]> {
    const url = workspaceId ? `/tasks?workspace=${workspaceId}` : '/tasks';
    return await apiClient.get<Task[]>(url);
  }

  static async getAllTasks(): Promise<Task[]> {
    return await apiClient.get<Task[]>('/tasks');
  }

  static async getTaskById(id: string): Promise<Task | null> {
    return await apiClient.get<Task>(`/tasks/${id}`);
  }

  static async createTask(data: Partial<Task>): Promise<Task> {
    return await apiClient.post<Task>('/tasks', data);
  }

  static async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    return await apiClient.patch<Task>(`/tasks/${id}`, data);
  }

  static async deleteTask(id: string): Promise<boolean> {
    return await apiClient.delete(`/tasks/${id}`);
  }

  static async moveTask(id: string, status: TaskStatus): Promise<Task> {
    return await apiClient.patch<Task>(`/tasks/${id}/status`, { status });
  }

  // Comments
  static async getTaskComments(taskId: string): Promise<Comment[]> {
    return await apiClient.get<Comment[]>(`/tasks/${taskId}/comments`);
  }

  static async addComment(taskId: string, data: { content: string }): Promise<Comment> {
    return await apiClient.post<Comment>(`/tasks/${taskId}/comments`, data);
  }

  static async updateComment(_taskId: string, commentId: string, data: { content: string }): Promise<Comment> {
    return await apiClient.patch<Comment>(`/comments/${commentId}`, data);
  }

  static async deleteComment(_taskId: string, commentId: string): Promise<boolean> {
    return await apiClient.delete(`/comments/${commentId}`);
  }

  // Attachments (placeholder — no backend endpoint yet)
  static async getTaskAttachments(_taskId: string): Promise<any[]> {
    return [];
  }
}
