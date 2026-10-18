import React, { useState } from 'react';
import { Song } from '../../../api/libraryApi';
import UploadResourceModal from './UploadResourceModal';

interface SongDetailViewProps {
  song: Song;
  userId: string;
  onBack: () => void;
}

const SongDetailView: React.FC<SongDetailViewProps> = ({ song, userId, onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
        <button 
          onClick={onBack}
          className="text-gray-500 hover:text-gray-800 bg-gray-100 px-3 py-1 rounded"
        >
          &larr; Volver
        </button>
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{song.title}</h2>
          <p className="text-gray-600">{song.artist || 'Artista desconocido'} • {song.genre || 'Sin género'}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Recursos</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded shadow text-sm"
        >
          + Subir Archivo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <h4 className="font-bold text-lg mb-4 text-purple-700 border-b pb-2">Pistas de Audio</h4>
          {(!song.audioTracks || song.audioTracks.length === 0) ? (
            <p className="text-gray-500 text-sm">No hay audios disponibles.</p>
          ) : (
            <ul className="space-y-4">
              {song.audioTracks.map(track => (
                <li key={track.id} className="bg-gray-50 p-3 rounded border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm">{track.trackType}</span>
                    <span className="text-xs text-gray-500 border border-gray-300 rounded px-2 py-0.5">v{track.versionNumber}</span>
                  </div>
                  <audio controls className="w-full h-8" src={track.fileUrl}>
                    Tu navegador no soporta el elemento de audio.
                  </audio>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <h4 className="font-bold text-lg mb-4 text-purple-700 border-b pb-2">Partituras</h4>
          {(!song.sheetMusics || song.sheetMusics.length === 0) ? (
            <p className="text-gray-500 text-sm">No hay partituras disponibles.</p>
          ) : (
            <ul className="space-y-3">
              {song.sheetMusics.map(sheet => (
                <li key={sheet.id} className="flex justify-between items-center bg-gray-50 p-3 rounded border hover:bg-gray-100 transition">
                  <div>
                    <p className="font-semibold">{sheet.instrument}</p>
                    <p className="text-xs text-gray-500">{sheet.formatType} - v{sheet.versionNumber}</p>
                  </div>
                  <a 
                    href={sheet.fileUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium bg-purple-100 px-3 py-1 rounded-full"
                  >
                    Ver / Descargar
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {isModalOpen && (
        <UploadResourceModal 
          songId={song.id} 
          userId={userId} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default SongDetailView;
