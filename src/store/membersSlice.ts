import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Member } from '../types/Member';
import { generateDays, getUpdatedDays } from '../util/dayGenerator';
import { setDaysLength, setStartDate, toggleGlobalOffDay } from './roomSlice';
import { AppState } from '.';
import createUndoableEntityAdapter, {
  UndoableEntityState,
} from './utils/createUndoableEntityAdapter';
import { syncDown, syncUp } from './dataThunkActions';
import { cybleMemberDayType, Day, toggleMemberOffDayType } from '../types/Day';
import { toast } from 'react-toastify';

const memberAdapter = createUndoableEntityAdapter<Member, Member['id']>({
  selectId: (member: Member) => member.id,
});

const updateAllMemberDays = (
  state: UndoableEntityState<Member, Member['id']>,
  updateFn: (days: Day[]) => Day[]
) => {
  memberAdapter.updateMany(
    state,
    state.current.ids.map((id) => ({
      id,
      changes: { days: updateFn(state.current.entities[id].days) },
    }))
  );
};

const toggleDayOffAtIndex = (days: Day[], index: number): Day[] =>
  days.map((day, i) =>
    i === index ? { ...day, dayType: toggleMemberOffDayType(day.dayType) } : day
  );

const cycleDayTypeAtIndex = (days: Day[], index: number): Day[] =>
  days.map((day, i) =>
    i === index ? { ...day, dayType: cybleMemberDayType(day.dayType) } : day
  );

const getMemberDiff = (l1: Member[], l2: Member[]) => {
  if (l1.length === 0) return [];

  const l1Ids = new Set(l1.map((member) => member.id));
  return l2.filter((member) => !l1Ids.has(member.id));
};

const membersSlice = createSlice({
  name: 'members',
  initialState: memberAdapter.getInitialState(),
  reducers: {
    addMember: (
      state,
      action: PayloadAction<{
        id: string;
        displayName: string;
        days: Day[];
      }>
    ) => {
      const { id, displayName, days } = action.payload;
      memberAdapter.upsertOne(state, {
        id,
        displayName,
        days,
      });
    },
    cyclePersonalDayType: (
      state,
      action: PayloadAction<{ id: string; dayIndex: number }>
    ) => {
      const { id, dayIndex } = action.payload;

      memberAdapter.updateOne(state, {
        id,
        changes: {
          days: cycleDayTypeAtIndex(state.current.entities[id].days, dayIndex),
        },
      });
    },
    removeMember: (state, action: PayloadAction<string>) => {
      memberAdapter.removeOne(state, action.payload);
    },
    clearMember: (state) => memberAdapter.removeAll(state),
  },
  extraReducers: (builder) => {
    builder
      .addCase(setDaysLength, (state, action) => {
        const { newLength, startDate } = action.payload;

        updateAllMemberDays(state, (days) =>
          generateDays(startDate, days, newLength)
        );
      })
      .addCase(setStartDate, (state, action) => {
        updateAllMemberDays(state, (days) =>
          getUpdatedDays(days, action.payload)
        );
      })
      .addCase(toggleGlobalOffDay, (state, action) => {
        const dayIndex = action.payload;
        updateAllMemberDays(state, (days) =>
          toggleDayOffAtIndex(days, dayIndex)
        );
      })
      .addCase(syncDown.fulfilled, (state, action) => {
        const room = action.payload;
        const diff = getMemberDiff(
          Object.values(state.current.entities),
          room.members
        );
        if (diff.length > 0) {
          diff.forEach((member) =>
            toast(`🎉 ${member.displayName} has joined! 🎉`, {
              position: 'bottom-right',
            })
          );
        }

        memberAdapter.setAll(state, room.members);
        memberAdapter.commit(state);
      })
      .addCase(syncDown.rejected, memberAdapter.rollback)
      .addCase(syncUp.fulfilled, memberAdapter.commit)
      .addCase(syncUp.rejected, memberAdapter.rollback);
  },
});

export const { addMember, cyclePersonalDayType, removeMember, clearMember } =
  membersSlice.actions;
export const membersReducer = membersSlice.reducer;
export const membersSelector = memberAdapter.getSelectors(
  (state: AppState) => state.members
);
