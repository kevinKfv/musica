import React, { useEffect, useState } from 'react';
import { useLibraryStore } from '../../store/libraryStore';
import { Song } from '../../api/libraryApi';
import SongDetailView from './components/SongDetailView';
import { Library, Music, FileText, Plus, Disc, X } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui';

const LibraryPage: React.FC = () => {
  const { songs, fetchSongs, addSong, isLoading, error } = useLibraryStore();
  const userId = '00000000-0000-0000-0000-000000000001';

  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isCreatingSong, setIsCreatingSong] = useState(false);
  const [newSongData, setNewSongData] = useState({ title: '', artist: '', genre: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchSongs(userId);
  }, [fetchSongs, userId]);

  const handleCreateSong = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const created = await addSong({
        ...newSongData,
        createdBy: userId,
      });
      setIsCreatingSong(false);
      setNewSongData({ title: '', artist: '', genre: '' });
      setSelectedSong(created);
    } catch (err) {
      console.error('Error creating song', err);
    } finally {
      setCreating(false);
    }
  };

  if (selectedSong) {
    const updatedSong = songs.find((s) => s.id === selectedSong.id) || selectedSong;
    return (
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <SongDetailView
          song={updatedSong}
          userId={userId}
          onBack={() => setSelectedSong(null)}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(124, 58, 237, 0.15)',
                color: '#a78bfa',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Library size={18} />
            </span>
            <h1
              style={{
                fontFamily: 'var(--bh-font-display, "Syne", sans-serif)',
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#ffffff',
                margin: 0,
              }}
            >
              Biblioteca Musical
            </h1>
          </div>
          <p style={{ margin: 0, color: 'var(--bh-text-secondary, #a1a1aa)', fontSize: '0.875rem' }}>
            Partituras, pistas de audio, maquetas y versiones organizadas en la nube.
          </p>
        </div>

        <Button
          onClick={() => setIsCreatingSong(true)}
          icon={<Plus size={16} />}
        >
          Nueva Canción
        </Button>
      </div>

      {error && (
        <div
          style={{
            padding: '1rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            color: '#f87171',
            fontSize: '0.875rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Formulario Nueva Canción */}
      {isCreatingSong && (
        <Card style={{ padding: '1.5rem', animation: 'fadeInUp 0.2s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: '#f4f4f5' }}>
              Registrar Nueva Canción
            </h3>
            <button
              onClick={() => setIsCreatingSong(false)}
              style={{ background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleCreateSong} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'end' }}>
            <div className="form-group">
              <label className="form-label">Título *</label>
              <input
                type="text"
                required
                placeholder="Nombre del tema"
                value={newSongData.title}
                onChange={(e) => setNewSongData({ ...newSongData, title: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Artista / Autor</label>
              <input
                type="text"
                placeholder="Ej. Banda o solista"
                value={newSongData.artist}
                onChange={(e) => setNewSongData({ ...newSongData, artist: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Género musical</label>
              <input
                type="text"
                placeholder="Ej. Rock, Jazz, Funk..."
                value={newSongData.genre}
                onChange={(e) => setNewSongData({ ...newSongData, genre: e.target.value })}
                className="form-input"
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', paddingBottom: '2px' }}>
              <Button variant="ghost" type="button" onClick={() => setIsCreatingSong(false)}>
                Cancelar
              </Button>
              <Button type="submit" loading={creating}>
                Crear y Abrir
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Grid de Canciones */}
      {isLoading && songs.length === 0 ? (
        <Card style={{ padding: '3rem', textAlign: 'center', color: '#a1a1aa' }}>
          <div className="spinner" style={{ margin: '0 auto 12px' }} />
          Cargando biblioteca...
        </Card>
      ) : songs.length === 0 ? (
        <Card
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'rgba(124, 58, 237, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#a78bfa',
            }}
          >
            <Disc size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f4f4f5', margin: '0 0 6px' }}>
              Tu biblioteca está vacía
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#a1a1aa', margin: 0, maxWidth: '380px' }}>
              Creá tu primera canción para empezar a organizar partituras en PDF, stems de audio y notas técnicas.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsCreatingSong(true)}
            icon={<Plus size={14} />}
          >
            Añadir canción
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {songs.map((song) => (
            <Card
              key={song.id}
              onClick={() => setSelectedSong(song)}
              style={{
                cursor: 'pointer',
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <CardHeader style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <CardTitle style={{ fontSize: '1.125rem' }}>{song.title}</CardTitle>
                  {song.genre && (
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        background: 'rgba(124, 58, 237, 0.15)',
                        color: '#a78bfa',
                        border: '1px solid rgba(124, 58, 237, 0.3)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {song.genre}
                    </span>
                  )}
                </div>
                <CardDescription style={{ marginTop: '4px' }}>
                  {song.artist || 'Artista independiente'}
                </CardDescription>
              </CardHeader>

              <CardContent style={{ padding: '0 1.25rem 1.25rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    fontSize: '0.8125rem',
                    color: 'var(--bh-text-secondary, #a1a1aa)',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Music size={14} color="#7c3aed" /> {song.audioTracks?.length || 0} audios
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={14} color="#db2777" /> {song.sheetMusics?.length || 0} partituras
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
