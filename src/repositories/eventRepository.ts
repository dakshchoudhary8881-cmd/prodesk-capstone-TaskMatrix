import { BaseRepository } from './baseRepository';
import type { CalendarEvent } from '@/store/useEventStore';
import db from '@/mock/db.json';

class EventRepository extends BaseRepository<CalendarEvent> {
  constructor() {
    super('events', db.calendarEvents as CalendarEvent[]);
  }
}

export const eventRepository = new EventRepository();
