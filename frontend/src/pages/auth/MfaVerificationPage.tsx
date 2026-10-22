import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Music2, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui';

export default function MfaVerificationPage() {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const handleChange = (index: number, value: string) => {
    // Permitir solo dígitos numéricos
    if (value && !/^\d+$/.test(value)) return;

    const newDigits = [...digits];
    // Si pega varios dígitos
    if (value.length > 1) {
      const pasted = value.slice(0, 6).split('');
      pasted.forEach((char, i) => {
        newDigits[i] = char;
      });
      setDigits(newDigits);
      const nextIdx = Math.min(pasted.length, 5);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    newDigits[index] = value;
    setDigits(newDigits);

    // Auto-advance al siguiente input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 6) {
      setError('Por favor completá los 6 dígitos del código.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Simulación de verificación o endpoint futuro
      await new Promise((resolve) => setTimeout(resolve, 800));
      // Redirigir al dashboard
      navigate('/');
    } catch {
      setError('Código inválido o expirado. Verificá tu aplicación de autenticación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card" style={{ maxWidth: '440px' }}>
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <Music2 size={28} color="white" />
          </div>
          <h1 className="auth-logo-title">BandHub</h1>
          <p className="auth-logo-subtitle">Verificación de Seguridad</p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'rgba(124, 58, 237, 0.15)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#a78bfa',
              marginBottom: '1rem',
            }}
          >
            <ShieldCheck size={28} />
          </div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 6px', color: '#ffffff' }}>
            Autenticación en dos pasos
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
            Ingresá el código de 6 dígitos generado por tu app de autenticación (Google Authenticator / Authy).
          </p>
        </div>

        {error && (
          <div className="alert-error" style={{ marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* 6 Digit Inputs */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '1.75rem',
            }}
          >
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                style={{
                  width: '46px',
                  height: '54px',
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: digit ? '1px solid #7c3aed' : '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  outline: 'none',
                  boxShadow: digit ? '0 0 10px rgba(124, 58, 237, 0.3)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              />
            ))}
          </div>

          <Button
            type="submit"
            loading={loading}
            style={{ width: '100%', padding: '12px', fontSize: '0.9375rem' }}
          >
            Verificar código
          </Button>
        </form>

        <div
          style={{
            marginTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8125rem',
          }}
        >
          <Link
            to="/login"
            style={{
              color: '#a1a1aa',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={14} /> Volver al login
          </Link>

          <button
            type="button"
            onClick={() => setDigits(['', '', '', '', '', ''])}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#a78bfa',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8125rem',
            }}
          >
            <RefreshCw size={12} /> Limpiar
          </button>
        </div>
      </div>
    </div>
  );
}
