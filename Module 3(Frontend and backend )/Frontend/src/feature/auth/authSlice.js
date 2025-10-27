// src/redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: null, // "user" or "admin"
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.role = action.payload.role; // expect role from login
      state.user = action.payload.user; // expect user from login
      state.isAuthenticated = true;
      console.log("User logged in with role:", state.role);
      console.log("User logged in:", state.user);
    },
    logout: (state) => {
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
