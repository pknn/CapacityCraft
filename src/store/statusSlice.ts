import { createSlice } from '@reduxjs/toolkit';
import { createRoom } from './roomSlice';
import { syncDown, syncUp } from './dataThunkActions';

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
      })
      .addCase(syncDown.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(syncDown.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(syncUp.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(syncUp.fulfilled, (state) => {
        state.status = 'idle';
      }),
});

export const statusReducer = statusSlice.reducer;
