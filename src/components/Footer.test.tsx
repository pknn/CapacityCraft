import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders copyright notice with current year', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2024 Capacity Craft/)).toBeInTheDocument();
  });

  it('renders GitHub link with correct attributes', () => {
    render(<Footer />);

    const githubLink = screen.getByText('GitHub');
    expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/pknn/CapacityCraft'
    );
    expect(githubLink).toHaveClass('underline');
  });

  it('renders issue reporting link with correct attributes', () => {
    render(<Footer />);

    const issueLink = screen.getByText('Report issue');
    expect(issueLink).toHaveAttribute(
      'href',
      'https://github.com/pknn/CapacityCraft/issues/new'
    );
    expect(issueLink).toHaveClass('underline');
  });

  it('applies correct styling to footer element', () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector('footer');
    expect(footer).toHaveClass(
      'py-4',
      'text-center',
      'text-sm',
      'text-stone-500'
    );
  });

  it('maintains correct text content and spacing', () => {
    render(<Footer />);

    const contributionText = screen.getByText((_, element) => {
      return (
        element?.textContent ===
        'Contribute to this project on GitHub or Report issue'
      );
    });
    expect(contributionText).toBeInTheDocument();
  });

  describe('Links accessibility', () => {
    it('has accessible links', () => {
      render(<Footer />);

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link).toHaveClass('underline');
        expect(link).toHaveAttribute('href');
      });
    });

    it('provides clear link purposes', () => {
      render(<Footer />);

      const githubLink = screen.getByText('GitHub');
      const issueLink = screen.getByText('Report issue');

      expect(githubLink).toBeVisible();
      expect(issueLink).toBeVisible();
    });
  });

  describe('Layout and structure', () => {
    it('renders in correct DOM hierarchy', () => {
      const { container } = render(<Footer />);

      const footer = container.firstChild;
      expect(footer?.nodeName).toBe('FOOTER');
      expect(footer?.childNodes).toHaveLength(2);
    });

    it('maintains text alignment', () => {
      const { container } = render(<Footer />);

      const footer = container.firstChild as HTMLElement;
      expect(footer).toHaveClass('text-center');
    });
  });

  describe('Visual styling', () => {
    it('applies consistent text styling', () => {
      const { container } = render(<Footer />);

      const footer = container.firstChild as HTMLElement;
      expect(footer).toHaveClass('text-sm', 'text-stone-500');
    });

    it('maintains vertical spacing', () => {
      const { container } = render(<Footer />);

      const footer = container.firstChild as HTMLElement;
      expect(footer).toHaveClass('py-4');
    });
  });

  describe('Content integrity', () => {
    it('displays complete copyright notice', () => {
      render(<Footer />);

      const currentYear = new Date().getFullYear();
      expect(
        screen.getByText(`© ${currentYear} Capacity Craft`)
      ).toBeInTheDocument();
    });

    it('maintains link text consistency', () => {
      render(<Footer />);

      const links = screen.getAllByRole('link');
      expect(links[0]).toHaveTextContent('GitHub');
      expect(links[1]).toHaveTextContent('Report issue');
    });
  });
});
