import {createSlice} from "@reduxjs/toolkit"
import axiosInstance from "../../../api/axios.js"
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

    } catch (error) {
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
        toast(data.message)
      }
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Registration Failed"
        )
      );
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
        toast(data.message)
        return true
      }
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Login Failed"
        )
      );
        toast(error.response?.data?.message)

    } finally {
      dispatch(setLoading(false));
    }
  };


//   Logout
export const logout =
  () => async (dispatch) => {
    try {
      await axiosInstance.post(
        "/auth/logout"
      );

      dispatch(logoutUser());
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Logout Failed"
        )
      );
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
      }
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setUser(null));
    } finally {
      dispatch(setLoading(false));
    }
  };


