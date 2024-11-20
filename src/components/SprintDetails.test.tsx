import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SprintDetails from './SprintDetails';
import { AppState } from '../store';

// Create mock action creators that return proper action objects
const mockSetBaselineVelocity = vi.fn((payload: number) => ({
  type: 'room/setBaselineVelocity',
  payload,
}));

const mockSetDaysLength = vi.fn(
  (payload: { newLength: number; startDate: string }) => ({
    type: 'room/setDaysLength',
    payload,
  })
);

const mockSetStartDate = vi.fn((payload: string) => ({
  type: 'room/setStartDate',
  payload,
}));

const mockSyncUp = vi.fn(() => ({
  type: 'data/syncUp',
}));

// Mock dependencies
vi.mock('../store/roomSlice', () => ({
  roomSelector: {
    value: (state: AppState) => state.room,
  },
  setBaselineVelocity: (payload: number) => mockSetBaselineVelocity(payload),
  setDaysLength: (payload: { newLength: number; startDate: string }) =>
    mockSetDaysLength(payload),
  setStartDate: (payload: string) => mockSetStartDate(payload),
}));

vi.mock('../store/dataThunkActions', () => ({
  syncUp: () => mockSyncUp(),
}));

vi.mock('./SprintSummary', () => ({
  default: () => <div data-testid="sprint-summary">Sprint Summary</div>,
}));

// Mock Input component
vi.mock('./core/Input', () => ({
  default: function MockInput<T extends string | number>({
    value,
    onValueChange,
    label,
    type,
    className = '',
  }: {
    value: T;
    onValueChange: (value: T) => void;
    label?: string;
    type: string;
    className?: string;
    name: string;
    placeholder: string;
    step?: number;
  }) {
    return (
      <div className={className}>
        {label && <label>{label}</label>}
        <input
          data-testid={`sprint-${label?.toLowerCase().replace(' ', '-')}`}
          type={type}
          value={value}
          onChange={(e) => {
            const val =
              type === 'number' ? Number(e.target.value) : e.target.value;
            onValueChange(val as T);
          }}
        />
      </div>
    );
  },
}));

describe('SprintDetails', () => {
  const mockState = {
    room: {
      days: Array(10).fill(null),
      startDate: '2024-01-01',
      baselineVelocity: 1.0,
    },
  };

  const renderComponent = () => {
    const store = configureStore({
      reducer: {
        room: (state = mockState.room) => state,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
          thunk: true,
        }),
    });

    return {
      ...render(
        <Provider store={store}>
          <SprintDetails />
        </Provider>
      ),
      store,
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('displays all inputs with initial values', () => {
      renderComponent();

      const startDateInput = screen.getByTestId('sprint-start-date');
      const lengthInput = screen.getByTestId('sprint-length');
      const velocityInput = screen.getByTestId('sprint-base-velocity');

      expect(startDateInput).toHaveValue('2024-01-01');
      expect(lengthInput).toHaveValue(10);
      expect(velocityInput).toHaveValue(1.0);
    });

    it('shows sprint summary', () => {
      renderComponent();
      expect(screen.getByTestId('sprint-summary')).toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('handles start date change', () => {
      renderComponent();
      const input = screen.getByTestId('sprint-start-date');

      fireEvent.change(input, { target: { value: '2024-02-01' } });

      expect(mockSetStartDate).toHaveBeenCalledWith('2024-02-01');
      expect(mockSyncUp).toHaveBeenCalled();
    });

    it('handles sprint length change', () => {
      renderComponent();
      const input = screen.getByTestId('sprint-length');

      fireEvent.change(input, { target: { value: '15' } });

      expect(mockSetDaysLength).toHaveBeenCalledWith({
        newLength: 15,
        startDate: '2024-01-01',
      });
      expect(mockSyncUp).toHaveBeenCalled();
    });

    it('prevents negative sprint length', () => {
      renderComponent();
      const input = screen.getByTestId('sprint-length');

      fireEvent.change(input, { target: { value: '-5' } });

      expect(mockSetDaysLength).toHaveBeenCalledWith({
        newLength: 0,
        startDate: '2024-01-01',
      });
      expect(mockSyncUp).toHaveBeenCalled();
    });

    it('handles baseline velocity change', () => {
      renderComponent();
      const input = screen.getByTestId('sprint-base-velocity');

      fireEvent.change(input, { target: { value: '1.5' } });

      expect(mockSetBaselineVelocity).toHaveBeenCalledWith(1.5);
      expect(mockSyncUp).toHaveBeenCalled();
    });
  });

  describe('layout', () => {
    it('applies correct container classes', () => {
      const { container } = renderComponent();

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass(
        'flex',
        'items-baseline',
        'justify-between',
        'gap-4'
      );
    });

    it('applies correct input container classes', () => {
      renderComponent();

      const lengthInput = screen.getByTestId('sprint-length').parentElement;
      const velocityInput = screen.getByTestId(
        'sprint-base-velocity'
      ).parentElement;
      const inputsContainer = lengthInput?.parentElement;

      expect(inputsContainer).toHaveClass('inline-flex', 'gap-4');
      expect(lengthInput).toHaveClass('max-w-16');
      expect(velocityInput).toHaveClass('max-w-20');
    });
  });
});
