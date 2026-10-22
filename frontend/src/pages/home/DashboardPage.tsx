import { Link } from 'react-router-dom';
import {
  Calendar, Library, Briefcase, Ticket,
  BookOpen, MessageSquare, Globe, Layers,
  MapPin, Music2, TrendingUp, Users, Zap,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface ModuleCard {
  to: string;
  icon: React.ElementType;
  label: string;
  desc: string;
  color: string;
}

const modules: ModuleCard[] = [
  {
    to: '/agenda',
    icon: Calendar,
    label: 'Agenda',
    desc: 'Ensayos, clases y conciertos.',
    color: 'card-purple',
  },
  {
    to: '/library',
    icon: Library,
    label: 'Biblioteca',
    desc: 'Partituras y backing tracks.',
    color: 'card-pink',
  },
  {
    to: '/marketplace',
    icon: Briefcase,
    label: 'Marketplace',
    desc: 'Contrata profesionales.',
    color: 'card-emerald',
  },
  {
    to: '/events',
    icon: Ticket,
    label: 'Eventos',
    desc: 'Conciertos y ticketing QR.',
    color: 'card-orange',
  },
  {
    to: '/academy',
    icon: BookOpen,
    label: 'Academia',
    desc: 'Cursos y lecciones.',
    color: 'card-blue',
  },
  {
    to: '/chat',
    icon: MessageSquare,
    label: 'Mensajes',
    desc: 'Chat en tiempo real.',
    color: 'card-indigo',
  },
  {
    to: '/social',
    icon: Globe,
    label: 'Red Social',
    desc: 'Descubrí músicos y bandas.',
    color: 'card-cyan',
  },
  {
    to: '/collab',
    icon: Layers,
    label: 'Estudio Virtual',
    desc: 'Multipista con stems.',
    color: 'card-yellow',
  },
  {
    to: '/places',
    icon: MapPin,
    label: 'Mapa',
    desc: 'Estudios y salas cerca.',
    color: 'card-teal',
  },
];

const stats = [
  { icon: Music2,      label: 'Módulos activos',   value: '9',   color: 'rgba(139,92,246,0.15)',  iconColor: '#a78bfa' },
  { icon: Users,       label: 'Red de músicos',     value: '∞',   color: 'rgba(236,72,153,0.15)', iconColor: '#f472b6' },
  { icon: TrendingUp,  label: 'Proyectos',          value: '—',   color: 'rgba(16,185,129,0.15)', iconColor: '#34d399' },
  { icon: Zap,         label: 'Conexión en vivo',   value: 'ON',  color: 'rgba(245,158,11,0.15)', iconColor: '#fbbf24' },
];

export function DashboardPage() {
  const { user } = useAuthStore();
  const username = user?.email?.split('@')[0] ?? 'músico';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? '🌅 Buenos días' : hour < 19 ? '☀️ Buenas tardes' : '🌙 Buenas noches';

  return (
    <div>
      {/* ── Hero ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(236,72,153,0.08) 50%, transparent 100%)',
          border: '1px solid rgba(139,92,246,0.15)',
          borderRadius: 'var(--bh-radius-xl)',
          padding: '32px',
          marginBottom: '28px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'var(--bh-text-3)', fontSize: '0.875rem', marginBottom: 6 }}>
            {greeting},
          </p>
          <h1
            className="font-brand"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #f1f0ff 0%, #a78bfa 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: 8,
              lineHeight: 1.2,
            }}
          >
            {username}
          </h1>
          <p style={{ color: 'var(--bh-text-2)', maxWidth: 480, lineHeight: 1.6 }}>
            Tu sistema operativo musical. Todo lo que necesitás para crear, colaborar y crecer está acá.
          </p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 12,
          marginBottom: 32,
        }}
      >
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div
              className="stat-card-icon"
              style={{ background: s.color }}
            >
              <s.icon size={20} color={s.iconColor} />
            </div>
            <div>
              <div className="stat-card-value">{s.value}</div>
              <div className="stat-card-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Modules ── */}
      <p className="section-title">Módulos de la plataforma</p>
      <div className="grid-modules">
        {modules.map(mod => (
          <Link
            key={mod.to}
            to={mod.to}
            className={`module-card ${mod.color}`}
          >
            <div className="module-card-icon">
              <mod.icon size={22} />
            </div>
            <div>
              <div className="module-card-title">{mod.label}</div>
              <div className="module-card-desc">{mod.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
