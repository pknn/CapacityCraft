import { createSlice } from '@reduxjs/toolkit';
import { createRoom } from './roomSlice';

export type AppStatus = 'loading' | 'idle';
type StatusState = {
  status: AppStatus;
};

const initialState: StatusState = {
  status: 'idle',
};

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(createRoom.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createRoom.fulfilled, (state) => {
        state.status = 'idle';
      }),
});

export const statusReducer = statusSlice.reducer;
