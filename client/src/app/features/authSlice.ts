// src/features/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string | null;
  username?: string;
  // Add other properties if needed
}

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null, // Initial state
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
