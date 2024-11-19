import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { generateDays, getUpdatedDays } from '../util/dayGenerator';
import { Day } from '../types/Day';
import roomService from '../services/roomService';
import { AppState } from '.';
import getStartDate from '../util/getStartDate';
import createUndoableAdapter from './utils/createUndoableAdapter';
import { syncDown, syncUp } from './dataThunkActions';

type RoomState = {
  id: string | undefined;
  startDate: string | undefined;
  days: Day[];
};

const roomUndoableAdapter = createUndoableAdapter<RoomState>({
  id: undefined,
  startDate: undefined,
  days: [],
});

export const createRoom = createAsyncThunk(
  'room/createRoom',
  async (roomId: string) => roomService.createRoom(roomId)
);

const roomSlice = createSlice({
  name: 'room',
  initialState: roomUndoableAdapter.getInitialState(),
  reducers: {
    setDaysLength: (
      state,
      action: PayloadAction<{ newLength: number; startDate: string }>
    ) => {
      const { newLength, startDate } = action.payload;
      const updatedDays = generateDays(
        startDate,
        state.current.days,
        newLength
      );
      roomUndoableAdapter.update(state, {
        days: updatedDays,
      });
    },
    setStartDate: (state, action: PayloadAction<string>) => {
      const startDate = action.payload;
      const updatedDays = getUpdatedDays(state.current.days, startDate);
      roomUndoableAdapter.update(state, {
        startDate,
        days: updatedDays,
      });
    },
    setRoomId: (state, action: PayloadAction<string>) => {
      roomUndoableAdapter.update(state, {
        id: action.payload,
      });
    },
    clearRoom: (state) => {
      roomUndoableAdapter.update(state, {
        id: undefined,
        startDate: undefined,
        days: [],
      });
    },
    toggleGlobalNonWorkingDay: (state, action: PayloadAction<number>) => {
      const dayIndex = action.payload;
      roomUndoableAdapter.update(state, {
        days: state.current.days.map((day, index) =>
          index === dayIndex
            ? { ...day, isNonWorkingDay: !day.isNonWorkingDay }
            : day
        ),
      });
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(syncDown.fulfilled, (state, action) => {
        const room = action.payload;
        const startDate = room.days.sort((a, b) =>
          new Date(a.date) < new Date(b.date) ? -1 : 1
        )[0].date;

        roomUndoableAdapter.update(state, {
          id: room.id,
          days: room.days,
          startDate,
        });
        roomUndoableAdapter.commit(state);
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        const { id, days } = action.payload;
        const startDate = days.sort((a, b) =>
          new Date(a.date) < new Date(b.date) ? -1 : 1
        )[0].date;
        roomUndoableAdapter.update(state, {
          id,
          days,
          startDate,
        });
        roomUndoableAdapter.commit(state);
      })
      .addCase(syncUp.fulfilled, (state, action) => {
        const { id, days } = action.payload;
        const startDate = getStartDate(days);

        roomUndoableAdapter.update(state, {
          id,
          days,
          startDate,
        });
        roomUndoableAdapter.commit(state);
      })
      .addCase(syncUp.rejected, (state) => {
        roomUndoableAdapter.rollback(state);
      }),
});

export const {
  setDaysLength,
  setStartDate,
  setRoomId,
  clearRoom,
  toggleGlobalNonWorkingDay,
} = roomSlice.actions;

export const roomSelector = roomUndoableAdapter.getSelectors(
  (state: AppState) => state.room
);

export const roomReducer = roomSlice.reducer;
