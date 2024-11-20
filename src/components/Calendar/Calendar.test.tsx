import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Calendar from './Calendar';

// Mock child components
vi.mock('./CalendarHead', () => ({
  default: () => (
    <thead data-testid="calendar-head">
      <tr>
        <th>Calendar Head</th>
      </tr>
    </thead>
  ),
}));

vi.mock('./MemberCalendars', () => ({
  default: () => (
    <tbody data-testid="member-calendars">
      <tr>
        <td>Member Calendars</td>
      </tr>
    </tbody>
  ),
}));

// Mock initial state for Redux store
const mockInitialState = {
  room: {
    days: [],
    members: [],
  },
};

describe('Calendar', () => {
  const createStore = (initialState = mockInitialState) =>
    configureStore({
      reducer: {
        room: (state = initialState.room) => state,
      },
      preloadedState: initialState,
    });

  it('renders with correct structure and styles', () => {
    const store = createStore();
    const { container } = render(
      <Provider store={store}>
        <Calendar />
      </Provider>
    );

    // Check container styles
    const scrollContainer = container.firstChild as HTMLElement;
    expect(scrollContainer).toHaveClass('snap-x', 'overflow-x-scroll', 'pb-8');

    // Check table styles
    const table = container.querySelector('table');
    expect(table).toHaveClass('w-full');
  });

  it('renders both CalendarHead and MemberCalendars components', () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <Calendar />
      </Provider>
    );

    expect(screen.getByTestId('calendar-head')).toBeInTheDocument();
    expect(screen.getByTestId('member-calendars')).toBeInTheDocument();
  });

  it('maintains correct DOM hierarchy', () => {
    const store = createStore();
    const { container } = render(
      <Provider store={store}>
        <Calendar />
      </Provider>
    );

    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();

    // Check order of children
    const [thead, tbody] = table!.children;
    expect(thead).toHaveAttribute('data-testid', 'calendar-head');
    expect(tbody).toHaveAttribute('data-testid', 'member-calendars');
  });

  it('has proper HTML structure for accessibility', () => {
    const store = createStore();
    const { container } = render(
      <Provider store={store}>
        <Calendar />
      </Provider>
    );

    // Check proper nesting
    expect(container.querySelector('div > table')).toBeInTheDocument();
    expect(container.querySelector('table > thead')).toBeInTheDocument();
    expect(container.querySelector('table > tbody')).toBeInTheDocument();
  });
});
