import React, { useEffect, useState } from 'react';
import { useAgendaStore } from '../../store/agendaStore';
import { useAuthStore } from '../../store/useAuthStore';
import EventModal from './components/EventModal';
import { Calendar as CalendarIcon, Clock, Plus, MapPin, Music, Sparkles } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui';

const CalendarPage: React.FC = () => {
  const { events, fetchEvents, isLoading } = useAgendaStore();
  const user = useAuthStore((state) => state.user);
  const userId = '00000000-0000-0000-0000-000000000001';

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchEvents(userId);
    }
  }, [fetchEvents, userId]);

  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case 'GIG':
        return {
          label: 'Concierto / En vivo',
          bg: 'rgba(236, 72, 153, 0.15)',
          color: '#f472b6',
          border: '1px solid rgba(236, 72, 153, 0.3)',
        };
      case 'REHEARSAL':
        return {
          label: 'Ensayo',
          bg: 'rgba(124, 58, 237, 0.15)',
          color: '#a78bfa',
          border: '1px solid rgba(124, 58, 237, 0.3)',
        };
      case 'CLASS':
        return {
          label: 'Clase',
          bg: 'rgba(6, 182, 212, 0.15)',
          color: '#22d3ee',
          border: '1px solid rgba(6, 182, 212, 0.3)',
        };
      default:
        return {
          label: 'Reunión',
          bg: 'rgba(16, 185, 129, 0.15)',
          color: '#34d399',
          border: '1px solid rgba(16, 185, 129, 0.3)',
        };
    }
  };

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
              <CalendarIcon size={18} />
            </span>
            <h1
              style={{
                fontFamily: 'var(--bh-font-display, "Syne", sans-serif)',
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--bh-text-primary, #ffffff)',
                margin: 0,
              }}
            >
              Agenda Musical
            </h1>
          </div>
          <p style={{ margin: 0, color: 'var(--bh-text-secondary, #a1a1aa)', fontSize: '0.875rem' }}>
            Gestioná ensayos, fechas de conciertos, clases y reuniones de banda.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          icon={<Plus size={16} />}
        >
          Nuevo Evento
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <Card style={{ padding: '3rem', textAlign: 'center', color: '#a1a1aa' }}>
          <div className="spinner" style={{ margin: '0 auto 12px' }} />
          Cargando agenda...
        </Card>
      ) : events.length === 0 ? (
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
            <CalendarIcon size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f4f4f5', margin: '0 0 6px' }}>
              No tenés eventos programados
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#a1a1aa', margin: 0, maxWidth: '380px' }}>
              Agendá tu próximo ensayo de banda, show en vivo o sesión de grabación para mantener sincronizado al equipo.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            icon={<Plus size={14} />}
          >
            Crear primer evento
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {events.map((event) => {
            const badge = getEventTypeBadge(event.eventType);
            const startDate = new Date(event.startTime);
            const endDate = new Date(event.endTime);

            return (
              <Card
                key={event.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                }}
              >
                <CardHeader style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <CardTitle style={{ fontSize: '1rem' }}>{event.title}</CardTitle>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        ...badge,
                      }}
                    >
                      {badge.label}
                    </span>
                  </div>
                  {event.description && (
                    <CardDescription style={{ marginTop: '6px', fontSize: '0.8125rem' }}>
                      {event.description}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent style={{ padding: '0 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.8rem',
                      color: 'var(--bh-text-secondary, #a1a1aa)',
                    }}
                  >
                    <Clock size={14} color="#a78bfa" />
                    <span>
                      {startDate.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })} •{' '}
                      {startDate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} -{' '}
                      {endDate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <EventModal
          onClose={() => setIsModalOpen(false)}
          userId={userId}
        />
      )}
    </div>
  );
};

export default CalendarPage;
