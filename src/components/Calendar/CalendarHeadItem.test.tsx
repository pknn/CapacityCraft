import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CalendarHeadItem from './CalendarHeadItem';
import { Day, DayTypes } from '../../types/Day';
import formatDateStringForDisplay from '../../util/formatDateStringForDisplay';

// Mock the formatting utility
vi.mock('../../util/formatDateStringForDisplay', () => ({
  default: vi.fn(() => ({
    dayOfWeek: 'Mon',
    date: '15',
    month: 'Jan',
  })),
}));

describe('CalendarHeadItem', () => {
  const mockOnClick = vi.fn();
  const mockFormatDate = vi.mocked(formatDateStringForDisplay);

  const createDay = (
    dayType: (typeof DayTypes)[keyof typeof DayTypes]
  ): Day => ({
    date: '2024-01-15',
    dayType,
  });

  beforeEach(() => {
    mockOnClick.mockClear();
    mockFormatDate.mockClear();
  });

  describe('Working Day', () => {
    it('renders with correct working day styles', () => {
      const workingDay = createDay(DayTypes.FullDay);
      render(<CalendarHeadItem day={workingDay} onClick={mockOnClick} />);

      const header = screen.getByRole('columnheader');
      const [dayOfWeekDiv, dateDiv, monthDiv] = header.children;

      // Header styles
      expect(header).toHaveClass(
        'snap-start',
        'rounded',
        'text-center',
        'font-medium',
        'uppercase',
        'group',
        'cursor-pointer',
        'select-none'
      );

      // Day of week styles
      expect(dayOfWeekDiv).toHaveClass(
        'rounded-t',
        'px-4',
        'py-2',
        'font-medium',
        'uppercase',
        'bg-stone-300'
      );

      // Date styles
      expect(dateDiv).toHaveClass(
        'px-4',
        'py-2',
        'text-4xl',
        'font-bold',
        'bg-stone-100'
      );

      // Month styles
      expect(monthDiv).toHaveClass('px-4', 'py-2', 'bg-stone-300');
    });
  });

  describe('Weekend', () => {
    it('renders with correct weekend styles', () => {
      const weekendDay = createDay(DayTypes.Weekend);
      render(<CalendarHeadItem day={weekendDay} onClick={mockOnClick} />);

      const header = screen.getByRole('columnheader');
      const [dayOfWeekDiv, dateDiv, monthDiv] = header.children;

      // Header styles
      expect(header).toHaveClass('cursor-not-allowed', 'select-none');
      expect(header).not.toHaveClass('group', 'cursor-pointer');

      // Day of week styles
      expect(dayOfWeekDiv).toHaveClass('bg-stone-600', 'text-stone-400');

      // Date styles
      expect(dateDiv).toHaveClass('bg-stone-400', 'text-stone-300');

      // Month styles
      expect(monthDiv).toHaveClass('bg-stone-600', 'text-stone-400');
    });
  });

  describe('Holiday', () => {
    it('renders with correct holiday styles', () => {
      const holiday = createDay(DayTypes.Holiday);
      render(<CalendarHeadItem day={holiday} onClick={mockOnClick} />);

      const header = screen.getByRole('columnheader');
      const [dayOfWeekDiv, dateDiv, monthDiv] = header.children;

      expect(dayOfWeekDiv).toHaveClass('bg-stone-600', 'text-stone-400');
      expect(dateDiv).toHaveClass('bg-stone-400', 'text-stone-300');
      expect(monthDiv).toHaveClass('bg-stone-600', 'text-stone-400');
    });
  });

  describe('Interactions', () => {
    it('calls onClick when clicked', async () => {
      const workingDay = createDay(DayTypes.FullDay);
      render(<CalendarHeadItem day={workingDay} onClick={mockOnClick} />);

      await userEvent.click(screen.getByRole('columnheader'));
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick even for weekend/holiday days', async () => {
      const weekendDay = createDay(DayTypes.Weekend);
      render(<CalendarHeadItem day={weekendDay} onClick={mockOnClick} />);

      await userEvent.click(screen.getByRole('columnheader'));
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Content', () => {
    it('displays formatted date information correctly', () => {
      const workingDay = createDay(DayTypes.FullDay);
      render(<CalendarHeadItem day={workingDay} onClick={mockOnClick} />);

      expect(screen.getByText('Mon')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('Jan')).toBeInTheDocument();
    });
  });

  describe('Memo behavior', () => {
    it('uses memoized date formatting', () => {
      const workingDay = createDay(DayTypes.FullDay);
      const { rerender } = render(
        <CalendarHeadItem day={workingDay} onClick={mockOnClick} />
      );

      expect(mockFormatDate).toHaveBeenCalledTimes(1);

      // Rerender with same props
      rerender(<CalendarHeadItem day={workingDay} onClick={mockOnClick} />);

      // formatDateStringForDisplay should only be called once due to useMemo
      expect(mockFormatDate).toHaveBeenCalledTimes(1);
    });
  });
});
