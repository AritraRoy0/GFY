
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the User interface
interface User {
	id: string;
	email: string | null;
	username?: string;
	// Add other properties if needed
}

// Define the state structure for authentication
interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	token: string | null;
}

// Initial state
const initialState: AuthState = {
	isAuthenticated: false,
	user: null,
	token: null,
};

// Create the auth slice
const authSlice = createSlice({
	name: "auth",
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

// Export actions
export const { setUser, clearUser, logout } = authSlice.actions;

// Create the Redux store
const store = configureStore({
	reducer: {
		auth: authSlice.reducer,
		// Add other reducers if necessary
	},
});

// Export types for use throughout your app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export the store as the default export
export default store;
