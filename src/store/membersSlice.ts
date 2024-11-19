import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Member } from '../types/Member';
import { generateDays, getUpdatedDays } from '../util/dayGenerator';
import {
  syncDown,
  setDaysLength,
  setStartDate,
  toggleGlobalNonWorkingDay,
  roomSelector,
} from './roomSlice';
import { AppState } from '.';
import roomService from '../services/roomService';
import createUndoableEntityAdapter from './utils/createUndoableEntityAdapter';

type AddMemberPayload = {
  id: string;
  displayName: string;
};

export const addMember = createAsyncThunk(
  'members/addMember',
  async ({ id, displayName }: AddMemberPayload, { getState }) => {
    const state = getState() as AppState;
    const roomId = roomSelector.value(state).id ?? '';
    const days = roomSelector.value(state).days;
    const member: Member = {
      id,
      displayName,
      days,
    };
    await roomService.addMember(roomId, member);
    return member;
  }
);

const memberUndoableAdapter = createUndoableEntityAdapter<Member, Member['id']>(
  {
    selectId: (member: Member) => member.id,
  }
);

const membersSlice = createSlice({
  name: 'members',
  initialState: memberUndoableAdapter.getInitialState(),
  reducers: {
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
      .addCase(addMember.fulfilled, (state, action) => {
        const member = action.payload;
        memberUndoableAdapter.addOne(state, member);
        memberUndoableAdapter.commit(state);
      })
      .addCase(addMember.rejected, (state) => {
        memberUndoableAdapter.rollback(state);
      })
      .addCase(syncDown.fulfilled, (state, action) => {
        const room = action.payload;
        memberUndoableAdapter.setAll(state, room.members);
        memberUndoableAdapter.commit(state);
      })
      .addCase(syncDown.rejected, (state) => {
        memberUndoableAdapter.rollback(state);
      });
  },
});

export const { toggleMemberNonWorkingDay, clearMember } = membersSlice.actions;
export const membersReducer = membersSlice.reducer;
export const membersSelector = memberUndoableAdapter.getSelectors(
  (state: AppState) => state.members
);
