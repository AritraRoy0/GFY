// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';  // Import authReducer

const store = configureStore({
  reducer: {
    auth: authReducer,  // Add auth slice to the store
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
