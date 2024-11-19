import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { Member } from '../types/Member';
import { getUpdatedDays } from '../util/dayGenerator';
import {
  fetchRoomAndSet,
  setDaysLength,
  setStartDate,
  toggleGlobalNonWorkingDay,
} from './roomSlice';
import { AppState } from '.';
import roomService from '../services/roomService';

type AddMemberPayload = {
  id: string;
  displayName: string;
};

export const addMember = createAsyncThunk(
  'members/addMember',
  async ({ id, displayName }: AddMemberPayload, { getState }) => {
    const state = getState() as AppState;
    const roomId = state.rooms.id ?? '';
    const days = state.rooms.days;
    const member: Member = {
      id,
      displayName,
      days,
    };
    await roomService.addMember(roomId, member);
    return member;
  }
);

const memberAdapter = createEntityAdapter<Member, Member['id']>({
  selectId: (member: Member) => member.id,
});

const membersSlice = createSlice({
  name: 'members',
  initialState: memberAdapter.getInitialState(),
  reducers: {
    toggleMemberNonWorkingDay: (
      state,
      action: PayloadAction<{ id: string; dayIndex: number }>
    ) => {
      const { id, dayIndex } = action.payload;

      memberAdapter.updateOne(state, {
        id,
        changes: {
          days: state.entities[id].days.map((day, index) =>
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
      .addCase(setDaysLength.fulfilled, (state, action) => {
        const members = action.payload.members;
        memberAdapter.updateMany(
          state,
          members.map((member) => ({
            id: member.id,
            changes: {
              days: member.days,
            },
          }))
        );
      })
      .addCase(setStartDate, (state, action) => {
        const newStartDate = action.payload;
        memberAdapter.updateMany(
          state,
          state.ids.map((id) => ({
            id,
            changes: {
              days: getUpdatedDays(state.entities[id].days, newStartDate),
            },
          }))
        );
      })
      .addCase(toggleGlobalNonWorkingDay, (state, action) => {
        const dayIndex = action.payload;
        memberAdapter.updateMany(
          state,
          state.ids.map((id) => {
            const memberDay = state.entities[id].days;
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
        memberAdapter.addOne(state, member);
      })
      .addCase(fetchRoomAndSet.fulfilled, (state, action) => {
        const room = action.payload;
        memberAdapter.setAll(state, room.members);
      });
  },
});

export const { toggleMemberNonWorkingDay, clearMember } = membersSlice.actions;
export const membersReducer = membersSlice.reducer;
export const membersSelector = memberAdapter.getSelectors(
  (state: AppState) => state.members
);
