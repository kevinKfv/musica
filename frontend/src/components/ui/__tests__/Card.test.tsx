import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '../Card';

describe('Card component suite', () => {
  it('debe renderizar la estructura completa de Card', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Mi Banda</CardTitle>
          <CardDescription>Detalles del grupo</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Integrantes y ensayos programados</p>
        </CardContent>
        <CardFooter>
          <button>Ver más</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByRole('heading', { name: /mi banda/i })).toBeInTheDocument();
    expect(screen.getByText(/detalles del grupo/i)).toBeInTheDocument();
    expect(screen.getByText(/integrantes y ensayos programados/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ver más/i })).toBeInTheDocument();
  });
});
