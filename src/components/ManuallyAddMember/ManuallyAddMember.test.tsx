import { describe, it, expect, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ManuallyAddMember from './ManuallyAddMember';
import { DayTypes, type Day } from '../../types/Day';
import { addMember } from '../../store/membersSlice';
import { syncUp } from '../../store/dataThunkActions';
import type { ChangeEvent } from 'react';

// Mock core components
vi.mock('./core/Input', () => ({
  default: function MockInput<T extends string | number>({
    value,
    onValueChange,
    placeholder,
  }: {
    value: T;
    onValueChange: (value: T) => void;
    placeholder: string;
    name: string;
    type: string;
  }) {
    return (
      <input
        data-testid="manual-member-input"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onValueChange(e.target.value as T)
        }
        placeholder={placeholder}
      />
    );
  },
}));

vi.mock('./core/Button', () => ({
  default: function MockButton({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) {
    return (
      <button data-testid="manual-member-button" onClick={onClick}>
        {children}
      </button>
    );
  },
}));

// Mock genId
vi.mock('../../util/genId', () => ({
  genId: vi.fn(() => 'test-id-123'),
}));

// Mock the room selector
vi.mock('../../store/roomSlice', () => ({
  roomSelector: {
    value: (state: { room: { days: Day[] } }) => state.room,
  },
}));

// Mock actions
vi.mock('../../store/membersSlice', () => ({
  addMember: vi.fn((payload) => ({ type: 'members/addMember', payload })),
}));

vi.mock('../../store/dataThunkActions', () => ({
  syncUp: vi.fn(() => ({ type: 'data/syncUp' })),
}));

describe('ManuallyAddMember', () => {
  const mockDays: Day[] = [
    { date: '2024-01-01', dayType: DayTypes.FullDay },
    { date: '2024-01-02', dayType: DayTypes.FullDay },
  ];

  const createTestStore = () =>
    configureStore({
      reducer: {
        room: (state = { days: mockDays }) => state,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
    });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const renderWithStore = () => {
    const store = createTestStore();
    return {
      ...render(
        <Provider store={store}>
          <ManuallyAddMember />
        </Provider>
      ),
      store,
    };
  };

  describe('rendering', () => {
    it('displays title correctly', () => {
      renderWithStore();
      expect(screen.getByText('Away But Counted ⭐')).toBeInTheDocument();
    });

    it('renders input and button', () => {
      renderWithStore();
      expect(screen.getByTestId('manual-member-input')).toBeInTheDocument();
      expect(screen.getByTestId('manual-member-button')).toBeInTheDocument();
      expect(screen.getByText('Include!')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('allows typing in the input', async () => {
      renderWithStore();
      const input = screen.getByTestId('manual-member-input');
      await userEvent.type(input, 'John');
      expect(input).toHaveValue('John');
    });

    it('handles member addition', async () => {
      renderWithStore();
      const mockAddMember = vi.mocked(addMember);
      const mockSyncUp = vi.mocked(syncUp);

      const input = screen.getByTestId('manual-member-input');
      await userEvent.type(input, 'John');

      const button = screen.getByTestId('manual-member-button');
      await userEvent.click(button);

      expect(mockAddMember).toHaveBeenCalledWith({
        id: 'test-id-123',
        displayName: 'John',
        days: mockDays,
        isManual: true,
      });
      expect(mockSyncUp).toHaveBeenCalled();
    });

    it('prevents adding member with empty name', async () => {
      renderWithStore();
      const mockAddMember = vi.mocked(addMember);

      await userEvent.click(screen.getByTestId('manual-member-button'));

      expect(mockAddMember).not.toHaveBeenCalled();
    });
  });

  describe('styling', () => {
    it('applies correct title styling', () => {
      renderWithStore();
      const title = screen.getByText('Away But Counted ⭐');
      expect(title).toHaveClass('text-lg', 'font-bold');
    });

    it('maintains layout structure', () => {
      renderWithStore();
      const container = screen
        .getByTestId('manual-member-input')
        .closest('.flex');
      expect(container).toHaveClass('flex', 'items-center', 'gap-2');
    });
  });
});
