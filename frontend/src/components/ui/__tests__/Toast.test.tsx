import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastContainer, toast, useToast } from '../Toast';

describe('Toast and useToast', () => {
  beforeEach(() => {
    act(() => {
      useToast.getState().clearAll();
    });
  });

  it('no debe renderizar nada si no hay toasts activos', () => {
    const { container } = render(<ToastContainer />);
    expect(container.firstChild).toBeNull();
  });

  it('debe renderizar un toast de éxito cuando se llama a toast.success()', () => {
    render(<ToastContainer />);

    act(() => {
      toast.success('Perfil actualizado correctamente', 'Éxito');
    });

    expect(screen.getByText('Éxito')).toBeInTheDocument();
    expect(screen.getByText('Perfil actualizado correctamente')).toBeInTheDocument();
  });

  it('debe permitir cerrar el toast manualmente con el botón X', () => {
    render(<ToastContainer />);

    act(() => {
      toast.error('Ocurrió un error inesperado');
    });

    expect(screen.getByText('Ocurrió un error inesperado')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /cerrar notificación/i });
    fireEvent.click(closeButton);

    expect(screen.queryByText('Ocurrió un error inesperado')).not.toBeInTheDocument();
  });
});
