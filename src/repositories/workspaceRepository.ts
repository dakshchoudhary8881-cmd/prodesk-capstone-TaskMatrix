import { BaseRepository } from './baseRepository';
import type { Workspace } from '@/types';
import { apiClient } from '@/api/client';

class WorkspaceRepository extends BaseRepository<Workspace> {
  constructor() {
    super('workspaces', [
      {
        id: 'wsp_001',
        name: 'TaskMatrix HQ',
        plan: 'pro',
        members: ['usr_001', 'usr_002', 'usr_003', 'usr_004'],
      }
    ] as Workspace[]);
  }

  // Workspaces API might require special endpoints for members, etc.
  async addMember(workspaceId: string, email: string, role: string) {
    return apiClient.post(`/workspaces/${workspaceId}/members`, { email, role });
  }

  async removeMember(workspaceId: string, memberId: string) {
    return apiClient.delete(`/workspaces/${workspaceId}/members/${memberId}`);
  }
}

export const workspaceRepository = new WorkspaceRepository();
