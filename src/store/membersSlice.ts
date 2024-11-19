import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Member } from '../types/Member';
import { generateDays, getUpdatedDays } from '../util/dayGenerator';
import {
  setDaysLength,
  setStartDate,
  toggleGlobalNonWorkingDay,
} from './roomSlice';
import { AppState } from '.';
import createUndoableEntityAdapter from './utils/createUndoableEntityAdapter';
import { syncRoomDown, syncRoomUp } from './dataThunkActions';
import { Day } from '../types/Day';

type AddMemberPayload = {
  id: string;
  displayName: string;
  days: Day[];
};

const memberUndoableAdapter = createUndoableEntityAdapter<Member, Member['id']>(
  {
    selectId: (member: Member) => member.id,
  }
);

const membersSlice = createSlice({
  name: 'members',
  initialState: memberUndoableAdapter.getInitialState(),
  reducers: {
    addMember: (state, action: PayloadAction<AddMemberPayload>) => {
      const { id, displayName, days } = action.payload;
      memberUndoableAdapter.addOne(state, {
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

      memberUndoableAdapter.updateOne(state, {
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
    clearMember: (state) => memberUndoableAdapter.removeAll(state),
  },
  extraReducers: (builder) => {
    builder
      .addCase(setDaysLength, (state, action) => {
        const { newLength, startDate } = action.payload;

        memberUndoableAdapter.updateMany(
          state,
          state.current.ids.map((id) => ({
            id,
            changes: {
              days: generateDays(
                startDate,
                state.current.entities[id].days,
                newLength
              ),
            },
          }))
        );
      })
      .addCase(setStartDate, (state, action) => {
        memberUndoableAdapter.updateMany(
          state,
          state.current.ids.map((id) => ({
            id: id,
            changes: {
              days: getUpdatedDays(
                state.current.entities[id].days,
                action.payload
              ),
            },
          }))
        );
      })
      .addCase(toggleGlobalNonWorkingDay, (state, action) => {
        const dayIndex = action.payload;
        memberUndoableAdapter.updateMany(
          state,
          state.current.ids.map((id) => {
            const memberDay = state.current.entities[id].days;
            return {
              id,
              changes: {
                days: memberDay.map((day, index) =>
                  index === dayIndex
                    ? { ...day, isNonWorkingDay: !day.isNonWorkingDay }
                    : day
                ),
              },
            };
          })
        );
      })
      .addCase(syncRoomDown.fulfilled, (state, action) => {
        const room = action.payload;
        memberUndoableAdapter.setAll(state, room.members);
        memberUndoableAdapter.commit(state);
      })
      .addCase(syncRoomDown.rejected, (state) => {
        memberUndoableAdapter.rollback(state);
      })
      .addCase(syncRoomUp.fulfilled, (state) => {
        memberUndoableAdapter.commit(state);
      })
      .addCase(syncRoomUp.rejected, (state) => {
        memberUndoableAdapter.rollback(state);
      });
  },
});

export const { addMember, toggleMemberNonWorkingDay, clearMember } =
  membersSlice.actions;
export const membersReducer = membersSlice.reducer;
export const membersSelector = memberUndoableAdapter.getSelectors(
  (state: AppState) => state.members
);
