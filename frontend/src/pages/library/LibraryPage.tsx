import React, { useEffect, useState } from 'react';
import { useLibraryStore } from '../../store/libraryStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Song } from '../../api/libraryApi';
import SongDetailView from './components/SongDetailView';

const LibraryPage: React.FC = () => {
  const { songs, fetchSongs, addSong, isLoading, error } = useLibraryStore();
  const userId = "00000000-0000-0000-0000-000000000001"; // Mock UUID
  
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isCreatingSong, setIsCreatingSong] = useState(false);
  const [newSongData, setNewSongData] = useState({ title: '', artist: '', genre: '' });

  useEffect(() => {
    fetchSongs(userId);
  }, [fetchSongs, userId]);

  const handleCreateSong = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await addSong({
        ...newSongData,
        createdBy: userId
      });
      setIsCreatingSong(false);
      setNewSongData({ title: '', artist: '', genre: '' });
      setSelectedSong(created); // Open immediately
    } catch (err) {
      console.error("Error creating song", err);
    }
  };

  // If a song is selected, show detail view
  if (selectedSong) {
    // Find the latest version from store to ensure updates reflect
    const updatedSong = songs.find(s => s.id === selectedSong.id) || selectedSong;
    return (
      <div className="p-6 max-w-7xl mx-auto min-h-screen">
        <SongDetailView 
          song={updatedSong} 
          userId={userId} 
          onBack={() => setSelectedSong(null)} 
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Biblioteca Musical</h1>
        <button 
          onClick={() => setIsCreatingSong(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded shadow"
        >
          + Nueva Canción
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}

      {isCreatingSong && (
        <div className="bg-white p-4 rounded-lg shadow border mb-6">
          <h3 className="font-bold text-lg mb-4">Agregar nueva canción</h3>
          <form onSubmit={handleCreateSong} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700">Título *</label>
              <input type="text" required value={newSongData.title} onChange={e => setNewSongData({...newSongData, title: e.target.value})} className="mt-1 w-full border rounded p-2" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700">Artista</label>
              <input type="text" value={newSongData.artist} onChange={e => setNewSongData({...newSongData, artist: e.target.value})} className="mt-1 w-full border rounded p-2" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700">Género</label>
              <input type="text" value={newSongData.genre} onChange={e => setNewSongData({...newSongData, genre: e.target.value})} className="mt-1 w-full border rounded p-2" />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setIsCreatingSong(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Crear</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && songs.length === 0 ? (
          <p className="text-gray-500 col-span-full">Cargando biblioteca...</p>
        ) : songs.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100 text-gray-500">
            <p className="text-lg">Tu biblioteca está vacía.</p>
            <p className="text-sm mt-1">Crea una canción para empezar a subir partituras y audios.</p>
          </div>
        ) : (
          songs.map((song) => (
            <div 
              key={song.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              onClick={() => setSelectedSong(song)}
            >
              <div>
                <h3 className="font-bold text-xl text-gray-800 truncate">{song.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{song.artist || 'Artista desconocido'}</p>
                {song.genre && <span className="inline-block mt-2 text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{song.genre}</span>}
              </div>
              
              <div className="mt-6 flex gap-4 text-sm text-gray-500 border-t pt-3">
                <div className="flex items-center gap-1">
                  <span>🎵</span> {song.audioTracks?.length || 0} Audios
                </div>
                <div className="flex items-center gap-1">
                  <span>📄</span> {song.sheetMusics?.length || 0} Partituras
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
