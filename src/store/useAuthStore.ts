import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';
import type { User } from '@/types';
import { AuthService } from '@/services/AuthService';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  rememberMe: boolean;
  login: (email: string, password?: string, rememberMe?: boolean) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const storage: StateStorage = {
  getItem: (name) => {
    return window.localStorage.getItem(name) || window.sessionStorage.getItem(name) || null;
  },
  setItem: (name, value) => {
    try {
      const parsed = JSON.parse(value);
      if (parsed?.state?.rememberMe) {
        window.localStorage.setItem(name, value);
        window.sessionStorage.removeItem(name);
      } else {
        window.sessionStorage.setItem(name, value);
        window.localStorage.removeItem(name);
      }
    } catch (error) {
      window.sessionStorage.setItem(name, value);
    }
  },
  removeItem: (name) => {
    window.localStorage.removeItem(name);
    window.sessionStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      rememberMe: false,
      login: async (email: string, password?: string, rememberMe = false) => {
        try {
          const { user, token } = await AuthService.login(email, password);
          set({
            isAuthenticated: true,
            user,
            token,
            rememberMe,
          });
        } catch (error) {
          throw error;
        }
      },
      logout: () => {
        AuthService.logout().then(() => {
          set({ isAuthenticated: false, user: null, token: null, rememberMe: false });
        });
      },
      register: async (data: any) => {
        try {
          await AuthService.register(data);
        } catch (error) {
          throw error;
        }
      },
      checkAuth: async () => {
        try {
          const user = await AuthService.getMe();
          if (user) {
            set({ isAuthenticated: true, user });
          } else {
            set({ isAuthenticated: false, user: null, token: null });
          }
        } catch {
          set({ isAuthenticated: false, user: null, token: null });
        }
      },
    }),
    {
      name: 'taskmatrix-auth',
      storage: createJSONStorage(() => storage),
    }
  )
);
