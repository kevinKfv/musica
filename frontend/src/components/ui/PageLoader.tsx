import React from 'react';
import { Music2 } from 'lucide-react';

export interface PageLoaderProps {
  message?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ message = 'Cargando...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '320px',
        width: '100%',
        padding: '2rem',
        gap: '1.25rem',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '72px',
          height: '72px',
        }}
      >
        {/* Glow pulsing ring */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, rgba(219, 39, 119, 0) 70%)',
            animation: 'pulse 2s infinite',
          }}
        />

        {/* Spinner ring */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: '#7c3aed',
            borderRightColor: '#db2777',
            animation: 'spin 1s linear infinite',
          }}
        />

        {/* Center icon */}
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)',
          }}
        >
          <Music2 size={24} color="#ffffff" />
        </div>
      </div>

      <div
        style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--bh-text-secondary, #a1a1aa)',
          letterSpacing: '0.02em',
        }}
      >
        {message}
      </div>
    </div>
  );
};
