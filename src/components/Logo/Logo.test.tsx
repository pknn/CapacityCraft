import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Logo from './Logo';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('Logo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders logo text correctly', () => {
      render(<Logo />);
      expect(screen.getByText('Capacity')).toBeInTheDocument();
      expect(screen.getByText('Craft')).toBeInTheDocument();
    });

    it('applies correct styles to container', () => {
      render(<Logo />);
      const container = screen.getByRole('button');
      expect(container).toHaveClass(
        'cursor-pointer',
        'p-4',
        'pl-0',
        'text-2xl',
        'font-bold',
        'text-stone-800'
      );
    });

    it('applies negative margin to first line', () => {
      render(<Logo />);
      const capacityText = screen.getByText('Capacity');
      expect(capacityText).toHaveClass('-mb-2');
    });
  });

  describe('navigation', () => {
    it('navigates to home on click', async () => {
      render(<Logo />);
      await userEvent.click(screen.getByRole('button'));
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('navigates to home on Enter key', async () => {
      render(<Logo />);
      const logo = screen.getByRole('button');
      await userEvent.type(logo, '{Enter}');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('accessibility', () => {
    it('has correct button role', () => {
      render(<Logo />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('is keyboard focusable', () => {
      render(<Logo />);
      const logo = screen.getByRole('button');
      expect(logo).toHaveAttribute('tabIndex', '0');
    });
  });
});
