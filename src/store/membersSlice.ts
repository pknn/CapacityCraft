import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Member } from '../types/Member';
import { generateDays, getUpdatedDays } from '../util/dayGenerator';
import formatDateInput from '../util/formatDateInput';
import {
  setLength,
  setStartDate,
  toggleGlobalNonWorkingDay,
} from './roomSlice';
import { Day } from '../types/Day';

type MembersState = Record<string, Member>;

const initialState: MembersState = {
  alice: {
    displayName: 'Alice',
    days: generateDays(formatDateInput(new Date()), [], 9),
  },
  bob: {
    displayName: 'Bob',
    days: generateDays(formatDateInput(new Date()), [], 9),
  },
  charlie: {
    displayName: 'Charlie',
    days: generateDays(formatDateInput(new Date()), [], 9),
  },
};

const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    toggleMemberNonWorkingDay: (
      state,
      action: PayloadAction<{ id: string; day: number }>
    ) => {
      const { id, day } = action.payload;
      const member = state[id];
      const memberDay = member.days[day];
      if (memberDay) {
        member.days[day] = {
          ...memberDay,
          isNonWorkingDay: !memberDay.isNonWorkingDay,
        };
      }
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
      state[id] = {
        displayName,
        days:
          days ??
          generateDays(formatDateInput(new Date()), [], daysLength ?? 0),
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setLength, (state, action) => {
        const newLength = action.payload;
        if (newLength > 0) {
          Object.values(state).forEach((member) => {
            member.days = generateDays(
              formatDateInput(new Date()),
              member.days,
              newLength
            );
          });
        }
      })
      .addCase(setStartDate, (state, action) => {
        const newStartDate = action.payload;
        Object.values(state).forEach((member) => {
          member.days = getUpdatedDays(member.days, newStartDate);
        });
      })
      .addCase(toggleGlobalNonWorkingDay, (state, action) => {
        const index = action.payload;
        Object.values(state).forEach((member) => {
          const memberDay = member.days[index];
          if (memberDay) {
            member.days[index] = {
              ...memberDay,
              isNonWorkingDay: !memberDay.isNonWorkingDay,
            };
          }
        });
      });
  },
});

export const { toggleMemberNonWorkingDay, addMember } = membersSlice.actions;
export const membersReducer = membersSlice.reducer;
