import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SprintSummary from './SprintSummary';
import {
  selectCapacity,
  selectHolidays,
  selectTotalWorkingManDays,
} from '../../store/selectors/selectSprintSummary';
import { AppState } from '../../store';

// Mock selectors
vi.mock('../../store/selectors/selectSprintSummary', () => ({
  selectCapacity: vi.fn(),
  selectHolidays: vi.fn(),
  selectTotalWorkingManDays: vi.fn(),
}));

vi.mock('../../store/roomSlice', () => ({
  roomSelector: {
    value: (state: AppState) => state.room,
  },
}));

describe('SprintSummary', () => {
  const mockState = {
    room: {
      days: Array(10).fill(null),
    },
  };

  beforeEach(() => {
    vi.mocked(selectCapacity).mockReturnValue(20);
    vi.mocked(selectHolidays).mockReturnValue(2);
    vi.mocked(selectTotalWorkingManDays).mockReturnValue(8);
  });

  const renderWithStore = () => {
    const store = configureStore({
      reducer: {
        room: (state = mockState.room) => state,
      },
    });

    return render(
      <Provider store={store}>
        <SprintSummary />
      </Provider>
    );
  };

  describe('rendering', () => {
    it('displays the title', () => {
      renderWithStore();
      expect(screen.getByText('Sprint Summary')).toBeInTheDocument();
    });

    it('shows all summary rows with correct values', () => {
      renderWithStore();

      // Total Days
      expect(screen.getByText('Total Days')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();

      // Public Holidays
      expect(screen.getByText('Public Holidays')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();

      // Working Man-Days
      expect(screen.getByText('Total Working Man-Days')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();

      // Capacity
      expect(screen.getByText('Capacity')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('shows correct units', () => {
      renderWithStore();

      const dayUnits = screen.getAllByText('Days');
      expect(dayUnits).toHaveLength(3); // Total, Holidays, Working Man-Days

      expect(screen.getByText('SPs')).toBeInTheDocument(); // Capacity unit
    });
  });

  describe('styling', () => {
    it('applies container styles', () => {
      const { container } = renderWithStore();
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('my-8');
    });

    it('applies title styles', () => {
      renderWithStore();
      const title = screen.getByText('Sprint Summary');
      expect(title).toHaveClass('text-lg', 'font-bold');
    });

    it('applies table cell styles', () => {
      renderWithStore();

      // Headers
      const headers = screen.getAllByRole('columnheader');
      headers.forEach((header) => {
        expect(header).toHaveClass('text-left', 'font-medium');
        if (header.textContent !== 'Capacity') {
          expect(header).toHaveClass('pr-4');
        }
      });

      // Value cells
      const valueCells = screen
        .getAllByRole('cell')
        .filter((cell) => !isNaN(Number(cell.textContent)));
      valueCells.forEach((cell) => {
        expect(cell).toHaveClass('pr-4', 'text-right');
      });
    });
  });

  describe('selector integration', () => {
    it('uses correct selector values', () => {
      renderWithStore();

      expect(selectTotalWorkingManDays).toHaveBeenCalled();
      expect(selectHolidays).toHaveBeenCalled();
      expect(selectCapacity).toHaveBeenCalled();

      expect(screen.getByText('10')).toBeInTheDocument(); // Total days from room state
      expect(screen.getByText('8')).toBeInTheDocument(); // Working days from selector
      expect(screen.getByText('2')).toBeInTheDocument(); // Holidays from selector
      expect(screen.getByText('20')).toBeInTheDocument(); // Capacity from selector
    });

    it('handles zero values', () => {
      vi.mocked(selectCapacity).mockReturnValue(0);
      vi.mocked(selectHolidays).mockReturnValue(0);
      vi.mocked(selectTotalWorkingManDays).mockReturnValue(0);

      const store = configureStore({
        reducer: {
          room: () => ({ days: [] }),
        },
      });

      render(
        <Provider store={store}>
          <SprintSummary />
        </Provider>
      );

      // Check each row specifically
      const rows = screen.getAllByRole('row');

      // Total Days row
      expect(
        within(rows[0]).getByRole('cell', { name: '0' })
      ).toBeInTheDocument();

      // Public Holidays row
      expect(
        within(rows[1]).getByRole('cell', { name: '0' })
      ).toBeInTheDocument();

      // Working Man-Days row
      expect(
        within(rows[2]).getByRole('cell', { name: '0' })
      ).toBeInTheDocument();

      // Capacity row
      expect(
        within(rows[3]).getByRole('cell', { name: '0' })
      ).toBeInTheDocument();
    });
  });
});
