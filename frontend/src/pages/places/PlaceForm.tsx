import React, { useState } from 'react';
import { useForm as useHookForm } from 'react-hook-form';
import { placesApi, CreatePlaceRequest } from '../../api/placesApi';
import { Button } from '../../components/ui';
import { MapPin, X } from 'lucide-react';

interface PlaceFormProps {
  initialLat: number;
  initialLng: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PlaceForm: React.FC<PlaceFormProps> = ({ initialLat, initialLng, onSuccess, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useHookForm<CreatePlaceRequest>({
    defaultValues: {
      latitude: initialLat,
      longitude: initialLng,
      placeType: 'BAR',
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: CreatePlaceRequest) => {
    setLoading(true);
    try {
      await placesApi.createPlace(data);
      onSuccess();
    } catch (error) {
      console.error('Failed to create place', error);
      alert('Error al crear el lugar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: 'var(--bh-bg-surface, #12121a)',
        border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.12))',
        borderRadius: '16px',
        padding: '1.25rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
        color: '#ffffff',
        width: '320px',
        animation: 'fadeInUp 0.2s ease-out',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3
          style={{
            margin: 0,
            fontSize: '1.125rem',
            fontWeight: 700,
            fontFamily: 'var(--bh-font-display, "Syne", sans-serif)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <MapPin size={16} color="#7c3aed" /> Agregar Lugar
        </h3>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#a1a1aa',
            cursor: 'pointer',
            padding: '2px',
          }}
        >
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        <div className="form-group">
          <label className="form-label">Nombre del lugar *</label>
          <input
            {...register('name', { required: true })}
            className="form-input"
            placeholder="Ej. Estudio Abbey Road"
          />
          {errors.name && <span style={{ color: '#f87171', fontSize: '0.75rem' }}>Este campo es requerido</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Tipo de Lugar</label>
          <select
            {...register('placeType')}
            className="form-input"
            style={{ background: 'var(--bh-bg-surface-elevated, #1a1a24)' }}
          >
            <option value="BAR">Bar / Pub Musical</option>
            <option value="RECORDING_STUDIO">Estudio de Grabación</option>
            <option value="REHEARSAL_ROOM">Sala de Ensayo</option>
            <option value="VENUE">Venue / Teatro / Auditorio</option>
            <option value="OTHER">Otro espacio</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Dirección</label>
          <input
            {...register('address')}
            className="form-input"
            placeholder="Ej. Av. Corrientes 1234"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Descripción</label>
          <textarea
            {...register('description')}
            rows={2}
            className="form-input"
            placeholder="Aforo, backline disponible, acústica..."
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.25rem' }}>
          <Button variant="ghost" size="sm" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button size="sm" type="submit" loading={loading}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};
