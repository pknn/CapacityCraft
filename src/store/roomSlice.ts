import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import formatDateInput from '../util/formatDateInput';
import { generateDays, getUpdatedDays } from '../util/dayGenerator';
import { Day } from '../types/Day';
import roomService from '../services/roomService';

type RoomState = {
  id: string | undefined;
  startDate: string;
  days: Day[];
};

export const fetchRoomAndSet = createAsyncThunk(
  'rooms/fetchRoomAndSet',
  async (roomId: string) => {
    const room = await roomService.getRoom(roomId);

    return room;
  }
);

const initialState: RoomState = {
  id: undefined,
  startDate: formatDateInput(new Date()),
  days: generateDays(formatDateInput(new Date()), [], 9),
};

const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setRoomId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    clearRoom: (state) => {
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
  extraReducers: (builder) =>
    builder.addCase(fetchRoomAndSet.fulfilled, (state, action) => {
      const room = action.payload;
      const startDate = room.days.sort((a, b) =>
        new Date(a.date) < new Date(b.date) ? -1 : 1
      )[0].date;

      state.id = room.id;
      state.days = room.days;
      state.startDate = startDate;
    }),
});

export const {
  setRoomId,
  clearRoom,
  setLength,
  setStartDate,
  toggleGlobalNonWorkingDay,
} = roomSlice.actions;

export const roomReducer = roomSlice.reducer;
