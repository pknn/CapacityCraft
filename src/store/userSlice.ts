import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
  displayName: string | undefined;
  id: number | undefined;
};

const initialState: UserState = {
  displayName: undefined,
  id: undefined,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setDisplayName: (state, action: PayloadAction<string>) => {
      state.displayName = action.payload;
    },
    clearDisplayName: (state) => {
      state.displayName = undefined;
    },
  },
});

export const { setDisplayName, clearDisplayName } = userSlice.actions;
export default userSlice.reducer;
