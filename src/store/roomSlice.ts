import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import formatDateInput from '../util/formatDateInput';
import { generateDays, getUpdatedDays } from '../util/dayGenerator';
import { Day } from '../types/Day';
import roomService from '../services/roomService';
import { AppState } from '.';
import { Member } from '../types/Member';
import { Room } from '../types/Room';

type RoomState = {
  id: string | undefined;
  startDate: string;
  days: Day[];
};

export const createRoom = createAsyncThunk(
  'rooms/createRoom',
  async (roomId: string) => {
    await roomService.createRoom(roomId);
    return roomId;
  }
);

export const fetchRoomAndSet = createAsyncThunk(
  'rooms/fetchRoomAndSet',
  async (roomId: string) => {
    const room = await roomService.getRoom(roomId);

    return room;
  }
);

export const setDaysLength = createAsyncThunk(
  'rooms/setRoomLength',
  async (newLength: number, { getState }) => {
    const state = getState() as AppState;
    const roomId = state.rooms.id ?? '';
    const newDays = generateDays(
      state.rooms.startDate,
      state.rooms.days,
      newLength
    );

    const membersWithNewDays = state.members.ids.map((id): Member => {
      const member = state.members.entities[id];
      const updatedDays = generateDays(
        state.rooms.startDate,
        member.days,
        newLength
      );

      return {
        ...member,
        days: updatedDays,
      };
    });

    const roomUpdate: Partial<Room> = {
      days: newDays,
      members: membersWithNewDays,
    };

    return roomService.updateRoom(roomId, roomUpdate);
  }
);

export const setStartDate = createAsyncThunk(
  'rooms/setStartDate',
  async (newStartDate: string, { getState }) => {
    const state = getState() as AppState;
    const roomId = state.rooms.id ?? '';
    const updatedDays = getUpdatedDays(state.rooms.days, newStartDate);
    const membersWithUpdatedDays = state.members.ids.map((id): Member => {
      const member = state.members.entities[id];
      const updatedDays = getUpdatedDays(member.days, newStartDate);

      return {
        ...member,
        days: updatedDays,
      };
    });

    const roomUpdate: Partial<Room> = {
      days: updatedDays,
      members: membersWithUpdatedDays,
    };

    return roomService.updateRoom(roomId, roomUpdate);
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
    builder
      .addCase(fetchRoomAndSet.fulfilled, (state, action) => {
        const room = action.payload;
        const startDate = room.days.sort((a, b) =>
          new Date(a.date) < new Date(b.date) ? -1 : 1
        )[0].date;

        state.id = room.id;
        state.days = room.days;
        state.startDate = startDate;
      })
      .addCase(setDaysLength.fulfilled, (state, action) => {
        state.days = action.payload.days;
      })
      .addCase(setStartDate.fulfilled, (state, action) => {
        const room = action.payload;
        const startDate = room.days.sort((a, b) =>
          new Date(a.date) < new Date(b.date) ? -1 : 1
        )[0].date;
        state.days = room.days;
        state.startDate = startDate;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        const roomId = action.payload;
        state.id = roomId;
      }),
});

export const { setRoomId, clearRoom, toggleGlobalNonWorkingDay } =
  roomSlice.actions;

export const roomReducer = roomSlice.reducer;
