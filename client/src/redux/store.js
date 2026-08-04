import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../redux/adminSlice.js";
import userReducer from "../redux/userSlice.js";
import authReducer from "../redux/authSlice.js";

export const store = configureStore({
  reducer: {
    admin: adminReducer, 
    user: userReducer,
    auth: authReducer
  },
});