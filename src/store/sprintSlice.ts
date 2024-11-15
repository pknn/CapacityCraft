import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import formatDate from '../util/formatDate';

type Day = {
  isHoliday: string;
};

type SprintState = {
  startDate: string;
  days: Day[];
};

const initialState: SprintState = {
  startDate: formatDate(new Date()),
  days: [],
};

const sprintSlice = createSlice({
  name: 'sprint',
  initialState,
  reducers: {
    setLength: (state, action: PayloadAction<number>) => {
      const newLength = action.payload;
      if (newLength <= 0) return;

      const currentDays = state.days;

      if (currentDays.length > newLength) {
        currentDays.splice(newLength);
      } else {
        state.days = currentDays.concat(
          Array(newLength - currentDays.length).fill({
            isHoliday: 'false',
          })
        );
      }
    },
    setStartDate: (state, action: PayloadAction<string>) => {
      state.startDate = action.payload;
    },
  },
});

export const { setLength, setStartDate } = sprintSlice.actions;
export default sprintSlice.reducer;
