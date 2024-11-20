import { configureStore } from '@reduxjs/toolkit';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { roomReducer } from './roomSlice';
import userReducer from './userSlice';
import { membersReducer } from './membersSlice';
import { statusReducer } from './statusSlice';

const store = configureStore({
  reducer: {
    room: roomReducer,
    members: membersReducer,
    user: userReducer,
    status: statusReducer,
  },
});

const StoreProvider = ({ children }: PropsWithChildren) => (
  <Provider store={store}>{children}</Provider>
);

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default StoreProvider;
