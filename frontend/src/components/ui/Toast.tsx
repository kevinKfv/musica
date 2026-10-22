import React from 'react';
import { create } from 'zustand';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastStore {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { ...toast, id };
    
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    const duration = toast.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      }, duration);
    }

    return id;
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  clearAll: () => set({ toasts: [] }),
}));

// Atajos convenientes
export const toast = {
  success: (message: string, title?: string) =>
    useToast.getState().addToast({ type: 'success', message, title }),
  error: (message: string, title?: string) =>
    useToast.getState().addToast({ type: 'error', message, title }),
  warning: (message: string, title?: string) =>
    useToast.getState().addToast({ type: 'warning', message, title }),
  info: (message: string, title?: string) =>
    useToast.getState().addToast({ type: 'info', message, title }),
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color="#10b981" />;
      case 'error':
        return <AlertCircle size={18} color="#ef4444" />;
      case 'warning':
        return <AlertTriangle size={18} color="#f59e0b" />;
      case 'info':
      default:
        return <Info size={18} color="#3b82f6" />;
    }
  };

  const getBorderColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'rgba(16, 185, 129, 0.4)';
      case 'error':
        return 'rgba(239, 68, 68, 0.4)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.4)';
      case 'info':
      default:
        return 'rgba(59, 130, 246, 0.4)';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            pointerEvents: 'auto',
            background: 'rgba(18, 18, 26, 0.95)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid ${getBorderColor(t.type)}`,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0,0,0,0.4)',
            borderRadius: '12px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            animation: 'fadeInUp 0.25s ease-out forwards',
            color: '#f4f4f5',
          }}
        >
          <div style={{ marginTop: '2px', flexShrink: 0 }}>{getIcon(t.type)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {t.title && (
              <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '2px' }}>
                {t.title}
              </div>
            )}
            <div style={{ fontSize: '0.8125rem', color: '#d4d4d8', lineHeight: 1.4 }}>
              {t.message}
            </div>
          </div>
          <button
            onClick={() => removeToast(t.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#71717a',
              cursor: 'pointer',
              padding: '2px',
              marginTop: '1px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
            }}
            aria-label="Cerrar notificación"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
