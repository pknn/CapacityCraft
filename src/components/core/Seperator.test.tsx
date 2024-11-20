import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Separator from './Separator';

describe('Separator', () => {
  it('renders with correct default styles', () => {
    const { container } = render(<Separator />);

    const separator = container.firstChild as HTMLElement;
    expect(separator).toHaveClass(
      'mx-auto',
      'my-8',
      'h-1',
      'w-32',
      'border',
      'border-b-stone-400'
    );
  });

  it('renders as a div element', () => {
    const { container } = render(<Separator />);

    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('maintains consistent dimensions', () => {
    const { container } = render(<Separator />);

    const separator = container.firstChild as HTMLElement;
    expect(separator).toHaveClass('h-1', 'w-32');
  });

  it('is centered horizontally', () => {
    const { container } = render(<Separator />);

    const separator = container.firstChild as HTMLElement;
    expect(separator).toHaveClass('mx-auto');
  });

  it('has vertical margins', () => {
    const { container } = render(<Separator />);

    const separator = container.firstChild as HTMLElement;
    expect(separator).toHaveClass('my-8');
  });

  it('renders with border styling', () => {
    const { container } = render(<Separator />);

    const separator = container.firstChild as HTMLElement;
    expect(separator).toHaveClass('border', 'border-b-stone-400');
  });

  it('renders without children', () => {
    const { container } = render(<Separator />);

    const separator = container.firstChild as HTMLElement;
    expect(separator).toBeEmptyDOMElement();
  });
});
