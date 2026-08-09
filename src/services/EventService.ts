import { eventRepository } from '@/repositories/eventRepository';
import type { CalendarEvent } from '@/store/useEventStore';

export class EventService {
  static async getEvents(): Promise<CalendarEvent[]> {
    return await eventRepository.findAll();
  }

  static async getEventById(id: string): Promise<CalendarEvent | null> {
    return await eventRepository.findById(id);
  }

  static async createEvent(data: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    return await eventRepository.create(data);
  }

  static async updateEvent(id: string, data: Partial<CalendarEvent>): Promise<CalendarEvent> {
    return await eventRepository.update(id, data);
  }

  static async deleteEvent(id: string): Promise<boolean> {
    return await eventRepository.delete(id);
  }
}
