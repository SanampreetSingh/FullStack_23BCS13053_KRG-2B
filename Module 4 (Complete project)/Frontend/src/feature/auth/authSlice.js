// src/redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

let auth = JSON.parse(sessionStorage.getItem("auth"));
const initialState = {
  role: auth?.role || null,
  user: auth?.user || null,
  isAuthenticated: auth?.isAuthenticated || false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.role = action.payload.role; // expect role from login
      state.user = action.payload.user; // expect user from login
      state.isAuthenticated = true;
      sessionStorage.setItem("auth", JSON.stringify(state));

    },
    logout: (state) => {
      state.role = null;
      state.isAuthenticated = false;
      state.user = null;
      sessionStorage.removeItem("auth");
      console.log("User logged out");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
