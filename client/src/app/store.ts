import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice'; // Adjust the pat

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers if necessary
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
