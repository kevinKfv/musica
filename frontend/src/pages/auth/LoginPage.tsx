import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Music2, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../api/apiClient';
import { useAuthStore } from '../../store/useAuthStore';

export default function LoginPage() {
  const { register, handleSubmit, setValue } = useForm();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore(state => state.setAuth);
  const navigate = useNavigate();

  const handleFillDemo = () => {
    setValue('email', 'admin@bandhub.com');
    setValue('password', 'password123');
    setError(null);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/auth/login', data);
      setAuth({ email: response.data.email }, response.data.accessToken);
      navigate('/');
    } catch (err: any) {
      if (!err.response) {
        setError('No se pudo conectar con el servidor. Verificá que el backend esté corriendo (puerto 8080).');
      } else if (err.response.status === 401 || err.response.status === 403) {
        setError('Credenciales inválidas. Verificá tu correo y contraseña.');
      } else {
        setError(err.response?.data?.message || 'Error del servidor al iniciar sesión. Intentá nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <Music2 size={28} color="white" />
          </div>
          <h1 className="auth-logo-title">BandHub</h1>
          <p className="auth-logo-subtitle">Tu sistema operativo musical</p>
        </div>

        {/* Error */}
        {error && (
          <div className="alert-error">
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <div className="form-input-wrapper">
              <Mail size={16} className="form-input-icon" />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="tu@email.com"
                className="form-input"
                {...register('email', { required: true })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="form-input-wrapper">
              <Lock size={16} className="form-input-icon" />
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="form-input"
                {...register('password', { required: true })}
              />
            </div>
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading
              ? <><span className="spinner" /> Ingresando...</>
              : 'Iniciar sesión'
            }
          </button>
        </form>

        {/* Demo credentials helper */}
        <div style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px dashed rgba(255, 255, 255, 0.12)',
          borderRadius: 'var(--bh-radius-md, 10px)',
          fontSize: '0.8rem',
          color: 'var(--bh-text-muted, #71717a)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, color: 'var(--bh-text-secondary, #a1a1aa)' }}>⚡ Cuenta Demo</span>
            <button
              type="button"
              onClick={handleFillDemo}
              style={{
                background: 'rgba(124, 58, 237, 0.2)',
                color: '#a78bfa',
                border: '1px solid rgba(124, 58, 237, 0.35)',
                borderRadius: '6px',
                padding: '2px 8px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Cargar demo
            </button>
          </div>
          <div>Usuario: <code style={{ color: '#e4e4e7' }}>admin@bandhub.com</code></div>
          <div>Clave: <code style={{ color: '#e4e4e7' }}>password123</code></div>
        </div>

        <div className="auth-footer-link">
          ¿No tenés cuenta?{' '}
          <Link to="/register">Registrate gratis</Link>
        </div>
      </div>
    </div>
  );
}

