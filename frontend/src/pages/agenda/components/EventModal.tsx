import React, { useState } from 'react';
import { useAgendaStore } from '../../../store/agendaStore';
import { CreateEventRequest } from '../../../api/agendaApi';
import { X, Calendar, Clock, AlignLeft, Tag } from 'lucide-react';
import { Button } from '../../../components/ui';

interface EventModalProps {
  onClose: () => void;
  userId: string;
}

const EventModal: React.FC<EventModalProps> = ({ onClose, userId }) => {
  const { addEvent } = useAgendaStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    eventType: 'REHEARSAL',
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (!formData.title || !formData.start || !formData.end) {
        throw new Error('Por favor completa los campos obligatorios.');
      }

      const request: CreateEventRequest = {
        userId,
        title: formData.title,
        description: formData.description,
        start: new Date(formData.start).toISOString(),
        end: new Date(formData.end).toISOString(),
        eventType: formData.eventType,
      };

      await addEvent(request);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al crear el evento');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        padding: '1rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'var(--bh-bg-surface, #12121a)',
          border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.1))',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
          animation: 'fadeInUp 0.2s ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--bh-font-display, "Syne", sans-serif)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#ffffff',
              margin: 0,
            }}
          >
            Nuevo Evento Musical
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#a1a1aa',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div
            style={{
              margin: '1rem 1.5rem 0',
              padding: '0.75rem',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#f87171',
              fontSize: '0.8125rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Título del evento *</label>
            <input
              type="text"
              name="title"
              placeholder="Ej. Ensayo general - Sala A"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tipo de Evento</label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              className="form-input"
              style={{ background: 'var(--bh-bg-surface-elevated, #1a1a24)' }}
            >
              <option value="REHEARSAL">Ensayo de banda</option>
              <option value="GIG">Presentación / Show en vivo</option>
              <option value="CLASS">Clase de música</option>
              <option value="MEETING">Reunión de producción</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Inicio *</label>
              <input
                type="datetime-local"
                name="start"
                value={formData.start}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Fin *</label>
              <input
                type="datetime-local"
                name="end"
                value={formData.end}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notas o descripción</label>
            <textarea
              rows={3}
              name="description"
              placeholder="Setlist a repasar, equipamiento necesario, etc..."
              value={formData.description}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '0.5rem',
            }}
          >
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={submitting}>
              Guardar Evento
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
