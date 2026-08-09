import { create } from 'zustand';
import type { User } from '@/types';
import { UserService } from '@/services/UserService';
import toast from 'react-hot-toast';

interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  addUser: (user: Omit<User, 'id' | 'avatar'>) => Promise<void>;
  removeUser: (id: string) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await UserService.getUsers();
      set({ users, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch users', isLoading: false });
    }
  },

  addUser: async (userData) => {
    try {
      const newUser = await UserService.inviteUser(userData);
      set((state) => ({
        users: [...state.users, newUser],
      }));
      toast.success('User invited successfully');
    } catch (error) {
      toast.error('Failed to invite user');
      throw error;
    }
  },

  removeUser: async (id) => {
    try {
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
      }));
      await UserService.removeUser(id);
      toast.success('User removed');
    } catch (error) {
      toast.error('Failed to remove user');
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? { ...u, ...userData } : u)),
      }));
      await UserService.updateUser(id, userData);
    } catch (error) {
      toast.error('Failed to update user');
      throw error;
    }
  },
}));
