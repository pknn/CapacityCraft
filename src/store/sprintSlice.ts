import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import formatDate from '../util/formatDate';

type SprintState = {
  length: number;
  startDate: string;
};

const initialState: SprintState = {
  length: 0,
  startDate: formatDate(new Date()),
};

const sprintSlice = createSlice({
  name: 'sprint',
  initialState,
  reducers: {
    setLength: (state, action: PayloadAction<number>) => {
      const length = action.payload;
      if (length <= 0) return;

      state.length = length;
    },
    setStartDate: (state, action: PayloadAction<string>) => {
      state.startDate = action.payload;
    },
  },
});

export const { setLength, setStartDate } = sprintSlice.actions;
export default sprintSlice.reducer;
