import { apiClient } from './apiClient';

export interface CalendarEntry {
    id: string;
    userId: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    eventType: string;
    referenceId?: string;
}

export interface CreateEventRequest {
    userId: string;
    title: string;
    description?: string;
    start: string;
    end: string;
    eventType: string;
    referenceId?: string;
}

export const getEvents = async (userId: string): Promise<CalendarEntry[]> => {
    const response = await apiClient.get('/agenda/events', { params: { userId } });
    return response.data;
};

export const createEvent = async (request: CreateEventRequest): Promise<CalendarEntry> => {
    const response = await apiClient.post('/agenda/events', request);
    return response.data;
};

export const confirmRsvp = async (eventId: string, userId: string, status: 'CONFIRMED' | 'DECLINED' | 'MAYBE'): Promise<void> => {
    await apiClient.post(`/agenda/events/${eventId}/rsvp`, { userId, status });
};
