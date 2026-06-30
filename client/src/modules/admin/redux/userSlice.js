import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axios";
import toast from "react-hot-toast";

const initialState = {
  user: null,
  projects: [],
  project: null,
  myProjects: [],
  tasks: [],
  task: null,
  loading: false,
  error: null,
  dashboardInfo: {},
  
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },

    setTasks: (state,action) => {
      state.tasks = action.payload
    },
    setTask: (state,action) => {
      state.task = action.payload
    },
 
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    setProject: (state, action) => {
      state.project = action.payload;
    },
    setMyProjects: (state, action) => {
      state.myProjects = action.payload;
    },
    
    setLoading: (state,action) => {
      state.loading = action.payload
    },
    setError: (state,action) => {
      state.error = action.payload
    },
    
    clearAdmin: (state) => {
      state.admin = null;
    },

    setDashboardInfo: (state,action) => {
      state.dashboardInfo = action.payload
    },
       
  },

});

export const { 
    setUser, 
    setLoading,
    setError,
    setDashboardInfo,
    setTasks,
    setTask,
    setProjects,
    setProject,
    setMyProjects,
  } = userSlice.actions;
export default userSlice.reducer;


// Set Current USer
export const getProfile = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await axiosInstance.get("/auth/profile");
        if (response.data.success) {
            dispatch(setUser(response.data.user))
        }
       
    } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch Profile";
        dispatch(setError(message));
    } finally {
        dispatch(setLoading(false));
    }
};

// Get User Dashboard
export const getUserDashboard = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await axiosInstance.get("/employee/dashboard");
        if (response.data.success) {
            dispatch(setDashboardInfo(response.data.stats))
        }
    } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch Profile";
        toast(message)
        dispatch(setError(message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const getMyTasks = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await axiosInstance.get("/employee/tasks");
        if (response.data.success) {
            dispatch(setTasks(response.data.tasks))
          }
      
    } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch Tasks";
        dispatch(setError(message));
    } finally {
        dispatch(setLoading(false));
    }
};

// Get Task By id
export const getTaskById = (id) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await axiosInstance.get(`/tasks/${id}`);
        if (response.data.success) {
            dispatch(setTask(response.data.task))
        }
       
    } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch Profile";
        toast(message)
        dispatch(setError(message));
    } finally {
        dispatch(setLoading(false));
    }
};

// Update Task Status 
export const updateTaskStatus = ({id,status}) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
          
        const {data} = await axiosInstance.patch(`/employee/tasks/${id}/status`,{status});
       if (data.success) {
            toast(data.message)
       }
    } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch Profile";
        toast(message)
        dispatch(setError(message));
    } finally {
        dispatch(setLoading(false));
    }
};

// Delete Task By Id
export const deleteTaskById = (id) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await axiosInstance.delete(`/admin/tasks/${id}`);
        if (response.data.success) {
            toast(response.data.message)
            return true
        }
       
    } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch Profile";
        toast(message)
        dispatch(setError(message));
    } finally {
        dispatch(setLoading(false));
    }
};

// Get My Projects
export const getMyProjects = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await axiosInstance.get(`/employee/projects`);
        if (response.data.success) {
            dispatch(setMyProjects(response.data.projects))
        }
       
    } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch Profile";
        toast(message)
        dispatch(setError(message));
    } finally {
        dispatch(setLoading(false));
    }
};

// Get Project By Id
export const getProjectById = (id) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await axiosInstance.get(`/projects/${id}`);
        if (response.data.success) {
            dispatch(setProject(response.data.project))
        }
       
    } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch Profile";
        toast(message)
        dispatch(setError(message));
    } finally {
        dispatch(setLoading(false));
    }
};

// Delete Project By Id
export const deleteProjectById = (id) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await axiosInstance.delete(`/admin/projects/${id}`);
        if (response.data.success) {
            toast(response.data.message)
            return true
        }
       
    } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch Profile";
        toast(message)
        dispatch(setError(message));
    } finally {
        dispatch(setLoading(false));
    }
};