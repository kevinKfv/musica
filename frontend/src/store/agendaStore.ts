import { create } from 'zustand';
import { CalendarEntry, getEvents, createEvent, CreateEventRequest } from '../api/agendaApi';

interface AgendaState {
    events: CalendarEntry[];
    isLoading: boolean;
    error: string | null;
    fetchEvents: (userId: string) => Promise<void>;
    addEvent: (request: CreateEventRequest) => Promise<void>;
}

export const useAgendaStore = create<AgendaState>((set) => ({
    events: [],
    isLoading: false,
    error: null,

    fetchEvents: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
            const data = await getEvents(userId);
            set({ events: data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch events', isLoading: false });
        }
    },

    addEvent: async (request: CreateEventRequest) => {
        set({ isLoading: true, error: null });
        try {
            const newEvent = await createEvent(request);
            set((state) => ({
                events: [...state.events, newEvent],
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to create event', isLoading: false });
            throw error; // Rethrow to handle in the component
        }
    }
}));
