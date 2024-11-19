import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import formatDateInput from '../util/formatDateInput';
import { generateDays, getUpdatedDays } from '../util/dayGenerator';
import { Day } from '../types/Day';
import roomService from '../services/roomService';
import { AppState } from '.';
import { Room } from '../types/Room';
import getStartDate from '../util/getStartDate';
import createUndoableAdapter from './utils/createUndoableAdapter';

type RoomState = {
  id: string | undefined;
  startDate: string;
  days: Day[];
};

const roomUndoableAdapter = createUndoableAdapter<RoomState>({
  id: undefined,
  startDate: formatDateInput(new Date()),
  days: generateDays(formatDateInput(new Date()), [], 9),
});

export const createRoom = createAsyncThunk(
  'room/createRoom',
  async (roomId: string) => {
    await roomService.createRoom(roomId);
    return roomId;
  }
);

export const syncDown = createAsyncThunk(
  'room/syncDown',
  async (roomId: string) => {
    const room = await roomService.getRoom(roomId);

    return room;
  }
);

export const syncRoomUp = createAsyncThunk(
  'room/syncUp',
  async (_, { getState }) => {
    const state = getState() as AppState;
    const roomState = roomSelector.value(state);
    const roomId = roomState.id ?? '';

    const roomUpdate: Partial<Room> = {
      id: roomId,
      days: roomState.days,
    };

    return roomService.updateRoom(roomId, roomUpdate);
  }
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
        startDate: formatDateInput(new Date()),
        days: generateDays(state.current.startDate, [], 9),
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
        const roomId = action.payload;
        roomUndoableAdapter.update(state, {
          id: roomId,
        });
        roomUndoableAdapter.commit(state);
      })
      .addCase(syncRoomUp.fulfilled, (state, action) => {
        const { id, days } = action.payload;
        const startDate = getStartDate(days);

        roomUndoableAdapter.update(state, {
          id,
          days,
          startDate,
        });
        roomUndoableAdapter.commit(state);
      })
      .addCase(syncRoomUp.rejected, (state) => {
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
