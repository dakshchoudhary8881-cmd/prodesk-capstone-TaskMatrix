import { BaseRepository } from './baseRepository';
import type { Notification } from '@/types';
import db from '@/mock/db.json';

class NotificationRepository extends BaseRepository<Notification> {
  constructor() {
    super('notifications', db.notifications as Notification[]);
  }
}

export const notificationRepository = new NotificationRepository();
