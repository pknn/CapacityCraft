import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
  id: string | undefined;
  displayName: string | undefined;
};

const initialState: UserState = {
  id: undefined,
  displayName: undefined,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ id: string; displayName: string }>
    ) => {
      const { id, displayName } = action.payload;

      state.id = id;
      state.displayName = displayName;
    },
    clearUser: (state) => {
      state.id = undefined;
      state.displayName = undefined;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
