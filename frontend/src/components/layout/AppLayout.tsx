import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Calendar, Library, Briefcase, Ticket, BookOpen,
  MessageSquare, Globe, Layers, MapPin, Shield,
  Menu, X, Music2, Bell, LogOut, ChevronRight, User,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { ToastContainer } from '../ui/Toast';
import { ErrorBoundary } from '../ui/ErrorBoundary';

interface NavSection {
  label: string;
  items: {
    to: string;
    icon: React.ElementType;
    label: string;
  }[];
}

const navSections: NavSection[] = [
  {
    label: 'Principal',
    items: [
      { to: '/agenda',      icon: Calendar,      label: 'Agenda' },
      { to: '/social',      icon: Globe,         label: 'Red Social' },
      { to: '/chat',        icon: MessageSquare, label: 'Mensajes' },
    ],
  },
  {
    label: 'Crear & Vender',
    items: [
      { to: '/marketplace', icon: Briefcase,     label: 'Marketplace' },
      { to: '/events',      icon: Ticket,        label: 'Eventos' },
      { to: '/academy',     icon: BookOpen,      label: 'Academia' },
    ],
  },
  {
    label: 'Studio',
    items: [
      { to: '/library',     icon: Library,       label: 'Biblioteca' },
      { to: '/collab',      icon: Layers,        label: 'Estudio Virtual' },
      { to: '/places',      icon: MapPin,        label: 'Mapa de Lugares' },
    ],
  },
];

export function AppLayout() {
  const { sidebarCollapsed: collapsed, toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'BH';

  const getCurrentPageLabel = () => {
    for (const section of navSections) {
      const item = section.items.find(i => location.pathname.startsWith(i.to));
      if (item) return item.label;
    }
    if (location.pathname === '/') return 'Inicio';
    if (location.pathname.startsWith('/profile')) return 'Mi Perfil';
    if (location.pathname.startsWith('/admin')) return 'Administración';
    return 'BandHub';
  };

  return (
    <div className="app-shell">
      {/* ── SIDEBAR ── */}
      <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Music2 size={18} color="white" />
          </div>
          <span className="sidebar-logo-text">BandHub</span>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {/* Dashboard / Home link */}
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            title="Inicio"
          >
            {({ isActive }) => (
              <>
                <Music2
                  size={20}
                  className="nav-item-icon"
                  style={{ color: isActive ? '#a78bfa' : undefined }}
                />
                <span className="nav-item-label">Inicio</span>
              </>
            )}
          </NavLink>

          {navSections.map(section => (
            <div key={section.label}>
              <div className="nav-section-label">{section.label}</div>
              {section.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                  title={item.label}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        size={20}
                        className="nav-item-icon"
                        style={{ color: isActive ? '#a78bfa' : undefined }}
                      />
                      <span className="nav-item-label">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}

          {/* Sistema & Perfil */}
          <div className="nav-section-label">Cuenta & Sistema</div>
          <NavLink
            to="/profile"
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            title="Mi Perfil"
          >
            {({ isActive }) => (
              <>
                <User
                  size={20}
                  className="nav-item-icon"
                  style={{ color: isActive ? '#a78bfa' : undefined }}
                />
                <span className="nav-item-label">Mi Perfil</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `nav-item${isActive ? ' active' : ''}`
            }
            title="Administración"
            style={{ color: 'rgba(248,113,113,0.7)' }}
          >
            {({ isActive }) => (
              <>
                <Shield
                  size={20}
                  className="nav-item-icon"
                  style={{ color: isActive ? '#f87171' : 'rgba(248,113,113,0.6)' }}
                />
                <span className="nav-item-label">Administración</span>
              </>
            )}
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          {/* User info clickable to /profile */}
          <div
            className="nav-item"
            style={{ marginBottom: 4, cursor: 'pointer' }}
            onClick={() => navigate('/profile')}
            title="Ver mi perfil"
          >
            <div
              style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem', fontWeight: 700, color: 'white',
              }}
            >
              {initials}
            </div>
            <div className="nav-item-label" style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--bh-text-1)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email?.split('@')[0] ?? 'Usuario'}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--bh-text-3)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email ?? ''}
              </span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="btn-danger-ghost"
            style={{ width: '100%', justifyContent: collapsed ? 'center' : 'flex-start' }}
            title="Cerrar sesión"
          >
            <LogOut size={16} />
            <span className="nav-item-label">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className={`main-content${collapsed ? ' sidebar-collapsed' : ''}`}>
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="sidebar-toggle"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              {collapsed ? <ChevronRight size={16} /> : <Menu size={16} />}
            </button>

            <nav className="breadcrumb" aria-label="breadcrumb">
              BandHub <span>/</span> {getCurrentPageLabel()}
            </nav>
          </div>

          <div className="topbar-right">
            <button className="btn-ghost" style={{ position: 'relative', padding: '8px' }} title="Notificaciones">
              <Bell size={18} />
              <span className="notif-dot" />
            </button>

            <div
              className="topbar-avatar"
              title="Ir a mi perfil"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/profile')}
            >
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>

      {/* Notificaciones Toast flotantes */}
      <ToastContainer />
    </div>
  );
}
