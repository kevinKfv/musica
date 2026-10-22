import React, { useState } from 'react';
import { useLibraryStore } from '../../../store/libraryStore';
import { X, Upload, FileText, Music } from 'lucide-react';
import { Button } from '../../../components/ui';

interface UploadResourceModalProps {
  songId: string;
  userId: string;
  onClose: () => void;
}

const UploadResourceModal: React.FC<UploadResourceModalProps> = ({ songId, userId, onClose }) => {
  const { addSheetMusic, addAudioTrack } = useLibraryStore();

  const [resourceType, setResourceType] = useState<'SHEET' | 'AUDIO'>('SHEET');
  const [file, setFile] = useState<File | null>(null);

  const [instrument, setInstrument] = useState('');
  const [formatType, setFormatType] = useState('PDF');
  const [trackType, setTrackType] = useState('BACKING_TRACK');

  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor selecciona un archivo.');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadedBy', userId);

    try {
      if (resourceType === 'SHEET') {
        if (!instrument) throw new Error('El instrumento es requerido');
        formData.append('instrument', instrument);
        formData.append('formatType', formatType);
        await addSheetMusic(songId, formData);
      } else {
        formData.append('trackType', trackType);
        await addAudioTrack(songId, formData);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al subir el archivo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        padding: '1rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'var(--bh-bg-surface, #12121a)',
          border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.1))',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
          animation: 'fadeInUp 0.2s ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--bh-font-display, "Syne", sans-serif)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#ffffff',
              margin: 0,
            }}
          >
            Subir Recurso a la Canción
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#a1a1aa',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div
            style={{
              margin: '1rem 1.5rem 0',
              padding: '0.75rem',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#f87171',
              fontSize: '0.8125rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Tipo de recurso</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setResourceType('SHEET')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: resourceType === 'SHEET' ? '1px solid #7c3aed' : '1px solid rgba(255,255,255,0.1)',
                  background: resourceType === 'SHEET' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255,255,255,0.03)',
                  color: resourceType === 'SHEET' ? '#a78bfa' : '#a1a1aa',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <FileText size={16} /> Partitura
              </button>
              <button
                type="button"
                onClick={() => setResourceType('AUDIO')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: resourceType === 'AUDIO' ? '1px solid #7c3aed' : '1px solid rgba(255,255,255,0.1)',
                  background: resourceType === 'AUDIO' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255,255,255,0.03)',
                  color: resourceType === 'AUDIO' ? '#a78bfa' : '#a1a1aa',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <Music size={16} /> Pista de Audio
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Seleccionar archivo *</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="form-input"
              required
              style={{ padding: '6px' }}
            />
          </div>

          {resourceType === 'SHEET' ? (
            <>
              <div className="form-group">
                <label className="form-label">Instrumento asignado *</label>
                <input
                  type="text"
                  value={instrument}
                  onChange={(e) => setInstrument(e.target.value)}
                  placeholder="Ej. Guitarra Líder, Bajo, Voz..."
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Formato</label>
                <select
                  value={formatType}
                  onChange={(e) => setFormatType(e.target.value)}
                  className="form-input"
                  style={{ background: 'var(--bh-bg-surface-elevated, #1a1a24)' }}
                >
                  <option value="PDF">PDF (Documento)</option>
                  <option value="MUSICXML">MusicXML (Notación interactiva)</option>
                  <option value="CHORD_CHART">Cifrado de Acordes</option>
                </select>
              </div>
            </>
          ) : (
            <div className="form-group">
              <label className="form-label">Tipo de pista</label>
              <select
                value={trackType}
                onChange={(e) => setTrackType(e.target.value)}
                className="form-input"
                style={{ background: 'var(--bh-bg-surface-elevated, #1a1a24)' }}
              >
                <option value="BACKING_TRACK">Backing Track (Base rítmica)</option>
                <option value="ORIGINAL">Grabación original / Demo</option>
                <option value="STEM">Stem individual (Pista aislada)</option>
                <option value="METRONOME">Metrónomo / Click track</option>
              </select>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '0.5rem',
            }}
          >
            <Button variant="ghost" type="button" onClick={onClose} disabled={uploading}>
              Cancelar
            </Button>
            <Button type="submit" loading={uploading} icon={<Upload size={14} />}>
              Subir a la Nube
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadResourceModal;
