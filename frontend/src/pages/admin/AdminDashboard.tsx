import { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { Users, Music, Activity, ShieldAlert, Shield } from 'lucide-react';
import { ModerationPanel } from './ModerationPanel';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui';

export const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getAnalytics()
      .then(setAnalytics)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Shield size={18} />
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
            Panel de Administración
          </h1>
        </div>
        <p style={{ margin: 0, color: 'var(--bh-text-secondary, #a1a1aa)', fontSize: '0.875rem' }}>
          Métricas de actividad global, supervisión de contenidos y moderación de reportes.
        </p>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <MetricCard
          title="Usuarios Registrados"
          value={analytics.activeUsers}
          icon={<Users size={20} color="#3b82f6" />}
          loading={loading}
        />
        <MetricCard
          title="Bandas Activas"
          value={analytics.totalBands}
          icon={<Music size={20} color="#a78bfa" />}
          loading={loading}
        />
        <MetricCard
          title="Sesiones de Estudio"
          value={analytics.totalCollabProjects}
          icon={<Activity size={20} color="#10b981" />}
          loading={loading}
        />
        <MetricCard
          title="Reportes Pendientes"
          value={analytics.pendingReports}
          icon={<ShieldAlert size={20} color="#ef4444" />}
          loading={loading}
        />
      </div>

      {/* Moderation Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Moderación de Contenido & Denuncias</CardTitle>
          <CardDescription>
            Reportes generados por la comunidad sobre publicaciones o perfiles sospechosos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ModerationPanel />
        </CardContent>
      </Card>
    </div>
  );
};

const MetricCard = ({
  title,
  value,
  icon,
  loading,
}: {
  title: string;
  value?: number;
  icon: React.ReactNode;
  loading: boolean;
}) => (
  <Card style={{ padding: '1.25rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <p style={{ margin: '0 0 4px', fontSize: '0.8125rem', color: '#a1a1aa' }}>{title}</p>
        <h3
          style={{
            margin: 0,
            fontFamily: 'var(--bh-font-display, "Syne", sans-serif)',
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#ffffff',
          }}
        >
          {loading ? '...' : value ?? 0}
        </h3>
      </div>
      <div
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>
    </div>
  </Card>
);
