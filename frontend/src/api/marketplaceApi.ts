import { apiClient } from './apiClient';

export interface ServiceOffering {
  id: string;
  providerId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  serviceOfferingId: string;
  clientId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
  bookingDate: string;
  notes: string;
}

export const marketplaceApi = {
  getServicesByCategory: async (category: string): Promise<ServiceOffering[]> => {
    const response = await apiClient.get(`/marketplace/services?category=${category}`);
    return response.data;
  },
  publishService: async (serviceData: {
    providerId: string;
    title: string;
    description: string;
    category: string;
    price: number;
    currency: string;
  }): Promise<ServiceOffering> => {
    const response = await apiClient.post('/marketplace/services', serviceData);
    return response.data;
  },
  requestBooking: async (
    serviceId: string,
    bookingData: { clientId: string; bookingDate: string; notes: string }
  ): Promise<Booking> => {
    const response = await apiClient.post(`/marketplace/services/${serviceId}/bookings`, bookingData);
    return response.data;
  },
};
