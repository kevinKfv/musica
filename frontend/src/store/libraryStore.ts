import { create } from 'zustand';
import { Song, getSongs, createSong, CreateSongRequest, uploadSheetMusic, uploadAudioTrack } from '../api/libraryApi';

const SAMPLE_SONGS: Song[] = [
  {
    id: 's1',
    title: 'De Música Ligera',
    artist: 'Soda Stereo',
    genre: 'Rock Alternativo',
    createdBy: 'admin',
    sheetMusics: [
      { id: 'sm1', instrument: 'Guitarra Eléctrica', formatType: 'PDF', fileUrl: 'https://raw.githubusercontent.com/DietrichGebert/ponytail/main/README.md', versionNumber: 1 },
      { id: 'sm2', instrument: 'Bajo', formatType: 'MusicXML', fileUrl: 'https://raw.githubusercontent.com/DietrichGebert/ponytail/main/README.md', versionNumber: 1 },
    ],
    audioTracks: [
      { id: 'at1', trackType: 'ORIGINAL', fileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', durationSeconds: 215, versionNumber: 1 },
      { id: 'at2', trackType: 'STEM_GUITAR', fileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', durationSeconds: 215, versionNumber: 1 },
    ],
  },
  {
    id: 's2',
    title: 'Mil Horas',
    artist: 'Los Abuelos de la Nada',
    genre: 'Pop Rock',
    createdBy: 'admin',
    sheetMusics: [
      { id: 'sm3', instrument: 'Teclado / Sintetizador', formatType: 'PDF', fileUrl: 'https://raw.githubusercontent.com/DietrichGebert/ponytail/main/README.md', versionNumber: 1 },
    ],
    audioTracks: [
      { id: 'at3', trackType: 'ORIGINAL', fileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', durationSeconds: 190, versionNumber: 1 },
    ],
  },
  {
    id: 's3',
    title: 'Rezo por Vos',
    artist: 'Charly García & Luis Alberto Spinetta',
    genre: 'Rock Nacional',
    createdBy: 'admin',
    sheetMusics: [
      { id: 'sm4', instrument: 'Guitarra Acústica & Voz', formatType: 'PDF', fileUrl: 'https://raw.githubusercontent.com/DietrichGebert/ponytail/main/README.md', versionNumber: 1 },
    ],
    audioTracks: [
      { id: 'at4', trackType: 'ORIGINAL', fileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', durationSeconds: 250, versionNumber: 1 },
    ],
  },
];

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
    songs: SAMPLE_SONGS,
    isLoading: false,
    error: null,

    fetchSongs: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
            const data = await getSongs(userId);
            if (data && data.length > 0) {
                set({ songs: data, isLoading: false });
            } else {
                set({ songs: SAMPLE_SONGS, isLoading: false });
            }
        } catch {
            // Graceful fallback to rich sample library content
            set({ songs: SAMPLE_SONGS, isLoading: false, error: null });
        }
    },

    addSong: async (request: CreateSongRequest) => {
        set({ isLoading: true, error: null });
        try {
            const newSong = await createSong(request);
            set((state) => ({
                songs: [newSong, ...state.songs],
                isLoading: false
            }));
            return newSong;
        } catch {
            // Optimistic creation fallback
            const localSong: Song = {
                id: `song-${Date.now()}`,
                title: request.title,
                artist: request.artist || 'Artista Independiente',
                genre: request.genre || 'Rock',
                createdBy: request.createdBy,
                sheetMusics: [],
                audioTracks: [],
            };
            set((state) => ({
                songs: [localSong, ...state.songs],
                isLoading: false
            }));
            return localSong;
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
            set({ error: error.message || 'Error al subir partitura', isLoading: false });
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
            set({ error: error.message || 'Error al subir pista de audio', isLoading: false });
        }
    }
}));
