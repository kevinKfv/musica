import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Music2, AlertCircle, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../api/apiClient';
import { useAuthStore } from '../../store/useAuthStore';

export default function RegisterPage() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore(state => state.setAuth);
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/auth/register', data);
      setAuth({ email: response.data.email }, response.data.accessToken);
      navigate('/');
    } catch (err: any) {
      if (!err.response) {
        setError('No se pudo conectar con el servidor. Verificá que el backend esté iniciado.');
      } else {
        setError(
          err.response?.data?.message ||
          'No se pudo crear la cuenta. Es posible que el correo ya esté en uso.'
        );
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
          <p className="auth-logo-subtitle">Creá tu cuenta gratis</p>
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
            <label className="form-label">Nombre de usuario</label>
            <div className="form-input-wrapper">
              <User size={16} className="form-input-icon" />
              <input
                id="register-username"
                type="text"
                autoComplete="username"
                placeholder="tu nombre artístico"
                className="form-input"
                {...register('username', { required: true })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <div className="form-input-wrapper">
              <Mail size={16} className="form-input-icon" />
              <input
                id="register-email"
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
                id="register-password"
                type="password"
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                className="form-input"
                {...register('password', { required: true, minLength: 8 })}
              />
            </div>
          </div>

          <button
            id="register-submit"
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading
              ? <><span className="spinner" /> Creando cuenta...</>
              : 'Crear cuenta gratuita'
            }
          </button>
        </form>

        <div className="auth-footer-link">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login">Iniciá sesión</Link>
        </div>
      </div>
    </div>
  );
}

