import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button component', () => {
  it('debe renderizar el contenido hijo correctamente', () => {
    render(<Button>Explorar Instrumentos</Button>);
    expect(screen.getByRole('button', { name: /explorar instrumentos/i })).toBeInTheDocument();
  });

  it('debe responder al evento onClick', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('no debe disparar onClick si está deshabilitado', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Deshabilitado</Button>);

    const button = screen.getByRole('button', { name: /deshabilitado/i });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('debe mostrar spinner y estar deshabilitado cuando loading=true', () => {
    const handleClick = vi.fn();
    render(<Button loading onClick={handleClick}>Guardando</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.querySelector('.spinner')).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('debe aplicar la clase de variante correspondiente', () => {
    const { rerender } = render(<Button variant="danger">Eliminar</Button>);
    expect(screen.getByRole('button')).toHaveClass('bh-button-danger');

    rerender(<Button variant="secondary">Cancelar</Button>);
    expect(screen.getByRole('button')).toHaveClass('bh-button-secondary');
  });
});
