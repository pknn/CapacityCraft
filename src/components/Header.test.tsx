import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Header from './Header';
import pushToClipboard from '../util/pushToClipboard';
import { AppState } from '../store';

// Mock the clipboard utility
vi.mock('../util/pushToClipboard', () => ({
  default: vi.fn(),
}));

// Mock Logo component
vi.mock('./Logo', () => ({
  default: () => <div data-testid="logo">Logo</div>,
}));

// Mock room selector
vi.mock('../store/roomSlice', () => ({
  roomSelector: {
    value: (state: AppState) => state.room,
  },
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createStore = (initialState = {}) =>
    configureStore({
      reducer: {
        room: (state = { id: undefined }) => state,
        user: (state = { displayName: undefined }) => state,
      },
      preloadedState: initialState,
    });

  const renderWithProviders = (initialState = {}) => {
    const store = createStore(initialState);
    return render(
      <Provider store={store}>
        <Header />
      </Provider>
    );
  };

  it('renders logo', () => {
    renderWithProviders();
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  describe('Room ID section', () => {
    it('shows room ID when available', () => {
      renderWithProviders({
        room: { id: 'test-room' },
      });

      expect(screen.getByText('#test-room')).toBeInTheDocument();
    });

    it('hides room ID when not available', () => {
      renderWithProviders({
        room: { id: undefined },
      });

      expect(screen.queryByText(/#.*/)).not.toBeInTheDocument();
    });

    it('copies link to clipboard on room ID click', async () => {
      const mockPushToClipboard = vi.mocked(pushToClipboard);
      renderWithProviders({
        room: { id: 'test-room' },
      });

      const roomId = screen.getByText('#test-room');
      await act(async () => {
        roomId.click();
      });

      expect(mockPushToClipboard).toHaveBeenCalledWith(window.location.href);
    });

    it('shows and hides copy message on room ID click', async () => {
      renderWithProviders({
        room: { id: 'test-room' },
      });

      // Initial state check
      const tooltip = screen.getByText('Copy link to clipboard');
      expect(tooltip).toBeInTheDocument();

      // Click and check updated message
      const roomId = screen.getByText('#test-room');
      await act(async () => {
        roomId.click();
      });

      expect(
        screen.queryByText('Copy link to clipboard')
      ).not.toBeInTheDocument();
      expect(
        screen.getByText((content) => content.includes('Room Link Copied!'))
      ).toBeInTheDocument();

      // Advance timer and check reset
      await act(async () => {
        vi.advanceTimersByTime(3000);
      });

      expect(
        screen.queryByText((content) => content.includes('Room Link Copied!'))
      ).not.toBeInTheDocument();
      expect(screen.getByText('Copy link to clipboard')).toBeInTheDocument();
    });
  });

  describe('User section', () => {
    it('shows display name when available', () => {
      renderWithProviders({
        user: { displayName: 'John Doe' },
      });

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('hides user section when no display name', () => {
      renderWithProviders({
        user: { displayName: undefined },
      });

      expect(screen.queryByText('Leave')).not.toBeInTheDocument();
    });

    it('navigates to home on leave click', async () => {
      renderWithProviders({
        user: { displayName: 'John Doe' },
      });

      const leaveButton = screen.getByText('Leave');
      await act(async () => {
        leaveButton.click();
      });

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Styling', () => {
    it('applies correct container styles', () => {
      const { container } = renderWithProviders();

      const header = container.firstChild as HTMLElement;
      expect(header).toHaveClass(
        'container',
        'mx-auto',
        'flex',
        'max-w-screen-lg',
        'items-center',
        'justify-between',
        'py-4'
      );
    });

    it('applies correct room ID styles', () => {
      renderWithProviders({
        room: { id: 'test-room' },
      });

      const roomId = screen.getByText('#test-room');
      expect(roomId).toHaveClass(
        'relative',
        'cursor-pointer',
        'text-stone-400'
      );
    });

    it('applies correct leave button styles', () => {
      renderWithProviders({
        user: { displayName: 'John Doe' },
      });

      const leaveButton = screen.getByText('Leave');
      expect(leaveButton).toHaveClass(
        'cursor-pointer',
        'text-xs',
        'text-stone-400',
        'underline'
      );
    });
  });

  describe('Interactions', () => {
    it('handles room ID click and message cycle', async () => {
      renderWithProviders({
        room: { id: 'test-room' },
      });

      // Initial state
      expect(screen.getByText('Copy link to clipboard')).toBeInTheDocument();

      // Click
      const roomId = screen.getByText('#test-room');
      await act(async () => {
        roomId.click();
      });

      expect(
        screen.getByText((content) => content.includes('Room Link Copied!'))
      ).toBeInTheDocument();

      // Timer
      await act(async () => {
        vi.advanceTimersByTime(3000);
      });

      expect(screen.getByText('Copy link to clipboard')).toBeInTheDocument();
    });

    it('maintains tooltip visibility classes', () => {
      renderWithProviders({
        room: { id: 'test-room' },
      });

      const container = screen.getByText('#test-room').parentElement;
      expect(container).toHaveClass('group');

      const tooltip = screen.getByText('Copy link to clipboard');
      expect(tooltip).toHaveClass('opacity-0', 'group-hover:opacity-100');
    });
  });
});
