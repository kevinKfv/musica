import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collabApi } from '../../api/collabApi';
import type { CollabProject } from '../../api/collabApi';
import { Layers, Plus, Folder, Sliders } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui';

export const CollabHome = () => {
  const [projects, setProjects] = useState<CollabProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    collabApi
      .getProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

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
                background: 'rgba(6, 182, 212, 0.15)',
                color: '#06b6d4',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Layers size={18} />
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
              Estudio Virtual & Colaboración
            </h1>
          </div>
          <p style={{ margin: 0, color: 'var(--bh-text-secondary, #a1a1aa)', fontSize: '0.875rem' }}>
            Grabación multipista colaborativa en tiempo real con stems y sincronización.
          </p>
        </div>

        <Button icon={<Plus size={16} />}>
          Nuevo Proyecto DAW
        </Button>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <Card style={{ padding: '3rem', textAlign: 'center', color: '#a1a1aa' }}>
          <div className="spinner" style={{ margin: '0 auto 12px' }} />
          Cargando sesiones de estudio...
        </Card>
      ) : projects.length === 0 ? (
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
              background: 'rgba(6, 182, 212, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#06b6d4',
            }}
          >
            <Sliders size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f4f4f5', margin: '0 0 6px' }}>
              No tenés sesiones activas
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#a1a1aa', margin: 0, maxWidth: '380px' }}>
              Iniciá un nuevo proyecto multipista para invitar a tus compañeros de banda o sesionistas remotos.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={<Plus size={14} />}
          >
            Crear primera sesión
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {projects.map((project) => (
            <Link
              to={`/collab/${project.id}`}
              key={project.id}
              style={{ textDecoration: 'none' }}
            >
              <Card
                style={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <CardHeader style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        background: 'rgba(6, 182, 212, 0.15)',
                        color: '#22d3ee',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                      }}
                    >
                      {project.status}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#71717a' }}>DAW Session</span>
                  </div>
                  <CardTitle style={{ fontSize: '1.125rem' }}>{project.title}</CardTitle>
                  {project.description && (
                    <CardDescription style={{ marginTop: '6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {project.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent style={{ padding: '0 1.25rem 1.25rem', marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#22d3ee', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Abrir mesa de mezcla &rarr;
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
