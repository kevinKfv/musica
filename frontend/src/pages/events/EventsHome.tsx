import React, { useState, useEffect } from 'react';
import { eventsApi, Event } from '../../api/eventsApi';
import { useNavigate } from 'react-router-dom';
import { Ticket, Calendar as CalendarIcon, MapPin, Plus, QrCode } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui';

export const EventsHome = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsApi.getAllEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
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
                background: 'rgba(236, 72, 153, 0.15)',
                color: '#ec4899',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ticket size={18} />
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
              Eventos & Conciertos
            </h1>
          </div>
          <p style={{ margin: 0, color: 'var(--bh-text-secondary, #a1a1aa)', fontSize: '0.875rem' }}>
            Descubrí fechas en vivo, festivales y gestioná entradas con tickets QR.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button
            variant="secondary"
            onClick={() => navigate('/events/checkin')}
            icon={<QrCode size={16} />}
          >
            Validar Tickets
          </Button>
          <Button
            onClick={() => navigate('/events/create')}
            icon={<Plus size={16} />}
          >
            Publicar Fecha
          </Button>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <Card style={{ padding: '3rem', textAlign: 'center', color: '#a1a1aa' }}>
          <div className="spinner" style={{ margin: '0 auto 12px' }} />
          Cargando cartelera de eventos...
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
              background: 'rgba(236, 72, 153, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ec4899',
            }}
          >
            <Ticket size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f4f4f5', margin: '0 0 6px' }}>
              No hay eventos publicados por ahora
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#a1a1aa', margin: 0, maxWidth: '380px' }}>
              Publicá el próximo show de tu banda o concierto para habilitar venta de entradas anticipadas.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/events/create')}
            icon={<Plus size={14} />}
          >
            Publicar mi primer show
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {events.map((event) => (
            <Card
              key={event.id}
              onClick={() => navigate(`/events/${event.id}`)}
              style={{
                cursor: 'pointer',
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '140px',
                  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(124, 58, 237, 0.3) 100%), url("https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <CardHeader style={{ padding: '1.25rem' }}>
                <CardTitle style={{ fontSize: '1.125rem' }}>{event.title}</CardTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: '#f472b6' }}>
                    <CalendarIcon size={14} />
                    <span>{new Date(event.eventDate).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {event.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: '#a1a1aa' }}>
                      <MapPin size={14} color="#71717a" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
                {event.description && (
                  <CardDescription style={{ marginTop: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {event.description}
                  </CardDescription>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
