import { describe, it, expect, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CalendarHeadItem from './CalendarHeadItem';
import { Day, DayTypes } from '../../types/Day';

vi.mock('../../util/formatDateStringForDisplay', () => ({
  default: () => ({
    dayOfWeek: 'Mon',
    date: '1',
    month: 'Jan',
  }),
}));

const TestTableWrapper = ({ children }: { children: React.ReactNode }) => (
  <table>
    <thead>
      <tr>{children}</tr>
    </thead>
  </table>
);

describe('CalendarHeadItem', () => {
  const defaultDay: Day = {
    date: '2024-01-01',
    dayType: DayTypes.FullDay,
  };

  const weekendDay: Day = {
    date: '2024-01-01',
    dayType: DayTypes.Weekend,
  };

  const holidayDay: Day = {
    date: '2024-01-01',
    dayType: DayTypes.Holiday,
  };

  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const renderWithTable = (day: Day = defaultDay) => {
    cleanup(); // Ensure cleanup before each render
    return render(
      <TestTableWrapper>
        <CalendarHeadItem day={day} onClick={mockOnClick} />
      </TestTableWrapper>
    );
  };

  describe('day types', () => {
    it('handles working day', async () => {
      renderWithTable(defaultDay);
      const header = screen.getByRole('columnheader');

      expect(header.className).toContain('cursor-pointer');
      expect(header.className).toContain('group');

      await userEvent.click(header);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('handles weekend day', async () => {
      renderWithTable(weekendDay);
      const header = screen.getByRole('columnheader');

      expect(header.className).toContain('cursor-not-allowed');
      expect(header.className).not.toContain('group');

      await userEvent.click(header);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('handles holiday', async () => {
      renderWithTable(holidayDay);
      const header = screen.getByRole('columnheader');

      await userEvent.click(header);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('styles', () => {
    it('applies working day colors', () => {
      renderWithTable(defaultDay);
      const [dayOfWeek, date, month] = Array.from(
        screen.getByRole('columnheader').children
      );

      expect(dayOfWeek.className).toContain('bg-stone-300');
      expect(date.className).toContain('bg-stone-100');
      expect(month.className).toContain('bg-stone-300');
    });

    it('applies off day colors', () => {
      renderWithTable(holidayDay);
      const [dayOfWeek, date, month] = Array.from(
        screen.getByRole('columnheader').children
      );

      expect(dayOfWeek.className).toContain('bg-stone-600');
      expect(date.className).toContain('bg-stone-400');
      expect(month.className).toContain('bg-stone-600');
    });
  });

  describe('content', () => {
    it('displays formatted date', () => {
      renderWithTable(defaultDay);

      expect(screen.getByText('Mon')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('Jan')).toBeInTheDocument();
    });
  });

  describe('hover states', () => {
    it('has working day hover styles', () => {
      renderWithTable(defaultDay);
      const [dayOfWeek, date, month] = Array.from(
        screen.getByRole('columnheader').children
      );

      expect(dayOfWeek.className).toContain('group-hover:bg-stone-400');
      expect(date.className).toContain('group-hover:bg-stone-200');
      expect(month.className).toContain('group-hover:bg-stone-400');
    });

    it('has off day hover styles', () => {
      renderWithTable(holidayDay);
      const [dayOfWeek, date, month] = Array.from(
        screen.getByRole('columnheader').children
      );

      expect(dayOfWeek.className).toContain('group-hover:bg-stone-700');
      expect(date.className).toContain('group-hover:bg-stone-500');
      expect(month.className).toContain('group-hover:bg-stone-700');
    });
  });
});
