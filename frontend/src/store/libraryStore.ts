import { create } from 'zustand';
import { Song, getSongs, createSong, CreateSongRequest, uploadSheetMusic, uploadAudioTrack } from '../api/libraryApi';

interface LibraryState {
    songs: Song[];
    isLoading: boolean;
    error: string | null;
    fetchSongs: (userId: string) => Promise<void>;
    addSong: (request: CreateSongRequest) => Promise<Song>;
    addSheetMusic: (songId: string, formData: FormData) => Promise<void>;
    addAudioTrack: (songId: string, formData: FormData) => Promise<void>;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
    songs: [],
    isLoading: false,
    error: null,

    fetchSongs: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
            const data = await getSongs(userId);
            set({ songs: data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch songs', isLoading: false });
        }
    },

    addSong: async (request: CreateSongRequest) => {
        set({ isLoading: true, error: null });
        try {
            const newSong = await createSong(request);
            set((state) => ({
                songs: [...state.songs, newSong],
                isLoading: false
            }));
            return newSong;
        } catch (error: any) {
            set({ error: error.message || 'Failed to create song', isLoading: false });
            throw error;
        }
    },

    addSheetMusic: async (songId: string, formData: FormData) => {
        set({ isLoading: true, error: null });
        try {
            const newSheet = await uploadSheetMusic(songId, formData);
            set((state) => ({
                songs: state.songs.map(song => 
                    song.id === songId 
                        ? { ...song, sheetMusics: [...song.sheetMusics, newSheet] } 
                        : song
                ),
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to upload sheet music', isLoading: false });
            throw error;
        }
    },

    addAudioTrack: async (songId: string, formData: FormData) => {
        set({ isLoading: true, error: null });
        try {
            const newTrack = await uploadAudioTrack(songId, formData);
            set((state) => ({
                songs: state.songs.map(song => 
                    song.id === songId 
                        ? { ...song, audioTracks: [...song.audioTracks, newTrack] } 
                        : song
                ),
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to upload audio track', isLoading: false });
            throw error;
        }
    }
}));
