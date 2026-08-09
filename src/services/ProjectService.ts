import { apiClient } from '@/api/client';
import type { Project } from '@/types';

export class ProjectService {
  static async getAllProjects(workspaceId?: string): Promise<Project[]> {
    const url = workspaceId ? `/projects?workspace=${workspaceId}` : '/projects';
    return await apiClient.get<Project[]>(url);
  }

  static async getProjectById(id: string): Promise<Project | null> {
    return await apiClient.get<Project>(`/projects/${id}`);
  }

  static async createProject(data: Partial<Project>): Promise<Project> {
    return await apiClient.post<Project>('/projects', data);
  }

  static async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    return await apiClient.patch<Project>(`/projects/${id}`, data);
  }

  static async deleteProject(id: string): Promise<boolean> {
    return await apiClient.delete(`/projects/${id}`);
  }
}
