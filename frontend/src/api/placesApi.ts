import { apiClient } from './apiClient';

export interface PlaceDTO {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  placeType: 'BAR' | 'RECORDING_STUDIO' | 'REHEARSAL_ROOM' | 'VENUE' | 'OTHER';
  address?: string;
  createdAt: string;
  createdByEmail: string;
}

export interface CreatePlaceRequest {
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  placeType: 'BAR' | 'RECORDING_STUDIO' | 'REHEARSAL_ROOM' | 'VENUE' | 'OTHER';
  address?: string;
}

export const placesApi = {
  getAllPlaces: async (): Promise<PlaceDTO[]> => {
    const response = await apiClient.get<PlaceDTO[]>('/places');
    return response.data;
  },

  createPlace: async (data: CreatePlaceRequest): Promise<PlaceDTO> => {
    const response = await apiClient.post<PlaceDTO>('/places', data);
    return response.data;
  }
};
