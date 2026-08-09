import { workspaceRepository } from '@/repositories/workspaceRepository';
import type { Workspace } from '@/types';

export class WorkspaceService {
  static async getWorkspaces(): Promise<Workspace[]> {
    return await workspaceRepository.findAll();
  }

  static async getWorkspace(id: string): Promise<Workspace | null> {
    return await workspaceRepository.findById(id);
  }

  static async createWorkspace(data: Omit<Workspace, 'id'>): Promise<Workspace> {
    return await workspaceRepository.create(data);
  }

  static async updateWorkspace(id: string, data: Partial<Workspace>): Promise<Workspace> {
    return await workspaceRepository.update(id, data);
  }

  static async deleteWorkspace(id: string): Promise<boolean> {
    return await workspaceRepository.delete(id);
  }

  static async addMember(workspaceId: string, email: string, role: string) {
    return await workspaceRepository.addMember(workspaceId, email, role);
  }

  static async removeMember(workspaceId: string, memberId: string) {
    return await workspaceRepository.removeMember(workspaceId, memberId);
  }
}
