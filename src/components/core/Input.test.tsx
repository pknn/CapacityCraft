import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input', () => {
  const defaultProps = {
    name: 'test',
    placeholder: 'Enter value',
    type: 'text' as const,
    value: '',
    onValueChange: vi.fn(),
  };

  describe('Rendering', () => {
    it('renders input with basic props', () => {
      render(<Input {...defaultProps} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('id', 'test-field');
      expect(input).toHaveAttribute('placeholder', 'Enter value');
    });

    it('renders label when provided', () => {
      render(<Input {...defaultProps} label="Test Label" />);

      const label = screen.getByText('Test Label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute('for', 'test-field');
    });

    it('does not render label when not provided', () => {
      render(<Input {...defaultProps} />);
      expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });
  });

  describe('Functionality', () => {
    it('calls onValueChange for each character typed', async () => {
      const handleChange = vi.fn();
      render(<Input {...defaultProps} onValueChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'test');

      expect(handleChange).toHaveBeenCalledTimes(4);
      expect(handleChange).toHaveBeenNthCalledWith(1, 't');
      expect(handleChange).toHaveBeenNthCalledWith(2, 'e');
      expect(handleChange).toHaveBeenNthCalledWith(3, 's');
      expect(handleChange).toHaveBeenNthCalledWith(4, 't');
    });

    it('handles single character input', async () => {
      const handleChange = vi.fn();
      render(<Input {...defaultProps} onValueChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'a');

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('a');
    });

    it('handles number input changes', async () => {
      const handleChange = vi.fn();
      render(
        <Input
          {...defaultProps}
          type="number"
          value={0}
          onValueChange={handleChange}
        />
      );

      const input = screen.getByRole('spinbutton');
      await userEvent.type(input, '42');

      expect(handleChange).toHaveBeenCalledTimes(2);
      expect(handleChange).toHaveBeenNthCalledWith(1, '4');
      expect(handleChange).toHaveBeenNthCalledWith(2, '2');
    });

    it('respects step attribute for number inputs', () => {
      render(<Input {...defaultProps} type="number" value={0} step={0.5} />);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('step', '0.5');
    });
  });

  describe('Styling', () => {
    it('has correct default styles', () => {
      render(<Input {...defaultProps} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass(
        'max-w-40',
        'rounded',
        'px-4',
        'py-2',
        'text-stone-500',
        'caret-stone-500',
        'outline-stone-500'
      );
    });

    it('applies container styles', () => {
      render(<Input {...defaultProps} />);

      const container = screen.getByRole('textbox').parentElement;
      expect(container).toHaveClass('my-4', 'max-w-40');
    });

    it('applies label styles', () => {
      render(<Input {...defaultProps} label="Test Label" />);

      const label = screen.getByText('Test Label');
      expect(label).toHaveClass('mb-1', 'block', 'text-xs');
    });
  });

  describe('Edge cases', () => {
    it('handles empty label string', () => {
      render(<Input {...defaultProps} label="" />);
      expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });

    it('handles empty value', () => {
      render(<Input {...defaultProps} value="" />);
      expect(screen.getByRole('textbox')).toHaveValue('');
    });

    it('handles undefined value with number type', () => {
      render(
        <Input
          {...defaultProps}
          type="number"
          value={undefined}
          onValueChange={vi.fn()}
        />
      );

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(null);
    });
  });

  describe('Accessibility', () => {
    it('associates label with input using htmlFor', () => {
      render(<Input {...defaultProps} label="Test Label" />);

      const label = screen.getByText('Test Label');
      const input = screen.getByRole('textbox');
      expect(label).toHaveAttribute('for', input.id);
    });

    it('maintains input type for assistive technology', () => {
      const { rerender } = render(<Input {...defaultProps} type="text" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();

      rerender(<Input {...defaultProps} type="number" value={0} />);
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });
  });
});
