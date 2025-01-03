import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { generateDays, getUpdatedDays } from '../util/dayGenerator';
import { Day, toggleGlobalDayType } from '../types/Day';
import roomService from '../services/roomService';
import { AppState } from '.';
import createUndoableAdapter from './utils/createUndoableAdapter';
import { syncDown, syncUp } from './dataThunkActions';
import equal from 'fast-deep-equal';
import getStartDate from '../util/getStartDate';

type RoomState = {
  id: string | undefined;
  startDate: string | undefined;
  days: Day[];
  baselineVelocity: number;
};

const roomUndoableAdapter = createUndoableAdapter<RoomState>({
  id: undefined,
  startDate: undefined,
  days: [],
  baselineVelocity: 0,
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
    setBaselineVelocity: (state, action: PayloadAction<number>) => {
      roomUndoableAdapter.update(state, {
        baselineVelocity: action.payload,
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
    toggleGlobalOffDay: (state, action: PayloadAction<number>) => {
      const dayIndex = action.payload;
      roomUndoableAdapter.update(state, {
        days: state.current.days.map((day, index) =>
          index === dayIndex
            ? { ...day, dayType: toggleGlobalDayType(day.dayType) }
            : day
        ),
      });
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(createRoom.fulfilled, (state, action) => {
        const { id, days, baselineVelocity } = action.payload;
        const startDate = getStartDate(days);
        roomUndoableAdapter.update(state, {
          id,
          days,
          startDate,
          baselineVelocity,
        });
        roomUndoableAdapter.commit(state);
      })
      .addCase(syncUp.fulfilled, (state, action) => {
        const { days } = action.payload;
        const isUpdated = equal(days, state.current.days);
        if (isUpdated) {
          roomUndoableAdapter.commit(state);
        }
      })
      .addCase(syncUp.rejected, (state) => {
        roomUndoableAdapter.rollback(state);
      })
      .addCase(syncDown.fulfilled, (state, action) => {
        const room = action.payload;
        const startDate = getStartDate(room.days);

        roomUndoableAdapter.update(state, {
          id: room.id,
          days: room.days,
          startDate,
          baselineVelocity: room.baselineVelocity,
        });
        roomUndoableAdapter.commit(state);
      }),
});

export const {
  setDaysLength,
  setStartDate,
  setBaselineVelocity,
  setRoomId,
  clearRoom,
  toggleGlobalOffDay,
} = roomSlice.actions;

export const roomSelector = roomUndoableAdapter.getSelectors(
  (state: AppState) => state.room
);

export const roomReducer = roomSlice.reducer;
