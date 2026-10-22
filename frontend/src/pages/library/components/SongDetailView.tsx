import React, { useState } from 'react';
import { Song } from '../../../api/libraryApi';
import UploadResourceModal from './UploadResourceModal';
import { ArrowLeft, Music, FileText, Upload, Download, Disc } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui';

interface SongDetailViewProps {
  song: Song;
  userId: string;
  onBack: () => void;
}

const SongDetailView: React.FC<SongDetailViewProps> = ({ song, userId, onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            icon={<ArrowLeft size={16} />}
          >
            Volver
          </Button>
          <div>
            <h2
              style={{
                fontFamily: 'var(--bh-font-display, "Syne", sans-serif)',
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#ffffff',
                margin: '0 0 4px',
              }}
            >
              {song.title}
            </h2>
            <p style={{ margin: 0, color: 'var(--bh-text-secondary, #a1a1aa)', fontSize: '0.875rem' }}>
              {song.artist || 'Artista independiente'} • {song.genre || 'Sin género asignado'}
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          icon={<Upload size={16} />}
        >
          Subir Recurso
        </Button>
      </div>

      {/* Panels Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Pistas de Audio */}
        <Card>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Music size={18} color="#a78bfa" />
              <CardTitle>Pistas de Audio & Stems</CardTitle>
            </div>
            <CardDescription>Grabaciones, maquetas y mezclas del tema</CardDescription>
          </CardHeader>
          <CardContent>
            {!song.audioTracks || song.audioTracks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#71717a', fontSize: '0.875rem' }}>
                No hay pistas de audio subidas para esta canción.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {song.audioTracks.map((track) => (
                  <div
                    key={track.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      padding: '0.875rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#f4f4f5' }}>
                        {track.trackType}
                      </span>
                      <span
                        style={{
                          background: 'rgba(124, 58, 237, 0.15)',
                          color: '#a78bfa',
                          border: '1px solid rgba(124, 58, 237, 0.3)',
                          padding: '1px 6px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                        }}
                      >
                        v{track.versionNumber}
                      </span>
                    </div>
                    <audio controls style={{ width: '100%', height: '36px', outline: 'none' }} src={track.fileUrl}>
                      Tu navegador no soporta reproducción de audio.
                    </audio>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Partituras */}
        <Card>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="#ec4899" />
              <CardTitle>Partituras & Tabs</CardTitle>
            </div>
            <CardDescription>Archivos PDF, MusicXML o tablaturas de acordes</CardDescription>
          </CardHeader>
          <CardContent>
            {!song.sheetMusics || song.sheetMusics.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#71717a', fontSize: '0.875rem' }}>
                No hay partituras subidas para esta canción.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {song.sheetMusics.map((sheet) => (
                  <div
                    key={sheet.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      padding: '0.875rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#f4f4f5' }}>
                        {sheet.instrument}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                        {sheet.formatType} • v{sheet.versionNumber}
                      </div>
                    </div>
                    <a
                      href={sheet.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: 'rgba(236, 72, 153, 0.15)',
                        color: '#f472b6',
                        border: '1px solid rgba(236, 72, 153, 0.3)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Download size={14} /> Abrir
                    </a>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
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
