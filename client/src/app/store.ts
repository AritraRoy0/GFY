// src/store.ts

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';  // Adjust according to your actual slice location

const store = configureStore({
  reducer: {
    auth: authReducer,  // Add your reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
