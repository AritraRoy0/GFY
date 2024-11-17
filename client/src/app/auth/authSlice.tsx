import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the state structure for authentication
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

interface User {
  id: string;
  email: string | null;
  username?: string;
  // Add other properties if needed
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, clearUser, logout } = authSlice.actions;

export default authSlice.reducer;
