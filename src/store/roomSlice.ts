import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type RoomState = {
  id: string | undefined;
};

const initialState: RoomState = {
  id: undefined,
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
    },
  },
});

export const { setRoomId, clearRoomId } = roomSlice.actions;
export default roomSlice.reducer;
