import React, { useState, useEffect } from 'react';
import { marketplaceApi, ServiceOffering } from '../../api/marketplaceApi';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Plus, Sparkles, DollarSign } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui';

export const MarketplaceHome = () => {
  const [services, setServices] = useState<ServiceOffering[]>([]);
  const [category, setCategory] = useState<string>('Music Production');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categories = [
    { id: 'Music Production', label: 'Producción Musical' },
    { id: 'Mixing & Mastering', label: 'Mezcla & Mastering' },
    { id: 'Session Musician', label: 'Músicos de Sesión' },
    { id: 'Vocals', label: 'Voces & Coros' },
  ];

  useEffect(() => {
    fetchServices();
  }, [category]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await marketplaceApi.getServicesByCategory(category);
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
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
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Briefcase size={18} />
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
              Marketplace Musical
            </h1>
          </div>
          <p style={{ margin: 0, color: 'var(--bh-text-secondary, #a1a1aa)', fontSize: '0.875rem' }}>
            Contratá productores, sesionistas e ingenieros certificados de la comunidad.
          </p>
        </div>

        <Button
          onClick={() => navigate('/marketplace/publish')}
          icon={<Plus size={16} />}
        >
          Publicar Servicio
        </Button>
      </div>

      {/* Category Pills Filter */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              border: category === cat.id ? '1px solid #7c3aed' : '1px solid rgba(255, 255, 255, 0.08)',
              background: category === cat.id ? 'rgba(124, 58, 237, 0.25)' : 'rgba(255, 255, 255, 0.03)',
              color: category === cat.id ? '#c4b5fd' : '#a1a1aa',
              transition: 'all 0.15s ease',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {loading ? (
        <Card style={{ padding: '3rem', textAlign: 'center', color: '#a1a1aa' }}>
          <div className="spinner" style={{ margin: '0 auto 12px' }} />
          Buscando servicios disponibles...
        </Card>
      ) : services.length === 0 ? (
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
              background: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981',
            }}
          >
            <Briefcase size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f4f4f5', margin: '0 0 6px' }}>
              No hay servicios en esta categoría todavía
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#a1a1aa', margin: 0, maxWidth: '380px' }}>
              Sé el primer profesional en ofrecer servicios de {category} en BandHub.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/marketplace/publish')}
            icon={<Plus size={14} />}
          >
            Ofrecer mis servicios
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {services.map((service) => (
            <Card
              key={service.id}
              onClick={() => navigate(`/marketplace/service/${service.id}`)}
              style={{
                cursor: 'pointer',
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
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
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    {service.category}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--bh-font-display, "Syne", sans-serif)',
                      fontSize: '1.125rem',
                      fontWeight: 800,
                      color: '#10b981',
                    }}
                  >
                    ${service.price} {service.currency}
                  </span>
                </div>
                <CardTitle style={{ fontSize: '1.125rem', lineHeight: 1.3 }}>{service.title}</CardTitle>
                <CardDescription style={{ marginTop: '8px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem', color: '#a78bfa', fontWeight: 600 }}>
                  <span>Ver detalles del servicio</span>
                  <span>&rarr;</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
