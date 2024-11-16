import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import formatDateInput from '../util/formatDateInput';

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
  days: [
    { date: '2024-11-16', isNonWorkingDay: false },
    { date: '2024-11-17', isNonWorkingDay: false },
    { date: '2024-11-18', isNonWorkingDay: false },
    { date: '2024-11-19', isNonWorkingDay: false },
    { date: '2024-11-20', isNonWorkingDay: false },
    { date: '2024-11-21', isNonWorkingDay: false },
    { date: '2024-11-22', isNonWorkingDay: false },
  ],
  members: {
    alice: {
      displayName: 'Alice',
      days: [
        { date: '2024-11-16', isNonWorkingDay: false },
        { date: '2024-11-17', isNonWorkingDay: true },
        { date: '2024-11-18', isNonWorkingDay: false },
        { date: '2024-11-19', isNonWorkingDay: false },
        { date: '2024-11-20', isNonWorkingDay: false },
        { date: '2024-11-21', isNonWorkingDay: false },
        { date: '2024-11-22', isNonWorkingDay: false },
      ],
    },
    bob: {
      displayName: 'Bob',
      days: [
        { date: '2024-11-16', isNonWorkingDay: false },
        { date: '2024-11-17', isNonWorkingDay: true },
        { date: '2024-11-18', isNonWorkingDay: false },
        { date: '2024-11-19', isNonWorkingDay: false },
        { date: '2024-11-20', isNonWorkingDay: false },
        { date: '2024-11-21', isNonWorkingDay: false },
        { date: '2024-11-22', isNonWorkingDay: false },
      ],
    },
    charlie: {
      displayName: 'Charlie',
      days: [
        { date: '2024-11-16', isNonWorkingDay: true },
        { date: '2024-11-17', isNonWorkingDay: false },
        { date: '2024-11-18', isNonWorkingDay: false },
        { date: '2024-11-19', isNonWorkingDay: false },
        { date: '2024-11-20', isNonWorkingDay: false },
        { date: '2024-11-21', isNonWorkingDay: false },
        { date: '2024-11-22', isNonWorkingDay: false },
      ],
    },
  },
};

const generateDay = (startDate: string, offset: number): Day => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + offset);
  return { date: formatDateInput(date), isNonWorkingDay: false };
};

const generateDays = (
  startDate: string,
  currentDays: Day[],
  newLength: number
): Day[] => {
  if (newLength > currentDays.length) {
    // Extend days
    const additionalDays = Array.from(
      { length: newLength - currentDays.length },
      (_, i) => generateDay(startDate, currentDays.length + i)
    );
    return [...currentDays, ...additionalDays];
  }

  // Trim excess days
  return currentDays.slice(0, newLength);
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
  },
});

export const {
  setLength,
  setStartDate,
  toggleGlobalNonWorkingDay,
  toggleMemberNonWorkingDay,
} = sprintSlice.actions;
export default sprintSlice.reducer;
