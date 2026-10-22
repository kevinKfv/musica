import React, { useState } from 'react';
import { eventsApi, Ticket } from '../../api/eventsApi';
import { useNavigate } from 'react-router-dom';
import { ScanLine, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const EventCheckIn = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; ticket?: Ticket } | null>(null);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const ticket = await eventsApi.checkIn(token);
      setResult({
        success: true,
        message: '¡Ticket validado con éxito!',
        ticket
      });
      setToken('');
    } catch (error: any) {
      console.error('Error checking in:', error);
      setResult({
        success: false,
        message: error.response?.data?.message || 'Error al validar ticket. QR inválido o ya utilizado.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Button 
        variant="ghost"
        onClick={() => navigate('/events')}
        style={{ alignSelf: 'flex-start', color: 'var(--bh-text-secondary, #a1a1aa)', paddingLeft: 0 }}
      >
        <ArrowLeft style={{ width: '16px', height: '16px', marginRight: '6px' }} />
        Volver a Eventos
      </Button>

      <Card style={{
        background: 'var(--bh-bg-surface, #12121a)',
        border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.08))',
        borderRadius: '1.25rem',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'rgba(249, 115, 22, 0.15)',
          border: '1px solid rgba(249, 115, 22, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <ScanLine style={{ width: '32px', height: '32px', color: '#f97316' }} />
        </div>

        <h2 style={{ fontFamily: 'var(--bh-font-display, Syne)', fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          Módulo de Check-in
        </h2>
        <p style={{ color: 'var(--bh-text-secondary, #a1a1aa)', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Ingresa o escanea el token QR del asistente para validar su acceso.
        </p>

        <form onSubmit={handleCheckIn} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <input 
            type="text"
            required
            placeholder="Ingresa el QR Token (UUID)"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.1))',
              borderRadius: '0.75rem',
              padding: '1rem 1.25rem',
              textAlign: 'center',
              fontSize: '1rem',
              fontFamily: 'monospace',
              color: '#fff',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--bh-primary, #6366f1)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
          />

          <Button 
            type="submit"
            variant="primary"
            disabled={loading || !token}
            style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', fontWeight: 700 }}
          >
            {loading ? 'Validando entrada...' : 'Validar Entrada'}
          </Button>
        </form>

        {result && (
          <div style={{
            padding: '1.25rem',
            borderRadius: '0.75rem',
            border: `1px solid ${result.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            background: result.success ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              {result.success ? (
                <CheckCircle style={{ width: '22px', height: '22px', color: '#10b981', flexShrink: 0 }} />
              ) : (
                <XCircle style={{ width: '22px', height: '22px', color: '#ef4444', flexShrink: 0 }} />
              )}
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: result.success ? '#10b981' : '#ef4444', margin: 0 }}>
                {result.message}
              </h3>
            </div>
            
            {result.success && result.ticket && (
              <div style={{
                marginTop: '0.75rem',
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                color: 'var(--bh-text-secondary, #a1a1aa)',
                lineHeight: 1.6
              }}>
                <div>Estado: <span style={{ color: '#10b981', fontWeight: 700 }}>{result.ticket.status}</span></div>
                <div>ID Ticket: {result.ticket.id}</div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
