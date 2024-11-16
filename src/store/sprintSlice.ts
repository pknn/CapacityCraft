import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import formatDateInput from '../util/formatDateInput';
import { generateDays } from '../util/dayGenerator';

export type Member = {
  displayName: string;
  days: Day[];
};

export type Day = {
  date: string;
  isNonWorkingDay: boolean;
};

type SprintState = {
  startDate: string;
  days: Day[];
  members: Record<string, Member>;
};

const initialState: SprintState = {
  startDate: formatDateInput(new Date()),
  days: generateDays(formatDateInput(new Date()), [], 7),
  members: {
    alice: {
      displayName: 'Alice',
      days: generateDays(formatDateInput(new Date()), [], 7),
    },
    bob: {
      displayName: 'Bob',
      days: generateDays(formatDateInput(new Date()), [], 7),
    },
    charlie: {
      displayName: 'Charlie',
      days: generateDays(formatDateInput(new Date()), [], 7),
    },
  },
};

const getUpdatedDays = (days: Day[], newStartDateStr: string): Day[] =>
  days.map((_, index) => {
    const calculatedDate = new Date(newStartDateStr);
    calculatedDate.setDate(calculatedDate.getDate() + index);
    const formattedDate = formatDateInput(calculatedDate);

    // Keep existing day if date matches, otherwise create a new one
    return (
      days.find((day) => day.date === formattedDate) || {
        date: formattedDate,
        isNonWorkingDay: false,
      }
    );
  });

const sprintSlice = createSlice({
  name: 'sprint',
  initialState,
  reducers: {
    setLength: (state, action: PayloadAction<number>) => {
      const newLength = action.payload;
      if (newLength > 0) {
        state.days = generateDays(state.startDate, state.days, newLength);

        Object.values(state.members).forEach((member) => {
          member.days = generateDays(state.startDate, member.days, newLength);
        });
      }
    },
    setStartDate: (state, action: PayloadAction<string>) => {
      const newStartDate = action.payload;

      state.days = getUpdatedDays(state.days, newStartDate);

      state.startDate = newStartDate;

      Object.values(state.members).forEach((member) => {
        member.days = getUpdatedDays(member.days, newStartDate);
      });
    },
    toggleGlobalNonWorkingDay: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const selectedDay = state.days[index];
      const updatedIsNonWorkingDay = !selectedDay.isNonWorkingDay;
      state.days[index] = {
        ...selectedDay,
        isNonWorkingDay: updatedIsNonWorkingDay,
      };

      Object.values(state.members).forEach((member) => {
        const memberDay = member.days[index];
        if (memberDay) {
          member.days[index] = {
            ...memberDay,
            isNonWorkingDay: updatedIsNonWorkingDay,
          };
        }
      });
    },
    toggleMemberNonWorkingDay: (
      state,
      action: PayloadAction<{ id: string; day: number }>
    ) => {
      const { id, day } = action.payload;
      const member = state.members[id];
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
      action: PayloadAction<{ id: string; displayName: string }>
    ) => {
      const { id, displayName } = action.payload;
      state.members[id] = {
        displayName,
        days: generateDays(state.startDate, [], state.days.length),
      };
    },
  },
});

export const {
  setLength,
  setStartDate,
  toggleGlobalNonWorkingDay,
  toggleMemberNonWorkingDay,
  addMember,
} = sprintSlice.actions;
export default sprintSlice.reducer;
