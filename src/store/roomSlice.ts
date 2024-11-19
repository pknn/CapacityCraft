import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import formatDateInput from '../util/formatDateInput';
import { generateDays, getUpdatedDays } from '../util/dayGenerator';
import { Day } from '../types/Day';
import roomService from '../services/roomService';
import { AppState } from '.';
import { Member } from '../types/Member';
import { Room } from '../types/Room';
import getStartDate from '../util/getStartDate';

type RoomState = {
  id: string | undefined;
  startDate: string;
  days: Day[];
};

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
    const roomState = state.room;
    const roomId = roomState.id ?? '';

    const roomUpdate: Partial<Room> = {
      id: roomId,
      days: roomState.days,
    };

    return roomService.updateRoom(roomId, roomUpdate);
  }
);

// export const setDaysLength = createAsyncThunk(
//   'room/setRoomLength',
//   async (newLength: number, { getState }) => {
//     const state = getState() as AppState;
//     const roomId = state.room.id ?? '';
//     const newDays = generateDays(
//       state.room.startDate,
//       state.room.days,
//       newLength
//     );

//     const membersWithNewDays = state.members.ids.map((id): Member => {
//       const member = state.members.entities[id];
//       const updatedDays = generateDays(
//         state.room.startDate,
//         member.days,
//         newLength
//       );

//       return {
//         ...member,
//         days: updatedDays,
//       };
//     });

//     const roomUpdate: Partial<Room> = {
//       days: newDays,
//       members: membersWithNewDays,
//     };

//     return roomService.updateRoom(roomId, roomUpdate);
//   }
// );

export const setStartDate = createAsyncThunk(
  'room/setStartDate',
  async (newStartDate: string, { getState }) => {
    const state = getState() as AppState;
    const roomId = state.room.id ?? '';
    const updatedDays = getUpdatedDays(state.room.days, newStartDate);
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
  name: 'room',
  initialState,
  reducers: {
    setDaysLength: (
      state,
      action: PayloadAction<{ newLength: number; startDate: string }>
    ) => {
      const { newLength, startDate } = action.payload;
      const updatedDays = generateDays(startDate, state.days, newLength);
      state.days = updatedDays;
    },
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
      .addCase(syncDown.fulfilled, (state, action) => {
        const room = action.payload;
        const startDate = room.days.sort((a, b) =>
          new Date(a.date) < new Date(b.date) ? -1 : 1
        )[0].date;

        state.id = room.id;
        state.days = room.days;
        state.startDate = startDate;
      })
      .addCase(setStartDate.fulfilled, (state, action) => {
        const room = action.payload;
        const startDate = [...room.days].sort((a, b) =>
          new Date(a.date) < new Date(b.date) ? -1 : 1
        )[0].date;
        state.days = room.days;
        state.startDate = startDate;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        const roomId = action.payload;
        state.id = roomId;
      })
      .addCase(syncRoomUp.fulfilled, (state, action) => {
        const { id, days } = action.payload;
        state.id = id;
        state.days = days;

        const startDate = getStartDate(days);

        state.startDate = startDate;
      }),
});

export const {
  setDaysLength,
  setRoomId,
  clearRoom,
  toggleGlobalNonWorkingDay,
} = roomSlice.actions;

export const roomReducer = roomSlice.reducer;
