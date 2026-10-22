import React, { useState } from 'react';
import { eventsApi } from '../../api/eventsApi';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ticket, Calendar, Plus } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui';

export const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    eventDate: '',
  });
  const [tierData, setTierData] = useState({
    name: 'General',
    price: 0,
    currency: 'USD',
    capacity: 100,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const organizerId = '11111111-1111-1111-1111-111111111111'; // Mock user ID
      const dateIso = new Date(formData.eventDate).toISOString();

      const event = await eventsApi.createEvent({
        organizerId,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        eventDate: dateIso,
      });

      await eventsApi.addTicketTier(event.id, tierData);

      navigate('/events');
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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

      <Card>
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Ticket size={20} color="#ec4899" />
            <CardTitle>Organizar Nuevo Concierto / Evento</CardTitle>
          </div>
          <CardDescription>
            Configurá la fecha, venue y localidades con control de acceso por QR.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Título del evento *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Ej. Noche de Rock Alternativo - Presentación de Disco"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Ubicación / Sala *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Ej. Club V, Niceto Club..."
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Fecha y Hora *</label>
                  <input
                    type="datetime-local"
                    required
                    className="form-input"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Descripción del evento</label>
                <textarea
                  rows={3}
                  className="form-input"
                  placeholder="Lineup de bandas, horarios de puertas, restricciones de edad..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            {/* Ticket Tier Section */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem' }}>
              <h4 style={{ margin: '0 0 1rem', fontSize: '0.9375rem', fontWeight: 700, color: '#f4f4f5' }}>
                Entradas & Localidades
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Nombre del pase</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={tierData.name}
                    onChange={(e) => setTierData({ ...tierData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Precio (USD) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="form-input"
                    value={tierData.price}
                    onChange={(e) => setTierData({ ...tierData, price: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Aforo máximo *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="form-input"
                    value={tierData.capacity}
                    onChange={(e) => setTierData({ ...tierData, capacity: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button
                variant="ghost"
                type="button"
                onClick={() => navigate('/events')}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={loading} icon={<Plus size={16} />}>
                Publicar Evento
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
