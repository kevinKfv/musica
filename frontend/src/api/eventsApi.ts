import { apiClient } from './apiClient';

export interface Event {
  id: string;
  organizerId: string;
  title: string;
  description: string;
  location: string;
  eventDate: string;
  createdAt: string;
}

export interface TicketTier {
  id: string;
  eventId: string;
  name: string;
  price: number;
  currency: string;
  capacity: number;
  availableQuantity: number;
}

export interface Ticket {
  id: string;
  eventId: string;
  ticketTierId: string;
  buyerId: string;
  qrToken: string;
  status: 'VALID' | 'USED' | 'CANCELLED';
  purchasedAt: string;
}

export const eventsApi = {
  getAllEvents: async (): Promise<Event[]> => {
    const response = await apiClient.get('/events');
    return response.data;
  },
  
  createEvent: async (eventData: {
    organizerId: string;
    title: string;
    description: string;
    location: string;
    eventDate: string;
  }): Promise<Event> => {
    const response = await apiClient.post('/events', eventData);
    return response.data;
  },

  addTicketTier: async (eventId: string, tierData: {
    name: string;
    price: number;
    currency: string;
    capacity: number;
  }): Promise<TicketTier> => {
    const response = await apiClient.post(`/events/${eventId}/tiers`, tierData);
    return response.data;
  },

  getTicketTiers: async (eventId: string): Promise<TicketTier[]> => {
    const response = await apiClient.get(`/events/${eventId}/tiers`);
    return response.data;
  },

  purchaseTicket: async (eventId: string, tierId: string, buyerId: string): Promise<Ticket> => {
    const response = await apiClient.post(`/events/${eventId}/tiers/${tierId}/purchase`, { buyerId });
    return response.data;
  },

  checkIn: async (qrToken: string): Promise<Ticket> => {
    const response = await apiClient.post('/events/checkin', { qrToken });
    return response.data;
  }
};
