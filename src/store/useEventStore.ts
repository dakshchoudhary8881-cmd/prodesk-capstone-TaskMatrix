import { create } from 'zustand';
import { EventService } from '@/services/EventService';
import toast from 'react-hot-toast';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  type: 'meeting' | 'planning' | 'review' | 'milestone';
  attendees: string[];
}

interface EventState {
  events: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const useEventStore = create<EventState>((set) => ({
  events: [],
  isLoading: false,
  error: null,

  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const events = await EventService.getEvents();
      set({ events, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch events', isLoading: false });
    }
  },

  addEvent: async (eventData) => {
    try {
      const newEvent = await EventService.createEvent(eventData);
      set((state) => ({
        events: [...state.events, newEvent],
      }));
      toast.success('Event created successfully');
    } catch (error) {
      toast.error('Failed to create event');
      throw error;
    }
  },

  updateEvent: async (id, eventData) => {
    try {
      set((state) => ({
        events: state.events.map((e) => (e.id === id ? { ...e, ...eventData } : e)),
      }));
      await EventService.updateEvent(id, eventData);
    } catch (error) {
      toast.error('Failed to update event');
      throw error;
    }
  },

  deleteEvent: async (id) => {
    try {
      set((state) => ({
        events: state.events.filter((e) => e.id !== id),
      }));
      await EventService.deleteEvent(id);
      toast.success('Event deleted');
    } catch (error) {
      toast.error('Failed to delete event');
      throw error;
    }
  },
}));
