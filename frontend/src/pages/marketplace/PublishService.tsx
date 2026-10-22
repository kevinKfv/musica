import React, { useState } from 'react';
import { marketplaceApi } from '../../api/marketplaceApi';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, Plus } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui';

export const PublishService = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Music Production',
    price: 0,
    currency: 'USD',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const providerId = '11111111-1111-1111-1111-111111111111'; // Mock user ID for now
      await marketplaceApi.publishService({
        ...formData,
        providerId,
      });
      navigate('/marketplace');
    } catch (error) {
      console.error('Error publishing service:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/marketplace')}
          icon={<ArrowLeft size={16} />}
        >
          Volver al Marketplace
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Briefcase size={20} color="#10b981" />
            <CardTitle>Publicar Nuevo Servicio Musical</CardTitle>
          </div>
          <CardDescription>
            Ofrecé tus habilidades como productor, músico de sesión, arreglador o docente.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Título del servicio *</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej. Mezcla y Masterización Profesional de Stems"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Categoría de servicio</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-input"
                style={{ background: 'var(--bh-bg-surface-elevated, #1a1a24)' }}
              >
                <option value="Music Production">Producción Musical</option>
                <option value="Mixing & Mastering">Mezcla & Masterización</option>
                <option value="Session Musician">Músico de Sesión</option>
                <option value="Vocals">Voces & Coros</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Precio base *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="form-input"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Moneda</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="form-input"
                  style={{ background: 'var(--bh-bg-surface-elevated, #1a1a24)' }}
                >
                  <option value="USD">USD ($)</option>
                  <option value="ARS">ARS ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Descripción detallada del servicio *</label>
              <textarea
                required
                rows={5}
                className="form-input"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describí tu experiencia, equipamiento (plugins, outboard), entregables y tiempos de entrega estimados..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button
                variant="ghost"
                type="button"
                onClick={() => navigate('/marketplace')}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={loading} icon={<Plus size={16} />}>
                Publicar Servicio
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
