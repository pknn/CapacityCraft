import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import UserOverlay from './UserOverlay';
import { Day, DayTypes } from '../../types/Day';
import { ComponentProps } from 'react';
import Input from '../core/Input';
import { AppState } from '../../store';
import Button from '../core/Button';

// Mock dependencies
vi.mock('../../util/genId', () => ({
  genUserIdWithCache: vi.fn(() => 'test-user-id'),
}));

// Mock connected actions
const mockSetUser = vi.fn();
const mockAddMember = vi.fn();
const mockSyncUp = vi.fn(() => Promise.resolve());

vi.mock('../../store/userSlice', () => ({
  setUser: (payload: { id: string; displayName: string }) => {
    mockSetUser(payload.id, payload.displayName);
    return { type: 'user/setUser', payload };
  },
}));

vi.mock('../../store/membersSlice', () => ({
  addMember: (payload: { id: string; displayName: string; days: Day[] }) => {
    mockAddMember(payload.id, payload.displayName, payload.days);
    return { type: 'members/addMember', payload };
  },
}));

vi.mock('../../store/dataThunkActions', () => ({
  syncUp: () => {
    mockSyncUp();
    return { type: 'data/syncUp' };
  },
}));

// Mock room selector
vi.mock('../../store/roomSlice', () => ({
  roomSelector: {
    value: (state: AppState) => state.room,
  },
}));

// Mock child components
vi.mock('../core/Input', () => ({
  default: ({ value, onValueChange }: ComponentProps<typeof Input>) => (
    <input
      data-testid="name-input"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    />
  ),
}));

vi.mock('../core/Button', () => ({
  default: ({ children, onClick, disabled }: ComponentProps<typeof Button>) => (
    <button data-testid="submit-button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

describe('UserOverlay', () => {
  const mockDays = [{ date: '2024-01-01', dayType: DayTypes.FullDay }];

  const createStore = (initialState = {}) => {
    return configureStore({
      reducer: {
        user: (state = { displayName: undefined }) => state,
        room: (state = { id: 'test-room', days: mockDays }) => state,
        status: (state = { status: 'idle' }) => state,
      },
      preloadedState: initialState,
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderOverlay = (initialState = {}) => {
    const store = createStore(initialState);
    return {
      ...render(
        <Provider store={store}>
          <UserOverlay />
        </Provider>
      ),
      store,
    };
  };

  describe('visibility', () => {
    it('shows overlay when no display name is set', () => {
      renderOverlay();
      expect(
        screen.getByText('Let your friends know who you are')
      ).toBeInTheDocument();
    });

    it('hides overlay when display name exists', () => {
      renderOverlay({
        user: { displayName: 'Test User' },
      });
      expect(
        screen.queryByText('Let your friends know who you are')
      ).not.toBeInTheDocument();
    });
  });

  describe('form interaction', () => {
    it('handles name input', async () => {
      renderOverlay();
      const input = screen.getByTestId('name-input');

      await act(async () => {
        fireEvent.change(input, { target: { value: 'Test User' } });
      });

      expect(input).toHaveValue('Test User');
    });

    it('prevents submission with empty name', async () => {
      renderOverlay();
      const button = screen.getByTestId('submit-button');

      await act(async () => {
        await fireEvent.click(button);
      });

      expect(mockSetUser).not.toHaveBeenCalled();
      expect(mockAddMember).not.toHaveBeenCalled();
      expect(mockSyncUp).not.toHaveBeenCalled();
    });

    it('processes successful submission', async () => {
      renderOverlay();
      const input = screen.getByTestId('name-input');
      const button = screen.getByTestId('submit-button');

      await act(async () => {
        fireEvent.change(input, { target: { value: 'Test User' } });
      });

      await act(async () => {
        await fireEvent.click(button);
      });

      expect(mockSetUser).toHaveBeenCalledWith('test-user-id', 'Test User');
      expect(mockAddMember).toHaveBeenCalledWith(
        'test-user-id',
        'Test User',
        mockDays
      );
      expect(mockSyncUp).toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('disables submit button when loading', () => {
      renderOverlay({
        status: { status: 'loading' },
      });

      expect(screen.getByTestId('submit-button')).toBeDisabled();
    });

    it('enables submit button when not loading', () => {
      renderOverlay({
        status: { status: 'idle' },
      });

      expect(screen.getByTestId('submit-button')).not.toBeDisabled();
    });
  });
});
