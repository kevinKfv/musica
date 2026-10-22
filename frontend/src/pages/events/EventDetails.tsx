import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsApi, Event, TicketTier, Ticket } from '../../api/eventsApi';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar as CalendarIcon, MapPin, Ticket as TicketIcon, ArrowLeft } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui';

export const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [tiers, setTiers] = useState<TicketTier[]>([]);
  const [purchasedTicket, setPurchasedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const events = await eventsApi.getAllEvents();
      const currentEvent = events.find((e) => e.id === id);
      if (currentEvent) setEvent(currentEvent);

      const eventTiers = await eventsApi.getTicketTiers(id!);
      setTiers(eventTiers);
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  const handlePurchase = async (tierId: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const buyerId = '22222222-2222-2222-2222-222222222222'; // Mock user ID
      const ticket = await eventsApi.purchaseTicket(id, tierId, buyerId);
      setPurchasedTicket(ticket);
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      alert('Error al comprar la entrada. Quizás el aforo está lleno.');
    } finally {
      setLoading(false);
    }
  };

  if (purchasedTicket) {
    return (
      <div style={{ maxWidth: '420px', margin: '2rem auto' }}>
        <Card style={{ padding: '2rem', textAlign: 'center' }}>
          <h2
            style={{
              fontFamily: 'var(--bh-font-display, "Syne", sans-serif)',
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#f472b6',
              margin: '0 0 8px',
            }}
          >
            ¡Entrada Confirmada!
          </h2>
          <p style={{ margin: '0 0 1.5rem', color: '#a1a1aa', fontSize: '0.875rem' }}>
            Presentá este código QR en la puerta de acceso al evento.
          </p>

          <div
            style={{
              background: '#ffffff',
              padding: '1rem',
              borderRadius: '16px',
              display: 'inline-block',
              marginBottom: '1.5rem',
            }}
          >
            <QRCodeSVG value={purchasedTicket.qrToken} size={180} />
          </div>

          <p style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#71717a', margin: '0 0 1.5rem', wordBreak: 'break-all' }}>
            ID: {purchasedTicket.qrToken}
          </p>

          <Button style={{ width: '100%' }} onClick={() => navigate('/events')}>
            Volver a la Cartelera
          </Button>
        </Card>
      </div>
    );
  }

  if (!event) {
    return (
      <Card style={{ padding: '3rem', textAlign: 'center', color: '#a1a1aa' }}>
        <div className="spinner" style={{ margin: '0 auto 12px' }} />
        Cargando detalles del evento...
      </Card>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/events')}
          icon={<ArrowLeft size={16} />}
        >
          Volver a Eventos
        </Button>
      </div>

      <Card style={{ overflow: 'hidden' }}>
        <div
          style={{
            height: '200px',
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(124, 58, 237, 0.3) 100%), url("https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1500&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div style={{ padding: '2rem' }}>
          <h1
            style={{
              fontFamily: 'var(--bh-font-display, "Syne", sans-serif)',
              fontSize: '2rem',
              fontWeight: 800,
              color: '#ffffff',
              margin: '0 0 1rem',
            }}
          >
            {event.title}
          </h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem', color: '#a1a1aa', fontSize: '0.9375rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f472b6' }}>
              <CalendarIcon size={16} />
              <span>{new Date(event.eventDate).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            {event.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="#ec4899" />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {event.description && (
            <p style={{ fontSize: '0.9375rem', color: '#d4d4d8', lineHeight: 1.6, marginBottom: '2rem' }}>
              {event.description}
            </p>
          )}

          {/* Localidades */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.5rem' }}>
            <h3
              style={{
                fontFamily: 'var(--bh-font-display, "Syne", sans-serif)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <TicketIcon size={18} color="#ec4899" /> Entradas & Localidades
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 700, color: '#f4f4f5' }}>
                      {tier.name}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#a1a1aa' }}>
                      Disponibles: {tier.availableQuantity} de {tier.capacity}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--bh-font-display, "Syne", sans-serif)', fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                      ${tier.price} <span style={{ fontSize: '0.75rem', color: '#71717a' }}>{tier.currency}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handlePurchase(tier.id)}
                      disabled={loading || tier.availableQuantity <= 0}
                    >
                      {loading ? 'Procesando...' : tier.availableQuantity > 0 ? 'Comprar Ticket' : 'Agotado'}
                    </Button>
                  </div>
                </div>
              ))}
              {tiers.length === 0 && (
                <div style={{ color: '#71717a', fontSize: '0.875rem' }}>
                  No hay entradas configuradas para este evento.
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
