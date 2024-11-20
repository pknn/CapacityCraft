import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import MemberCalendarHeadItem from './MemberCalendarHeadItem';
import type { Member } from '../../../types/Member';
import type { AppState } from '../../../store';

describe('MemberCalendarHeadItem', () => {
  const mockMember: Member = {
    id: 'member1',
    displayName: 'John Doe',
    days: [],
    isManual: false,
  };

  const createStore = (userId: string | undefined = 'currentUser') => {
    const initialState: Pick<AppState, 'user'> = {
      user: { id: userId, displayName: '' },
    };

    return configureStore({
      reducer: {
        user: (state = initialState.user) => state,
      },
      preloadedState: initialState,
    });
  };

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <table>
      <tbody>
        <tr>{children}</tr>
      </tbody>
    </table>
  );

  const renderWithProviders = (
    ui: React.ReactElement,
    { userId = 'currentUser' } = {}
  ) => {
    const store = createStore(userId);
    return render(
      <Provider store={store}>
        <TestWrapper>{ui}</TestWrapper>
      </Provider>
    );
  };

  it('renders member display name', () => {
    const onRemove = vi.fn();
    renderWithProviders(
      <MemberCalendarHeadItem member={mockMember} onRemove={onRemove} />
    );

    expect(screen.getByText(mockMember.displayName!)).toBeInTheDocument();
  });

  it('shows "It\'s you" on hover for current user', async () => {
    const onRemove = vi.fn();
    renderWithProviders(
      <MemberCalendarHeadItem
        member={{ ...mockMember, id: 'currentUser' }}
        onRemove={onRemove}
      />
    );

    const cell = screen.getByRole('cell');
    await userEvent.hover(cell);

    expect(screen.getByText("It's you")).toBeInTheDocument();
  });

  it('shows "Remove" on hover for other members', async () => {
    const onRemove = vi.fn();
    renderWithProviders(
      <MemberCalendarHeadItem member={mockMember} onRemove={onRemove} />
    );

    const cell = screen.getByRole('cell');
    await userEvent.hover(cell);

    expect(screen.getByText('Remove')).toBeInTheDocument();
  });

  it('prevents removal of current user', async () => {
    const onRemove = vi.fn();
    renderWithProviders(
      <MemberCalendarHeadItem
        member={{ ...mockMember, id: 'currentUser' }}
        onRemove={onRemove}
      />
    );

    const cell = screen.getByRole('cell');
    await userEvent.click(cell);

    expect(onRemove).not.toHaveBeenCalled();
  });

  it('allows removal of other members', async () => {
    const onRemove = vi.fn();
    renderWithProviders(
      <MemberCalendarHeadItem member={mockMember} onRemove={onRemove} />
    );

    const cell = screen.getByRole('cell');
    await userEvent.click(cell);

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('handles null user ID', () => {
    const onRemove = vi.fn();
    renderWithProviders(
      <MemberCalendarHeadItem member={mockMember} onRemove={onRemove} />,
      { userId: undefined }
    );

    expect(screen.getByText(mockMember.displayName!)).toBeInTheDocument();
  });

  it('applies correct styles', () => {
    const onRemove = vi.fn();
    renderWithProviders(
      <MemberCalendarHeadItem member={mockMember} onRemove={onRemove} />
    );

    const cell = screen.getByRole('cell');
    expect(cell).toHaveClass(
      'group',
      'relative',
      'w-fit',
      'min-w-24',
      'cursor-pointer',
      'overflow-visible',
      'p-2'
    );

    const displayName = screen.getByText(mockMember.displayName!);
    expect(displayName).toHaveClass(
      'absolute',
      'opacity-100',
      'transition-opacity',
      'duration-500'
    );

    const action = screen.getByText('Remove');
    expect(action).toHaveClass(
      'invisible',
      'text-sm',
      'text-stone-500',
      'underline',
      'opacity-0',
      'transition-opacity',
      'duration-500'
    );
  });

  it('handles undefined display name', () => {
    const onRemove = vi.fn();
    const memberWithoutName: Member = {
      ...mockMember,
      displayName: undefined,
    };

    renderWithProviders(
      <MemberCalendarHeadItem member={memberWithoutName} onRemove={onRemove} />
    );

    // Using the correct assertion method
    const cell = screen.getByRole('cell');
    expect(cell).not.toBeEmptyDOMElement();
  });
});
