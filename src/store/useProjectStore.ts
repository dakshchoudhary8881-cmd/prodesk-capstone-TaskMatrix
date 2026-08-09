import { create } from 'zustand';
import type { Project } from '@/types';
import { ProjectService } from '@/services/ProjectService';
import toast from 'react-hot-toast';

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: (workspaceId?: string) => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  isLoading: false,
  error: null,

  fetchProjects: async (workspaceId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const projects = await ProjectService.getAllProjects(workspaceId);
      set({ projects, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch projects', isLoading: false });
    }
  },

  addProject: async (projectData) => {
    try {
      const newProject = await ProjectService.createProject(projectData);
      set((state) => ({
        projects: [...state.projects, newProject],
      }));
      toast.success('Project created successfully');
    } catch (error) {
      toast.error('Failed to create project');
      throw error;
    }
  },

  updateProject: async (id, updates) => {
    try {
      // Optimistic update
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      }));
      await ProjectService.updateProject(id, updates);
    } catch (error) {
      toast.error('Failed to update project');
      // Revert could be handled here
      throw error;
    }
  },

  deleteProject: async (id) => {
    try {
      // Optimistic update
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
      }));
      await ProjectService.deleteProject(id);
      toast.success('Project deleted');
    } catch (error) {
      toast.error('Failed to delete project');
      throw error;
    }
  },
}));
