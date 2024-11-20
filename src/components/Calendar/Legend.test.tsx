import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Legend from './Legend';

describe('Legend', () => {
  it('renders all legend items correctly', () => {
    render(<Legend />);

    // Test instructions text
    expect(screen.getByText('Click to cycle day type')).toBeInTheDocument();

    // Test legend type indicators
    expect(screen.getByText('G - Global')).toBeInTheDocument();
    expect(screen.getByText('P - Personal')).toBeInTheDocument();

    // Test day types
    expect(screen.getByText(/Full Working day/)).toBeInTheDocument();
    expect(screen.getByText(/Half Working day/)).toBeInTheDocument();
    expect(screen.getByText(/Off day/)).toBeInTheDocument();

    // Test type annotations
    expect(screen.getAllByText('(G&P)')).toHaveLength(2);
    expect(screen.getByText('(P)')).toBeInTheDocument();
  });

  it('renders colored squares for each day type', () => {
    render(<Legend />);

    const colorSquares = document.querySelectorAll('.size-4.rounded');
    expect(colorSquares).toHaveLength(3);

    // Test color classes
    expect(colorSquares[0]).toHaveClass('bg-stone-300');
    expect(colorSquares[1]).toHaveClass('bg-stone-500');
    expect(colorSquares[2]).toHaveClass('bg-stone-700');
  });
});
