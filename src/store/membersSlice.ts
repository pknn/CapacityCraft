import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Member } from '../types/Member';
import { generateDays, getUpdatedDays } from '../util/dayGenerator';
import {
  setDaysLength,
  setStartDate,
  toggleGlobalNonWorkingDay,
} from './roomSlice';
import { AppState } from '.';
import createUndoableEntityAdapter, {
  UndoableEntityState,
} from './utils/createUndoableEntityAdapter';
import { syncDown, syncUp } from './dataThunkActions';
import { Day } from '../types/Day';

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

const toggleDayAtIndex = (days: Day[], index: number): Day[] =>
  days.map((day, i) =>
    i === index ? { ...day, isNonWorkingDay: !day.isNonWorkingDay } : day
  );

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
    toggleMemberNonWorkingDay: (
      state,
      action: PayloadAction<{ id: string; dayIndex: number }>
    ) => {
      const { id, dayIndex } = action.payload;

      memberAdapter.updateOne(state, {
        id,
        changes: {
          days: state.current.entities[id].days.map((day, index) =>
            index === dayIndex
              ? { ...day, isNonWorkingDay: !day.isNonWorkingDay }
              : day
          ),
        },
      });
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
      .addCase(toggleGlobalNonWorkingDay, (state, action) => {
        const dayIndex = action.payload;
        updateAllMemberDays(state, (days) => toggleDayAtIndex(days, dayIndex));
      })
      .addCase(syncDown.fulfilled, (state, action) => {
        const room = action.payload;
        memberAdapter.setAll(state, room.members);
        memberAdapter.commit(state);
      })
      .addCase(syncDown.rejected, memberAdapter.rollback)
      .addCase(syncUp.fulfilled, memberAdapter.commit)
      .addCase(syncUp.rejected, memberAdapter.rollback);
  },
});

export const { addMember, toggleMemberNonWorkingDay, clearMember } =
  membersSlice.actions;
export const membersReducer = membersSlice.reducer;
export const membersSelector = memberAdapter.getSelectors(
  (state: AppState) => state.members
);
