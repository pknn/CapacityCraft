import { configureStore } from '@reduxjs/toolkit';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import roomReducer from './roomSlice';
import sprintReducer from './sprintSlice';
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    room: roomReducer,
    sprint: sprintReducer,
    user: userReducer,
  },
});

const StoreProvider = ({ children }: PropsWithChildren) => (
  <Provider store={store}>{children}</Provider>
);

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default StoreProvider;
