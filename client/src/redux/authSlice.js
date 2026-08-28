import {createSlice} from "@reduxjs/toolkit"
import axiosInstance from "../api/axios.js"
import toast, { Toaster } from 'react-hot-toast';
import { Navigate } from "react-router-dom";

const initialState = {
    user: null,
    loading: true,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state,action) => {
            state.user = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    }
})

export const {setUser,setError,setLoading} = authSlice.actions
export default authSlice.reducer;

// Google Login
export const googleLogin =
  (credential) => async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const { data } = await axiosInstance.post(
        "/auth/google",
        { credential }
      );

      if (data.success) {
        dispatch(setUser(data.user));
        return true;
      }
      toast(data?.message)

    } catch (error) {
      toast(error.response?.data?.message)
      dispatch(
        setError(
          error.response?.data?.message ||
          "Google Login Failed"
        )
      );

      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

// Register 
export const register =
  (formData) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const { data } =
        await axiosInstance.post(
          "/auth/register",
          formData
        );

      if (data.success) {
        dispatch(setUser(data.user));
        toast.success(data.message || "Registered successfully!");
        return true;
      }
      return false;
    } catch (error) {
      const msg = error.response?.data?.message || "Registration Failed";
      dispatch(setError(msg));
      toast.error(msg);
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };


// Login
export const login =
  (formData) => async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const { data } =
      await axiosInstance.post(
        "/auth/login",
        formData
      );
      
      if (data.success) {
        dispatch(setUser(data.user));
        toast.success(data.message || "Login successful");
        return true;
      }
      return false;
    } catch (error) {
      const msg = error.response?.data?.message || "Login Failed";
      dispatch(setError(msg));
      toast.error(msg);
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };


// Join Company
export const joinCompany = (companyId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await axiosInstance.post("/company/join", { companyId });
    if (data.success) {
      dispatch(setUser(data.user));
      toast.success(data.message || "Joined company successfully!");
      return true;
    }
    return false;
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to join company";
    toast.error(msg);
    dispatch(setError(msg));
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};

//   Logout
export const logout =
  () => async (dispatch) => {
    try {
      await axiosInstance.get(
        "/auth/logout"
      );

      dispatch(setUser(null));
      toast.success("Logged out successfully");
    } catch (error) {
      dispatch(setUser(null));
      dispatch(
        setError(
          error.response?.data?.message ||
            "Logout Failed"
        )
      );
    }
  };


// Forgot Password
export const forgotPassword =
  (email) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const { data } = await axiosInstance.post("/auth/forgot-password", { email });
      if (data.success) {
        toast.success(data.message || "Reset link generated!");
        return data;
      }
      return null;
    } catch (error) {
      const msg = error.response?.data?.message || "Forgot Password Failed";
      toast.error(msg);
      dispatch(setError(msg));
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };

// Reset Password
export const resetPassword =
  (token, newPassword) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const { data } = await axiosInstance.post("/auth/reset-password", { token, newPassword });
      if (data.success) {
        toast.success(data.message || "Password reset successful");
        return true;
      }
      return false;
    } catch (error) {
      const msg = error.response?.data?.message || "Reset Password Failed";
      toast.error(msg);
      dispatch(setError(msg));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

//   Check Current User
export const getCurrentUser =
  () => async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const { data } =
        await axiosInstance.get(
          "/auth/profile"
        );

      if (data.success) {
        dispatch(setUser(data.user));
      } else {
        dispatch(setUser(null));
      }
    } catch (error) {
      dispatch(setUser(null));
    } finally {
      dispatch(setLoading(false));
    }
  };


