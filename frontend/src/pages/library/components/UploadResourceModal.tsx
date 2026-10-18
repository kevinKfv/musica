import React, { useState } from 'react';
import { useLibraryStore } from '../../../store/libraryStore';

interface UploadResourceModalProps {
  songId: string;
  userId: string;
  onClose: () => void;
}

const UploadResourceModal: React.FC<UploadResourceModalProps> = ({ songId, userId, onClose }) => {
  const { addSheetMusic, addAudioTrack } = useLibraryStore();
  
  const [resourceType, setResourceType] = useState<'SHEET' | 'AUDIO'>('SHEET');
  const [file, setFile] = useState<File | null>(null);
  
  // Specific fields
  const [instrument, setInstrument] = useState('');
  const [formatType, setFormatType] = useState('PDF');
  const [trackType, setTrackType] = useState('BACKING_TRACK');
  
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Por favor selecciona un archivo.");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadedBy', userId);

    try {
      if (resourceType === 'SHEET') {
        if (!instrument) throw new Error("Instrumento es requerido");
        formData.append('instrument', instrument);
        formData.append('formatType', formatType);
        await addSheetMusic(songId, formData);
      } else {
        formData.append('trackType', trackType);
        await addAudioTrack(songId, formData);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al subir el archivo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4">Subir Recurso</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Recurso</label>
            <select 
              value={resourceType} 
              onChange={(e) => setResourceType(e.target.value as 'SHEET' | 'AUDIO')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border bg-white"
            >
              <option value="SHEET">Partitura / Cifrado</option>
              <option value="AUDIO">Pista de Audio</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Archivo</label>
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="mt-1 block w-full p-2 border rounded"
              required
            />
          </div>

          {resourceType === 'SHEET' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Instrumento</label>
                <input 
                  type="text" 
                  value={instrument} 
                  onChange={(e) => setInstrument(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border"
                  placeholder="Ej. Guitarra, Piano, Batería"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Formato</label>
                <select 
                  value={formatType} 
                  onChange={(e) => setFormatType(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border bg-white"
                >
                  <option value="PDF">PDF</option>
                  <option value="MUSICXML">MusicXML</option>
                  <option value="CHORD_CHART">Cifrado</option>
                </select>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Pista</label>
              <select 
                value={trackType} 
                onChange={(e) => setTrackType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border bg-white"
              >
                <option value="BACKING_TRACK">Backing Track</option>
                <option value="ORIGINAL">Original</option>
                <option value="STEM">Stem individual</option>
                <option value="METRONOME">Metrónomo (Click)</option>
              </select>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              disabled={uploading}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={uploading}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center justify-center"
            >
              {uploading ? 'Subiendo...' : 'Subir Archivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadResourceModal;
