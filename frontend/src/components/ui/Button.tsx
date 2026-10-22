import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'secondary':
        return {
          background: 'rgba(255, 255, 255, 0.06)',
          color: 'var(--bh-text-primary, #f4f4f5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: 'var(--bh-text-secondary, #a1a1aa)',
          border: '1px solid transparent',
        };
      case 'danger':
        return {
          background: 'rgba(239, 68, 68, 0.15)',
          color: '#f87171',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        };
      case 'outline':
        return {
          background: 'transparent',
          color: 'var(--bh-accent-primary, #7c3aed)',
          border: '1px solid var(--bh-accent-primary, #7c3aed)',
        };
      case 'primary':
      default:
        return {
          background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 4px 15px rgba(124, 58, 237, 0.35)',
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return {
          padding: '6px 12px',
          fontSize: '0.8125rem',
          borderRadius: '8px',
          gap: '6px',
        };
      case 'lg':
        return {
          padding: '14px 28px',
          fontSize: '1rem',
          borderRadius: '12px',
          gap: '10px',
        };
      case 'md':
      default:
        return {
          padding: '10px 18px',
          fontSize: '0.875rem',
          borderRadius: '10px',
          gap: '8px',
        };
    }
  };

  return (
    <button
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontFamily: 'inherit',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        outline: 'none',
        userSelect: 'none',
        ...getVariantStyles(),
        ...getSizeStyles(),
      }}
      className={`bh-button bh-button-${variant} ${className}`}
      {...props}
    >
      {loading ? (
        <span
          className="spinner"
          style={{
            width: size === 'sm' ? '14px' : '18px',
            height: size === 'sm' ? '14px' : '18px',
            borderWidth: '2px',
          }}
        />
      ) : (
        icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>
      )}
      {children}
    </button>
  );
};
