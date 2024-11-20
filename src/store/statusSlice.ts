import { createSlice } from '@reduxjs/toolkit';

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
  reducers: {
    setLoading: (state) => {
      state.status = 'loading';
    },
    setFinishLoading: (state) => {
      state.status = 'idle';
    },
  },
});

export const { setLoading, setFinishLoading } = statusSlice.actions;

export const statusReducer = statusSlice.reducer;
