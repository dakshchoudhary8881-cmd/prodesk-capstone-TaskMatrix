import { create } from 'zustand';
import type { Workspace } from '@/types';
import { WorkspaceService } from '@/services/WorkspaceService';

interface WorkspaceState {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  isLoading: boolean;
  error: string | null;
  fetchWorkspaces: () => Promise<void>;
  setCurrentWorkspace: (id: string) => void;
  addWorkspace: (workspace: Omit<Workspace, 'id'>) => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspaces: [],
  currentWorkspace: null,
  isLoading: false,
  error: null,

  fetchWorkspaces: async () => {
    set({ isLoading: true, error: null });
    try {
      const workspaces = await WorkspaceService.getWorkspaces();
      set({
        workspaces,
        currentWorkspace: workspaces.length > 0 ? workspaces[0] : null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: 'Failed to fetch workspaces', isLoading: false });
    }
  },

  setCurrentWorkspace: (id) =>
    set((state) => ({
      currentWorkspace: state.workspaces.find((w) => w.id === id) || state.currentWorkspace,
    })),

  addWorkspace: async (workspaceData) => {
    try {
      const newWorkspace = await WorkspaceService.createWorkspace(workspaceData);
      set((state) => ({
        workspaces: [...state.workspaces, newWorkspace],
        currentWorkspace: state.currentWorkspace || newWorkspace,
      }));
    } catch (error) {
      throw error;
    }
  },
}));
