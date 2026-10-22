import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            padding: '2rem',
            width: '100%',
          }}
        >
          <div
            style={{
              maxWidth: '480px',
              width: '100%',
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '16px',
              padding: '2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444',
              }}
            >
              <AlertTriangle size={28} />
            </div>

            <div>
              <h2
                style={{
                  fontFamily: 'var(--bh-font-display, "Syne", sans-serif)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '0.5rem',
                }}
              >
                Algo no salió como esperábamos
              </h2>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--bh-text-secondary, #a1a1aa)',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Ocurrió un error inesperado al renderizar esta sección. Podés intentar recargar la página o volver al inicio.
              </p>
            </div>

            {this.state.error && (
              <pre
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.75rem',
                  background: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  color: '#fca5a5',
                  overflowX: 'auto',
                  maxHeight: '120px',
                }}
              >
                {this.state.error.message}
              </pre>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button
                variant="secondary"
                size="sm"
                icon={<RefreshCw size={14} />}
                onClick={this.handleReset}
              >
                Reintentar
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Home size={14} />}
                onClick={() => {
                  window.location.href = '/';
                }}
              >
                Ir al Dashboard
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
