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
      }),
});

export const { setRoomId, clearRoom, setStartDate, toggleGlobalNonWorkingDay } =
  roomSlice.actions;

export const roomReducer = roomSlice.reducer;
