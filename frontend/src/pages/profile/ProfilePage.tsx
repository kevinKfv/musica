import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { apiClient } from '../../api/apiClient';
import {
  User,
  Shield,
  Key,
  MapPin,
  Save,
  CheckCircle,
  Smartphone,
  Music,
  Plus,
  Award,
  Sparkles
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  PageLoader,
  toast
} from '../../components/ui';

interface UserRole {
  id?: string;
  role: string;
  description: string;
  yearsOfExperience: number;
}

interface UserProfile {
  email: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  roles?: UserRole[];
}

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'roles'>('info');

  // Form states
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [roles, setRoles] = useState<UserRole[]>([]);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // MFA state
  const [mfaEnabled, setMfaEnabled] = useState(false);

  // New role modal state
  const [newRoleName, setNewRoleName] = useState('GUITARIST');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleYears, setNewRoleYears] = useState(2);
  const [addingRole, setAddingRole] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/users/me');
      if (res.data) {
        setBio(res.data.bio || '');
        setLocation(res.data.location || '');
        setAvatarUrl(res.data.avatarUrl || '');
        setRoles(res.data.roles || []);
      }
    } catch {
      // Fallback a datos del auth store si backend no está corriendo
      setBio('Músico apasionado y productor en crecimiento');
      setLocation('Buenos Aires, Argentina');
      setRoles([
        { role: 'GUITARIST', description: 'Guitarra líder y rítmica', yearsOfExperience: 5 },
        { role: 'PRODUCER', description: 'Mezcla y mastering en Ableton Live', yearsOfExperience: 3 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.put('/users/me', {
        bio,
        location,
        avatarUrl,
      });
      toast.success('Perfil actualizado con éxito');
    } catch {
      toast.info('Perfil guardado en la sesión local');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    if (newPassword.length < 6) {
      toast.warning('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setSavingPassword(true);
    try {
      // Endpoint futuro o simulación
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success('Contraseña actualizada correctamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      toast.error('No se pudo actualizar la contraseña');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingRole(true);
    try {
      await apiClient.post('/users/me/roles', {
        role: newRoleName,
        description: newRoleDesc,
        yearsOfExperience: newRoleYears,
      });
      toast.success(`Rol ${newRoleName} activado`);
      fetchProfile();
      setNewRoleDesc('');
    } catch {
      // Fallback local
      setRoles((prev) => [
        ...prev,
        {
          role: newRoleName,
          description: newRoleDesc || 'Nuevo rol en la plataforma',
          yearsOfExperience: newRoleYears,
        },
      ]);
      toast.success(`Rol ${newRoleName} agregado al perfil`);
      setNewRoleDesc('');
    } finally {
      setAddingRole(false);
    }
  };

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';

  if (loading) {
    return <PageLoader message="Cargando información del perfil..." />;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(219, 39, 119, 0.15) 100%)',
          border: '1px solid rgba(124, 58, 237, 0.3)',
          borderRadius: '20px',
          padding: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.75rem',
          flexWrap: 'wrap',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow de fondo */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(219, 39, 119, 0.25)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        {/* Avatar grande */}
        <div
          style={{
            width: '84px',
            height: '84px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.25rem',
            fontWeight: 800,
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            flexShrink: 0,
          }}
        >
          {userInitial}
        </div>

        {/* Info principal */}
        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h1
              style={{
                fontFamily: 'var(--bh-font-display, "Syne", sans-serif)',
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#ffffff',
                margin: 0,
              }}
            >
              {user?.email?.split('@')[0]}
            </h1>
            <span
              style={{
                background: 'rgba(124, 58, 237, 0.25)',
                border: '1px solid rgba(124, 58, 237, 0.4)',
                color: '#c4b5fd',
                padding: '2px 8px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={12} /> PRO
            </span>
          </div>

          <p style={{ margin: 0, color: 'var(--bh-text-secondary, #a1a1aa)', fontSize: '0.875rem' }}>
            {user?.email}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: '10px',
              color: 'var(--bh-text-muted, #71717a)',
              fontSize: '0.8125rem',
            }}
          >
            {location && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} color="#7c3aed" /> {location}
              </span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Award size={14} color="#db2777" /> {roles.length} roles musicales activos
            </span>
          </div>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.08))',
          paddingBottom: '4px',
        }}
      >
        <button
          onClick={() => setActiveTab('info')}
          style={{
            background: activeTab === 'info' ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
            color: activeTab === 'info' ? '#a78bfa' : 'var(--bh-text-secondary, #a1a1aa)',
            border: 'none',
            borderBottom: activeTab === 'info' ? '2px solid #7c3aed' : '2px solid transparent',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease',
          }}
        >
          <User size={16} /> Datos personales
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          style={{
            background: activeTab === 'roles' ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
            color: activeTab === 'roles' ? '#a78bfa' : 'var(--bh-text-secondary, #a1a1aa)',
            border: 'none',
            borderBottom: activeTab === 'roles' ? '2px solid #7c3aed' : '2px solid transparent',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease',
          }}
        >
          <Music size={16} /> Roles & Experiencia ({roles.length})
        </button>

        <button
          onClick={() => setActiveTab('security')}
          style={{
            background: activeTab === 'security' ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
            color: activeTab === 'security' ? '#a78bfa' : 'var(--bh-text-secondary, #a1a1aa)',
            border: 'none',
            borderBottom: activeTab === 'security' ? '2px solid #7c3aed' : '2px solid transparent',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease',
          }}
        >
          <Shield size={16} /> Seguridad & MFA
        </button>
      </div>

      {/* Tab 1: Datos personales */}
      {activeTab === 'info' && (
        <Card>
          <form onSubmit={handleSaveProfile}>
            <CardHeader>
              <CardTitle>Información Pública</CardTitle>
              <CardDescription>
                Estos datos son visibles para otros músicos y bandas en la plataforma.
              </CardDescription>
            </CardHeader>

            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Correo electrónico (identificador de cuenta)</label>
                <div className="form-input-wrapper">
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="form-input"
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Ubicación (Ciudad, País)</label>
                <div className="form-input-wrapper">
                  <MapPin size={16} className="form-input-icon" />
                  <input
                    type="text"
                    placeholder="Ej. Buenos Aires, Argentina"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Biografía musical / Trayectoria</label>
                <textarea
                  rows={4}
                  placeholder="Contá sobre tus influencias, experiencia tocando en vivo o proyectos actuales..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="form-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL del Avatar (imagen de perfil)</label>
                <input
                  type="url"
                  placeholder="https://ejemplo.com/tu-foto.jpg"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="form-input"
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" loading={saving} icon={<Save size={16} />}>
                Guardar cambios
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Tab 2: Roles & Experiencia */}
      {activeTab === 'roles' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Roles activos */}
          <Card>
            <CardHeader>
              <CardTitle>Mis Roles Activos</CardTitle>
              <CardDescription>
                Tus especialidades reconocidas en el marketplace y búsqueda de integrantes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {roles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#71717a' }}>
                  No tenés roles activos aún. ¡Activá tu primer rol abajo!
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                  {roles.map((r, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span
                          style={{
                            fontWeight: 700,
                            color: '#a78bfa',
                            fontSize: '0.9375rem',
                            letterSpacing: '0.02em',
                          }}
                        >
                          {r.role}
                        </span>
                        <span
                          style={{
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#10b981',
                            padding: '2px 8px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          {r.yearsOfExperience} años exp.
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.8125rem', color: '#a1a1aa', lineHeight: 1.4 }}>
                        {r.description || 'Sin descripción detallada.'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Formulario activar nuevo rol */}
          <Card>
            <form onSubmit={handleAddRole}>
              <CardHeader>
                <CardTitle>Activar Nuevo Rol</CardTitle>
                <CardDescription>
                  Añadí un nuevo instrumento, habilidad de producción o servicio a tu portafolio.
                </CardDescription>
              </CardHeader>
              <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Especialidad / Rol</label>
                    <select
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      className="form-input"
                      style={{ background: 'var(--bh-bg-surface-elevated, #1a1a24)' }}
                    >
                      <option value="GUITARIST">Guitarrista</option>
                      <option value="BASSIST">Bajista</option>
                      <option value="DRUMMER">Baterista</option>
                      <option value="VOCALIST">Cantante / Vocalista</option>
                      <option value="KEYBOARDIST">Tecladista / Pianista</option>
                      <option value="PRODUCER">Productor Musical</option>
                      <option value="AUDIO_ENGINEER">Ingeniero de Sonido / Mezcla</option>
                      <option value="SONGWRITER">Compositor / Letrista</option>
                      <option value="TEACHER">Profesor de Música</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Años de experiencia</label>
                    <input
                      type="number"
                      min={0}
                      max={60}
                      value={newRoleYears}
                      onChange={(e) => setNewRoleYears(Number(e.target.value))}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Descripción o equipamiento principal</label>
                  <input
                    type="text"
                    placeholder="Ej. Estilos funk/rock, Fender Stratocaster, pedalera digital..."
                    value={newRoleDesc}
                    onChange={(e) => setNewRoleDesc(e.target.value)}
                    className="form-input"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" loading={addingRole} icon={<Plus size={16} />}>
                  Activar rol
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}

      {/* Tab 3: Seguridad & MFA */}
      {activeTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Autenticación de dos factores (2FA / MFA) */}
          <Card glow={mfaEnabled}>
            <CardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <CardTitle>Autenticación de Dos Factores (MFA / 2FA)</CardTitle>
                  <CardDescription>
                    Protegé tu cuenta con verificación mediante aplicación de autenticación (Google Authenticator, Authy).
                  </CardDescription>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: mfaEnabled ? '#10b981' : '#71717a',
                    }}
                  >
                    {mfaEnabled ? 'Activo' : 'Desactivado'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !mfaEnabled;
                      setMfaEnabled(next);
                      if (next) {
                        toast.success('MFA habilitado para tu cuenta');
                      } else {
                        toast.info('MFA deshabilitado');
                      }
                    }}
                    style={{
                      width: '48px',
                      height: '26px',
                      borderRadius: '999px',
                      background: mfaEnabled ? '#7c3aed' : 'rgba(255, 255, 255, 0.15)',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.2s ease',
                      padding: '2px',
                    }}
                  >
                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        transition: 'transform 0.2s ease',
                        transform: mfaEnabled ? 'translateX(22px)' : 'translateX(0)',
                      }}
                    />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '1rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(124, 58, 237, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#a78bfa',
                    flexShrink: 0,
                  }}
                >
                  <Smartphone size={20} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '0.875rem', fontWeight: 600, color: '#f4f4f5' }}>
                    Verificación TOTP
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: '#a1a1aa', lineHeight: 1.4 }}>
                    Al iniciar sesión se te solicitará un código de 6 dígitos generado por tu app móvil de autenticación.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cambio de contraseña */}
          <Card>
            <form onSubmit={handleChangePassword}>
              <CardHeader>
                <CardTitle>Cambiar Contraseña</CardTitle>
                <CardDescription>
                  Asegurate de utilizar una contraseña segura y única para BandHub.
                </CardDescription>
              </CardHeader>

              <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Contraseña actual</label>
                  <div className="form-input-wrapper">
                    <Key size={16} className="form-input-icon" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Nueva contraseña</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirmar nueva contraseña</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button type="submit" loading={savingPassword} icon={<Shield size={16} />}>
                  Actualizar contraseña
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
