import { createAsyncThunk } from '@reduxjs/toolkit';
import roomService from '../services/roomService';
import { AppState } from '.';
import { Room } from '../types/Room';
import { roomSelector } from './roomSlice';
import { membersSelector } from './membersSlice';

export const syncRoomDown = createAsyncThunk(
  'data/syncDown',
  async (roomId: string) => {
    const room = await roomService.getRoom(roomId);

    return room;
  }
);

export const syncRoomUp = createAsyncThunk(
  'data/syncUp',
  async (_, { getState }) => {
    const state = getState() as AppState;
    const roomState = roomSelector.value(state);
    const members = membersSelector.selectAll(state);
    const roomId = roomState.id ?? '';

    const roomUpdate: Partial<Room> = {
      id: roomId,
      days: roomState.days,
      members,
    };

    return roomService.updateRoom(roomId, roomUpdate);
  }
);