import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, glow = false, className = '', style, ...props }) => {
  return (
    <div
      style={{
        background: 'var(--bh-bg-surface, #12121a)',
        border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.08))',
        borderRadius: 'var(--bh-radius-lg, 16px)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: glow ? '0 10px 30px rgba(124, 58, 237, 0.12)' : '0 4px 20px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        ...style,
      }}
      className={`bh-card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  style,
  ...props
}) => (
  <div
    style={{
      padding: '1.25rem 1.5rem',
      borderBottom: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.06))',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
      ...style,
    }}
    className={`bh-card-header ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  style,
  ...props
}) => (
  <h3
    style={{
      fontFamily: 'var(--bh-font-display, "Syne", sans-serif)',
      fontSize: '1.125rem',
      fontWeight: 700,
      color: 'var(--bh-text-primary, #f4f4f5)',
      margin: 0,
      ...style,
    }}
    className={`bh-card-title ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  style,
  ...props
}) => (
  <p
    style={{
      fontSize: '0.875rem',
      color: 'var(--bh-text-muted, #71717a)',
      margin: 0,
      ...style,
    }}
    className={`bh-card-description ${className}`}
    {...props}
  >
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  style,
  ...props
}) => (
  <div
    style={{
      padding: '1.5rem',
      ...style,
    }}
    className={`bh-card-content ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  style,
  ...props
}) => (
  <div
    style={{
      padding: '1rem 1.5rem',
      borderTop: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.06))',
      background: 'rgba(255, 255, 255, 0.015)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: '0.75rem',
      ...style,
    }}
    className={`bh-card-footer ${className}`}
    {...props}
  >
    {children}
  </div>
);
