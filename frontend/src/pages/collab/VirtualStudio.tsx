import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collabApi } from '../../api/collabApi';
import type { CollabProject } from '../../api/collabApi';
import { ArrowLeft, Play, MessageCircle, UploadCloud, Sliders } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui';

export const VirtualStudio = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<CollabProject | null>(null);

  useEffect(() => {
    if (id) {
      collabApi.getProjectDetails(id).then(setProject);
    }
  }, [id]);

  if (!project) {
    return (
      <Card style={{ padding: '3rem', textAlign: 'center', color: '#a1a1aa' }}>
        <div className="spinner" style={{ margin: '0 auto 12px' }} />
        Cargando consola del estudio...
      </Card>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
          <Link to="/collab" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={16} />}>
              Volver
            </Button>
          </Link>
          <div>
            <h1
              style={{
                fontFamily: 'var(--bh-font-display, "Syne", sans-serif)',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#ffffff',
                margin: '0 0 2px',
              }}
            >
              {project.title}
            </h1>
            <p style={{ margin: 0, color: 'var(--bh-text-secondary, #a1a1aa)', fontSize: '0.8125rem' }}>
              Mesa de mezcla virtual • Stems y pistas aisladas
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" size="sm" icon={<UploadCloud size={16} />}>
            Subir Stem
          </Button>
          <Button size="sm" icon={<Play size={16} />}>
            Reproducir Todo
          </Button>
        </div>
      </div>

      {/* Tracks Area */}
      <Card>
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="#06b6d4" />
            <CardTitle>Canales de Audio ({project.stems.length})</CardTitle>
          </div>
          <CardDescription>
            Pistas individuales en formato WAV / FLAC sincronizadas con el proyecto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {project.stems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#71717a' }}>
              No hay pistas de audio (stems) cargadas en este proyecto todavía.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {project.stems.map((stem) => (
                <div
                  key={stem.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <button
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'rgba(6, 182, 212, 0.15)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      color: '#22d3ee',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <Play size={16} />
                  </button>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#f4f4f5' }}>
                        {stem.name}
                      </span>
                      <button
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#a1a1aa',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <MessageCircle size={14} /> {stem.comments.length} notas
                      </button>
                    </div>

                    <div
                      style={{
                        height: '36px',
                        borderRadius: '8px',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 12px',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          left: 0,
                          width: '35%',
                          background: 'rgba(6, 182, 212, 0.15)',
                          borderRight: '2px solid #06b6d4',
                        }}
                      />
                      <span style={{ position: 'relative', zIndex: 1, fontSize: '0.75rem', fontFamily: 'monospace', color: '#71717a' }}>
                        00:00 / 03:45 • WAV 24-bit 48kHz
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
