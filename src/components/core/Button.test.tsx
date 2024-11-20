import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
  describe('Default variant', () => {
    it('renders children correctly', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('applies default classes', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toHaveClass(
        'rounded',
        'px-4',
        'py-2',
        'text-stone-100',
        'cursor-pointer',
        'bg-stone-500',
        'hover:bg-stone-400'
      );
    });

    it('handles click events', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('merges custom className with default classes', () => {
      render(<Button className="custom-class">Click me</Button>);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('handles disabled state', async () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Click me
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();

      await userEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Loading variant', () => {
    it('renders loading spinner instead of children', () => {
      render(<Button variant="loading">Click me</Button>);

      const spinner = screen.getByRole('button').querySelector('svg');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('aria-hidden', 'true');
      expect(screen.queryByText('Click me')).not.toBeInTheDocument();
    });

    it('applies loading-specific classes', () => {
      render(<Button variant="loading">Click me</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('cursor-not-allowed', 'bg-stone-400');
      expect(button).not.toHaveClass(
        'cursor-pointer',
        'bg-stone-500',
        'hover:bg-stone-400'
      );
    });

    it('renders spinner with correct styles', () => {
      render(<Button variant="loading">Click me</Button>);

      const spinner = screen.getByRole('button').querySelector('svg');
      expect(spinner).toHaveClass(
        'size-6',
        'animate-spin',
        'fill-stone-300',
        'text-stone-200',
        'dark:text-stone-600'
      );
    });

    it('still allows clicks but shows not-allowed cursor', async () => {
      const handleClick = vi.fn();
      render(
        <Button variant="loading" onClick={handleClick}>
          Click me
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('cursor-not-allowed');

      await userEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge cases', () => {
    it('handles empty children', () => {
      render(<Button />);
      expect(screen.getByRole('button')).toBeEmptyDOMElement();
    });

    it('handles null onClick', () => {
      render(<Button onClick={undefined}>Click me</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('handles both disabled and loading states', () => {
      render(
        <Button variant="loading" disabled>
          Click me
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('cursor-not-allowed');
      expect(button.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has correct type attribute', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('maintains button role when loading', () => {
      render(<Button variant="loading">Click me</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('hides loading spinner from screen readers', () => {
      render(<Button variant="loading">Click me</Button>);
      const spinner = screen.getByRole('button').querySelector('svg');
      expect(spinner).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Interactive behavior', () => {
    it('visually indicates non-interactive state when loading', () => {
      render(<Button variant="loading">Click me</Button>);

      expect(screen.getByRole('button')).toHaveClass(
        'cursor-not-allowed',
        'bg-stone-400'
      );
    });

    it('maintains disabled state when variant changes', () => {
      const { rerender } = render(<Button disabled>Click me</Button>);

      expect(screen.getByRole('button')).toBeDisabled();

      rerender(
        <Button variant="loading" disabled>
          Click me
        </Button>
      );

      expect(screen.getByRole('button')).toBeDisabled();
    });
  });
});
