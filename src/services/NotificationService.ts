import { apiClient } from '@/api/client';
import type { Notification } from '@/types';

export class NotificationService {
  static async getNotifications(): Promise<Notification[]> {
    return await apiClient.get<Notification[]>('/notifications');
  }

  static async markAsRead(id: string): Promise<Notification> {
    return await apiClient.patch<Notification>(`/notifications/${id}/read`, {});
  }

  static async markAllAsRead(_notifications?: Notification[]): Promise<void> {
    await apiClient.patch('/notifications/read-all', {});
  }

  static async deleteNotification(id: string): Promise<boolean> {
    return await apiClient.delete(`/notifications/${id}`);
  }
}
