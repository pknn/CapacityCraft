import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MemberCalendars from './MemberCalendars';
import type { Member } from '../../types/Member';
import { DayTypes } from '../../types/Day';
import type { UndoableEntityState } from '../../store/utils/createUndoableEntityAdapter';

// Mock the MemberCalendar component
vi.mock('./MemberCalendar', () => ({
  default: ({ member }: { member: Member }) => (
    <tr data-testid={`member-calendar-${member.id}`} data-member-id={member.id}>
      <td>{member.displayName || member.id}</td>
    </tr>
  ),
}));

describe('MemberCalendars', () => {
  const mockMembers: Member[] = [
    {
      id: 'member1',
      displayName: 'John Doe',
      days: [{ date: '2024-01-01', dayType: DayTypes.FullDay }],
      isManual: false,
    },
    {
      id: 'member2',
      displayName: 'Jane Smith',
      days: [{ date: '2024-01-01', dayType: DayTypes.HalfDay }],
      isManual: false,
    },
  ];

  // Create initial state with undoable entity structure
  const createInitialState = (
    members: Member[] = []
  ): { members: UndoableEntityState<Member, string> } => ({
    members: {
      current: {
        ids: members.map((m) => m.id),
        entities: members.reduce(
          (acc, member) => ({
            ...acc,
            [member.id]: member,
          }),
          {}
        ),
      },
      previous: undefined,
    },
  });

  const createStore = (initialMembers: Member[] = mockMembers) => {
    return configureStore({
      reducer: {
        members: (state = createInitialState(initialMembers).members) => state,
      },
      preloadedState: createInitialState(initialMembers),
    });
  };

  const renderWithProviders = (members: Member[] = mockMembers) => {
    const store = createStore(members);
    return render(
      <Provider store={store}>
        <table>
          <MemberCalendars />
        </table>
      </Provider>
    );
  };

  it('renders all members from current state', () => {
    renderWithProviders();

    mockMembers.forEach((member) => {
      const calendar = screen.getByTestId(`member-calendar-${member.id}`);
      expect(calendar).toBeInTheDocument();
      expect(calendar).toHaveAttribute('data-member-id', member.id);
    });
  });

  it('renders empty tbody when no members in current state', () => {
    renderWithProviders([]);

    const tbody = screen.getByRole('rowgroup');
    expect(tbody).toBeEmptyDOMElement();
  });

  it('maintains correct order of members from current state', () => {
    renderWithProviders();

    const tbody = screen.getByRole('rowgroup');
    const rows = tbody.children;

    expect(rows).toHaveLength(mockMembers.length);
    Array.from(rows).forEach((row, index) => {
      expect(row).toHaveAttribute('data-member-id', mockMembers[index].id);
    });
  });

  it('handles members without display names in current state', () => {
    const membersWithoutNames = mockMembers.map((member) => ({
      ...member,
      displayName: undefined,
    }));

    renderWithProviders(membersWithoutNames);

    membersWithoutNames.forEach((member) => {
      const calendar = screen.getByTestId(`member-calendar-${member.id}`);
      expect(calendar).toBeInTheDocument();
    });
  });

  describe('Redux integration with undoable state', () => {
    it('connects to store and receives members from current state', () => {
      const store = createStore();
      render(
        <Provider store={store}>
          <table>
            <MemberCalendars />
          </table>
        </Provider>
      );

      const state = store.getState();
      expect(state.members.current.ids).toHaveLength(mockMembers.length);

      mockMembers.forEach((member) => {
        const calendar = screen.getByTestId(`member-calendar-${member.id}`);
        expect(calendar).toBeInTheDocument();
      });
    });

    it('ignores previous state in rendering', () => {
      const previousMembers = [mockMembers[0]];
      const currentMembers = [mockMembers[1]];

      const store = configureStore({
        reducer: {
          members: (
            state = {
              current: {
                ids: currentMembers.map((m) => m.id),
                entities: currentMembers.reduce(
                  (acc, member) => ({
                    ...acc,
                    [member.id]: member,
                  }),
                  {}
                ),
              },
              previous: {
                ids: previousMembers.map((m) => m.id),
                entities: previousMembers.reduce(
                  (acc, member) => ({
                    ...acc,
                    [member.id]: member,
                  }),
                  {}
                ),
              },
            }
          ) => state,
        },
      });

      render(
        <Provider store={store}>
          <table>
            <MemberCalendars />
          </table>
        </Provider>
      );

      // Should only render current state members
      expect(
        screen.queryByTestId(`member-calendar-${previousMembers[0].id}`)
      ).not.toBeInTheDocument();
      expect(
        screen.getByTestId(`member-calendar-${currentMembers[0].id}`)
      ).toBeInTheDocument();
    });
  });
});
