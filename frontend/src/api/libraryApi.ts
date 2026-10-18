import { apiClient } from './apiClient';

export interface SheetMusic {
    id: string;
    instrument: string;
    formatType: string;
    fileUrl: string;
    versionNumber: number;
}

export interface AudioTrack {
    id: string;
    trackType: string;
    fileUrl: string;
    durationSeconds?: number;
    versionNumber: number;
}

export interface Song {
    id: string;
    title: string;
    artist?: string;
    genre?: string;
    createdBy: string;
    bandId?: string;
    sheetMusics: SheetMusic[];
    audioTracks: AudioTrack[];
}

export interface CreateSongRequest {
    title: string;
    artist?: string;
    genre?: string;
    createdBy: string;
    bandId?: string;
}

export const getSongs = async (userId: string): Promise<Song[]> => {
    const response = await apiClient.get('/library/songs', { params: { userId } });
    return response.data;
};

export const createSong = async (request: CreateSongRequest): Promise<Song> => {
    const response = await apiClient.post('/library/songs', request);
    return response.data;
};

export const uploadSheetMusic = async (songId: string, formData: FormData): Promise<SheetMusic> => {
    const response = await apiClient.post(`/library/songs/${songId}/sheets`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const uploadAudioTrack = async (songId: string, formData: FormData): Promise<AudioTrack> => {
    const response = await apiClient.post(`/library/songs/${songId}/audio`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};
