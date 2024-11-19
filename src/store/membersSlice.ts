import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { Member } from '../types/Member';
import { generateDays, getUpdatedDays } from '../util/dayGenerator';
import formatDateInput from '../util/formatDateInput';
import {
  setLength,
  setStartDate,
  toggleGlobalNonWorkingDay,
} from './roomSlice';
import { Day } from '../types/Day';
import { AppState } from '.';

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
    addMember: (
      state,
      action: PayloadAction<{
        id: string;
        displayName: string;
        days?: Day[];
        daysLength?: number;
      }>
    ) => {
      const { id, displayName, days, daysLength } = action.payload;
      memberAdapter.addOne(state, {
        id,
        displayName,
        days:
          days ??
          generateDays(formatDateInput(new Date()), [], daysLength ?? 0),
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setLength, (state, action) => {
        const newLength = action.payload;
        if (newLength > 0) {
          memberAdapter.updateMany(
            state,
            state.ids.map((id) => ({
              id,
              changes: {
                days: generateDays(
                  formatDateInput(new Date()),
                  state.entities[id].days,
                  newLength
                ),
              },
            }))
          );
        }
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
      });
  },
});

export const { toggleMemberNonWorkingDay, addMember } = membersSlice.actions;
export const membersReducer = membersSlice.reducer;
export const membersSelector = memberAdapter.getSelectors(
  (state: AppState) => state.members
);
