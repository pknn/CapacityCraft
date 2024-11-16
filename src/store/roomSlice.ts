import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Day } from './sprintSlice';
import formatDateInput from '../util/formatDateInput';
import { generateDays, getUpdatedDays } from '../util/dayGenerator';

type RoomState = {
  id: string | undefined;
  startDate: string;
  days: Day[];
};

const initialState: RoomState = {
  id: undefined,
  startDate: formatDateInput(new Date()),
  days: generateDays(formatDateInput(new Date()), [], 9),
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    clearRoomId: (state) => {
      state.id = undefined;
      state.startDate = formatDateInput(new Date());
      state.days = generateDays(state.startDate, [], 9);
    },
    setLength: (state, action: PayloadAction<number>) => {
      const newLength = action.payload;
      if (newLength > 0) {
        state.days = generateDays(state.startDate, state.days, newLength);
      }
    },
    setStartDate: (state, action: PayloadAction<string>) => {
      const newStartDate = action.payload;
      state.days = getUpdatedDays(state.days, newStartDate);
      state.startDate = newStartDate;
    },
    toggleGlobalNonWorkingDay: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const selectedDay = state.days[index];
      state.days[index] = {
        ...selectedDay,
        isNonWorkingDay: !selectedDay.isNonWorkingDay,
      };
    },
  },
});

export const {
  setRoomId,
  clearRoomId,
  setLength,
  setStartDate,
  toggleGlobalNonWorkingDay,
} = roomSlice.actions;

export const roomReducer = roomSlice.reducer;
