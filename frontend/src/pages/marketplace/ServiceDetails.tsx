import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { marketplaceApi } from '../../api/marketplaceApi';
import { ArrowLeft, CheckCircle, Calendar, FileText } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const ServiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bookingDate, setBookingDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setLoading(true);
    try {
      const clientId = '22222222-2222-2222-2222-222222222222'; // Mock client ID
      const dateIso = new Date(bookingDate).toISOString();
      await marketplaceApi.requestBooking(id, {
        clientId,
        bookingDate: dateIso,
        notes
      });
      setSuccess(true);
      setTimeout(() => navigate('/marketplace'), 2500);
    } catch (error) {
      console.error('Error requesting booking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ maxWidth: '560px', margin: '2rem auto', width: '100%' }}>
        <Card style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '1.25rem',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
        }}>
          <CheckCircle style={{ width: '48px', height: '48px', color: '#10b981', margin: '0 auto 1rem' }} />
          <h2 style={{ fontFamily: 'var(--bh-font-display, Syne)', fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
            ¡Solicitud Enviada!
          </h2>
          <p style={{ color: 'var(--bh-text-secondary, #a1a1aa)', fontSize: '1rem', lineHeight: 1.6 }}>
            El profesional ha recibido tu propuesta de reserva. Redirigiendo al Marketplace...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Button 
        variant="ghost"
        onClick={() => navigate('/marketplace')}
        style={{ alignSelf: 'flex-start', color: 'var(--bh-text-secondary, #a1a1aa)', paddingLeft: 0 }}
      >
        <ArrowLeft style={{ width: '16px', height: '16px', marginRight: '6px' }} />
        Volver al Marketplace
      </Button>

      <Card style={{
        background: 'var(--bh-bg-surface, #12121a)',
        border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.08))',
        borderRadius: '1.25rem',
        padding: '2rem',
        boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
      }}>
        <h2 style={{
          fontFamily: 'var(--bh-font-display, Syne)',
          fontSize: '1.75rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #c084fc, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem',
        }}>
          Solicitar Reserva
        </h2>
        <p style={{ color: 'var(--bh-text-secondary, #a1a1aa)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
          Indica la fecha y hora propuesta junto con las especificaciones de tu requerimiento.
        </p>

        <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              <Calendar style={{ width: '16px', height: '16px', color: '#c084fc' }} />
              Fecha y Hora Propuesta
            </label>
            <input 
              type="datetime-local"
              required
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.1))',
                borderRadius: '0.75rem',
                padding: '0.875rem 1rem',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              <FileText style={{ width: '16px', height: '16px', color: '#c084fc' }} />
              Notas y Requisitos (Opcional)
            </label>
            <textarea 
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe detalles de la sesión, backline necesario o requerimientos técnicos..."
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.1))',
                borderRadius: '0.75rem',
                padding: '0.875rem 1rem',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ paddingTop: '0.75rem' }}>
            <Button 
              type="submit"
              variant="primary"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.875rem',
                fontSize: '1rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #9333ea, #ec4899)',
              }}
            >
              {loading ? 'Enviando solicitud...' : 'Confirmar Reserva'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
