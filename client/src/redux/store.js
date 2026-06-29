import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../modules/admin/redux/adminSlice.js";
import userReducer from "../modules/admin/redux/userSlice.js";
import authReducer from "../modules/authentication/redux/authSlice.js";

export const store = configureStore({
  reducer: {
    admin: adminReducer, 
    user: userReducer,
    auth: authReducer
  },
});