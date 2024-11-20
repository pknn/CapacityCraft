import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import MemberCalendar from './MemberCalendar';
import { DayTypes, type Day } from '../../../types/Day';
import { type Member } from '../../../types/Member';
import { AppState } from '../../../store';

// Mock child components
vi.mock('./MemberCalendarHeadItem', () => ({
  default: ({ member, onRemove }: { member: Member; onRemove: () => void }) => (
    <td
      data-testid="member-head"
      data-member-id={member.id}
      data-display-name={member.displayName}
      data-is-manual={member.isManual}
      onClick={onRemove}
    >
      {member.displayName || member.id}
    </td>
  ),
}));

vi.mock('./MemberCalendarItem', () => ({
  default: ({
    globalDay,
    memberDay,
    onClick,
  }: {
    globalDay: Day;
    memberDay: Day;
    onClick: () => void;
  }) => (
    <td
      data-testid="member-day"
      data-date={memberDay.date}
      data-global-type={globalDay.dayType}
      data-member-type={memberDay.dayType}
      onClick={onClick}
    />
  ),
}));

// Mock store slices and actions
vi.mock('../../../store/roomSlice', () => ({
  roomSelector: {
    value: (state: AppState) => state.room,
  },
}));

vi.mock('../../../store/dataThunkActions', () => ({
  syncUp: () => ({ type: 'data/syncUp' }),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <table>
    <tbody>{children}</tbody>
  </table>
);

describe('MemberCalendar', () => {
  const mockMember: Member = {
    id: 'member1',
    displayName: 'John Doe',
    days: [
      { date: '2024-01-01', dayType: DayTypes.FullDay },
      { date: '2024-01-02', dayType: DayTypes.HalfDay },
      { date: '2024-01-03', dayType: DayTypes.Holiday },
    ],
    isManual: false,
  };

  const mockManualMember: Member = {
    ...mockMember,
    id: 'manual1',
    displayName: undefined,
    isManual: true,
  };

  const mockGlobalDays: Day[] = [
    { date: '2024-01-01', dayType: DayTypes.FullDay },
    { date: '2024-01-02', dayType: DayTypes.Weekend },
    { date: '2024-01-03', dayType: DayTypes.Holiday },
  ];

  const mockInitialState = {
    room: {
      days: mockGlobalDays,
    },
  };

  const createStore = (initialState = mockInitialState) =>
    configureStore({
      reducer: {
        room: (state = initialState.room) => state,
      },
      preloadedState: initialState,
    });

  const renderWithProviders = (ui: React.ReactElement) => {
    const store = createStore();
    return render(
      <Provider store={store}>
        <TestWrapper>{ui}</TestWrapper>
      </Provider>
    );
  };

  it('renders member calendar with correct structure', () => {
    renderWithProviders(<MemberCalendar member={mockMember} />);

    const memberHead = screen.getByTestId('member-head');
    expect(memberHead).toHaveAttribute('data-member-id', mockMember.id);
    expect(memberHead).toHaveAttribute(
      'data-display-name',
      mockMember.displayName
    );
    expect(memberHead).toHaveAttribute(
      'data-is-manual',
      String(mockMember.isManual)
    );

    const dayItems = screen.getAllByTestId('member-day');
    expect(dayItems).toHaveLength(mockMember.days.length);
  });

  it('handles manual members correctly', () => {
    renderWithProviders(<MemberCalendar member={mockManualMember} />);

    const memberHead = screen.getByTestId('member-head');
    expect(memberHead).toHaveAttribute('data-member-id', mockManualMember.id);
    expect(memberHead).toHaveAttribute('data-is-manual', 'true');
    expect(memberHead.textContent).toBe(mockManualMember.id);
  });

  it('renders correct day types for each cell', () => {
    renderWithProviders(<MemberCalendar member={mockMember} />);

    const dayItems = screen.getAllByTestId('member-day');
    dayItems.forEach((item, index) => {
      expect(item).toHaveAttribute('data-date', mockMember.days[index].date);
      expect(item).toHaveAttribute(
        'data-global-type',
        mockGlobalDays[index].dayType
      );
      expect(item).toHaveAttribute(
        'data-member-type',
        mockMember.days[index].dayType
      );
    });
  });

  it('handles day click correctly', async () => {
    const store = createStore();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <TestWrapper>
          <MemberCalendar member={mockMember} />
        </TestWrapper>
      </Provider>
    );

    const firstDay = screen.getAllByTestId('member-day')[0];
    await userEvent.click(firstDay);

    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'members/cyclePersonalDayType',
      payload: { id: mockMember.id, dayIndex: 0 },
    });
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'data/syncUp',
    });
  });

  it('handles member removal correctly', async () => {
    const store = createStore();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <TestWrapper>
          <MemberCalendar member={mockMember} />
        </TestWrapper>
      </Provider>
    );

    const memberHead = screen.getByTestId('member-head');
    await userEvent.click(memberHead);

    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'members/removeMember',
      payload: mockMember.id,
    });
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'data/syncUp',
    });
  });

  it('memoizes zipped days correctly', () => {
    const store = createStore();
    const { rerender } = render(
      <Provider store={store}>
        <TestWrapper>
          <MemberCalendar member={mockMember} />
        </TestWrapper>
      </Provider>
    );

    const initialDayItems = screen.getAllByTestId('member-day');

    rerender(
      <Provider store={store}>
        <TestWrapper>
          <MemberCalendar member={mockMember} />
        </TestWrapper>
      </Provider>
    );

    const rerenderDayItems = screen.getAllByTestId('member-day');
    expect(rerenderDayItems).toHaveLength(initialDayItems.length);
  });
});
