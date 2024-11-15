import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import formatDateInput from '../util/formatDateInput';
import { act } from 'react';

export type Day = {
  date: string;
  isNonWorkingDay: boolean;
};

type SprintState = {
  startDate: string;
  days: Day[];
};

const initialState: SprintState = {
  startDate: formatDateInput(new Date()),
  days: [
    { date: '2024-11-15', isNonWorkingDay: false },
    { date: '2024-11-16', isNonWorkingDay: false },
    { date: '2024-11-17', isNonWorkingDay: true },
  ],
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

const sprintSlice = createSlice({
  name: 'sprint',
  initialState,
  reducers: {
    setLength: (state, action: PayloadAction<number>) => {
      const newLength = action.payload;
      if (newLength > 0) {
        state.days = generateDays(state.startDate, state.days, newLength);
      }
    },
    setStartDate: (state, action: PayloadAction<string>) => {
      const newStartDate = action.payload;

      state.days = state.days.map((_, index) => {
        const calculatedDate = new Date(newStartDate);
        calculatedDate.setDate(calculatedDate.getDate() + index);
        const formattedDate = formatDateInput(calculatedDate);

        // Keep existing day if date matches, otherwise create a new one
        return (
          state.days.find((day) => day.date === formattedDate) || {
            date: formattedDate,
            isNonWorkingDay: false,
          }
        );
      });

      state.startDate = newStartDate;
    },
    toggleNonWorkingDay: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const selectedDay = state.days[index];
      state.days[index] = {
        ...selectedDay,
        isNonWorkingDay: !selectedDay.isNonWorkingDay,
      };
    },
  },
});

export const { setLength, setStartDate, toggleNonWorkingDay } =
  sprintSlice.actions;
export default sprintSlice.reducer;
