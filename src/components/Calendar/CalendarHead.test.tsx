import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import CalendarHead from './CalendarHead';
import { DayTypes, type Day } from '../../types/Day';
import { AppState } from '../../store';

// Mock the dependencies
vi.mock('./CalendarHeadItem', () => ({
  default: ({ day, onClick }: { day: Day; onClick: () => void }) => (
    <th data-testid="calendar-head-item" data-date={day.date} onClick={onClick}>
      {day.date}
    </th>
  ),
}));

// Mock the room selector
vi.mock('../../store/roomSlice', () => ({
  roomSelector: {
    value: (state: AppState) => state.room,
  },
  toggleGlobalOffDay: (index: number) => ({
    type: 'room/toggleGlobalOffDay',
    payload: index,
  }),
}));

// Mock the sync action
vi.mock('../../store/dataThunkActions', () => ({
  syncUp: () => ({ type: 'data/syncUp' }),
}));

describe('CalendarHead', () => {
  const mockInitialState = {
    room: {
      days: [
        { date: '2024-01-01', dayType: DayTypes.FullDay },
        { date: '2024-01-02', dayType: DayTypes.Weekend },
        { date: '2024-01-03', dayType: DayTypes.Holiday },
      ],
    },
  };

  const createStore = (initialState = mockInitialState) =>
    configureStore({
      reducer: {
        room: (state = initialState.room) => state,
      },
      preloadedState: initialState,
    });

  // Helper function to render component within a table
  const renderWithTable = (ui: React.ReactElement) => {
    return render(<table>{ui}</table>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with correct structure', () => {
    const store = createStore();
    const { container } = renderWithTable(
      <Provider store={store}>
        <CalendarHead />
      </Provider>
    );

    // Check basic structure
    const thead = container.querySelector('thead');
    expect(thead).toBeInTheDocument();

    const tr = thead?.querySelector('tr');
    expect(tr).toBeInTheDocument();

    // Check all cells are present
    const allColumnHeaders = screen.getAllByRole('columnheader');
    expect(allColumnHeaders).toHaveLength(
      mockInitialState.room.days.length + 1
    ); // +1 for empty cell

    // Check empty first cell
    const emptyCell = allColumnHeaders[0];
    expect(emptyCell).toHaveClass('w-auto', 'snap-start');
  });

  it('renders all day items with correct dates', () => {
    const store = createStore();
    renderWithTable(
      <Provider store={store}>
        <CalendarHead />
      </Provider>
    );

    const dayItems = screen.getAllByTestId('calendar-head-item');
    expect(dayItems).toHaveLength(mockInitialState.room.days.length);

    dayItems.forEach((item, index) => {
      expect(item).toHaveAttribute(
        'data-date',
        mockInitialState.room.days[index].date
      );
    });
  });

  it('handles day clicks correctly', async () => {
    const store = createStore();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    renderWithTable(
      <Provider store={store}>
        <CalendarHead />
      </Provider>
    );

    const dayItems = screen.getAllByTestId('calendar-head-item');
    await userEvent.click(dayItems[0]);

    // Check if both actions were dispatched
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'room/toggleGlobalOffDay',
      payload: 0,
    });
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'data/syncUp',
    });
  });

  describe('Redux integration', () => {
    it('connects to store and updates on state changes', () => {
      const store = createStore();
      renderWithTable(
        <Provider store={store}>
          <CalendarHead />
        </Provider>
      );

      const dayItems = screen.getAllByTestId('calendar-head-item');
      expect(dayItems).toHaveLength(mockInitialState.room.days.length);
    });

    it('dispatches actions in correct order', async () => {
      const store = createStore();
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      renderWithTable(
        <Provider store={store}>
          <CalendarHead />
        </Provider>
      );

      const dayItems = screen.getAllByTestId('calendar-head-item');
      await userEvent.click(dayItems[0]);

      const dispatchCalls = dispatchSpy.mock.calls;
      expect(dispatchCalls[0][0].type).toBe('room/toggleGlobalOffDay');
      expect(dispatchCalls[1][0].type).toBe('data/syncUp');
    });
  });
});
