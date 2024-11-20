import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { syncDown } from './dataThunkActions';
import { toast } from 'react-toastify';

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
  extraReducers: (builder) =>
    builder.addCase(syncDown.fulfilled, (state, action) => {
      const room = action.payload;

      if (
        state.id &&
        !room.members
          .map((member) => {
            console.log(member.id, state.id, member.id === state.id);
            return member.id;
          })
          .includes(state.id)
      ) {
        state.id = undefined;
        state.displayName = undefined;

        toast("Sorry! You've been removed from the room");
      }
    }),
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
