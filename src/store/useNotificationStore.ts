import { create } from 'zustand';
import type { Notification } from '@/types';
import { NotificationService } from '@/services/NotificationService';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  // For simulated mock incoming notifications
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  receiveNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const notifications = await NotificationService.getNotifications();
      // Normalize: backend uses isRead, frontend uses read
      const normalized = notifications.map((n: any) => ({
        ...n,
        read: n.read ?? n.isRead ?? false,
      }));
      set({
        notifications: normalized,
        unreadCount: normalized.filter((n) => !n.read).length,
        isLoading: false,
      });
    } catch (error) {
      set({ error: 'Failed to fetch notifications', isLoading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      // Optimistic update
      set((state) => {
        const updated = state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
        return {
          notifications: updated,
          unreadCount: updated.filter((n) => !n.read).length,
        };
      });
      await NotificationService.markAsRead(id);
    } catch (error) {
      console.error(error);
    }
  },

  markAllAsRead: async () => {
    try {
      const currentNotifications = get().notifications;
      set((state) => {
        const updated = state.notifications.map((n) => ({ ...n, read: true }));
        return {
          notifications: updated,
          unreadCount: 0,
        };
      });
      await NotificationService.markAllAsRead(currentNotifications);
    } catch (error) {
      console.error(error);
    }
  },

  deleteNotification: async (id) => {
    try {
      set((state) => {
        const updated = state.notifications.filter((n) => n.id !== id);
        return {
          notifications: updated,
          unreadCount: updated.filter((n) => !n.read).length,
        };
      });
      await NotificationService.deleteNotification(id);
    } catch (error) {
      console.error(error);
    }
  },

  addNotification: (notifData) => {
    // This is typically called from a websocket event in real app
    set((state) => {
      const newNotification: Notification = {
        ...notifData,
        id: `not_${Math.random().toString(36).substring(2, 9)}`,
        createdAt: new Date().toISOString(),
        read: false,
      };
      return {
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    });
  },

  receiveNotification: (notification) => {
    set((state) => {
      // Prevent duplicates
      if (state.notifications.some((n) => n.id === notification.id)) {
        return state;
      }
      return {
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + (notification.read || (notification as any).isRead ? 0 : 1),
      };
    });
  },
}));
