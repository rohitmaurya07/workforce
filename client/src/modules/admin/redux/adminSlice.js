import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axios";
import toast from "react-hot-toast";

const initialState = {
  admin: null,
  employees: [],
  employee: null,
  tasks: [],
  projects: [],
  loading: false,
  error: null,
  dashboardInfo: {},
 
  
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.admin = action.payload;
    },
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
    setEmployee: (state, action) => {
      state.employee = action.payload;
    },
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
     addProject: (state, action) => {
    state.projects.unshift(action.payload);
  },
     addTask: (state, action) => {
    state.tasks.unshift(action.payload);
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
     setTasks: (state,action) => {
      state.tasks = action.payload
    }
    
    
  },

});

export const { 
    setAdmin,
    setEmployees, 
    setEmployee, 
    clearAdmin , 
    setLoading,
    setError,
    setDashboardInfo,
    setTasks,
    addTask,
    setProjects,
    addProject
  } = adminSlice.actions;
export default adminSlice.reducer;

export const getAdminDashboard = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await axiosInstance.get("/admin/dashboard");

        if (response.data.success) {
            dispatch(setDashboardInfo(response.data.stats))
          }
      
    } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch rides";
        dispatch(setError(message));
    } finally {
        dispatch(setLoading(false));
    }
};



export const getAllTasks = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await axiosInstance.get("/admin/tasks");

        if (response.data.success) {
            dispatch(setTasks(response.data.tasks))
          }
      
    } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch rides";
        toast(error.response?.data?.message)
        dispatch(setError(message));
    } finally {
        dispatch(setLoading(false));
    }
};


export const getAllUsers = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await axiosInstance.get("/admin/users");
        if (response.data.success) {
            dispatch(setEmployees(response.data.users))
            
          }
      
    } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch rides";
        toast(error.response?.data?.message)
        dispatch(setError(message));
    } finally {
        dispatch(setLoading(false));
    }
};



export const getAllProjects = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await axiosInstance.get("/admin/projects");

        if (response.data.success) {
            dispatch(setProjects(response.data.projects))
          }
      
    } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch rides";
        toast(error.response?.data?.message)
        dispatch(setError(message));
    } finally {
        dispatch(setLoading(false));
    }
};


// Add new Employees
export const addEmployee = (employee) => async (dispatch, getState) => {
  dispatch(setLoading(true));

  try {
    const { data } = await axiosInstance.post(
      "/admin/adduser",
      employee
    );

    if (data.success) {
      const currentEmployees =
        getState().admin.employees;

      dispatch(
        setEmployees([
          ...currentEmployees,
          data.employee,
        ])
      );
    }
  } catch (error) {
    dispatch(
      setError(
        error.response?.data?.message ||
          "Failed to add employee"
      )
    );
    toast(error.response?.data?.message)
  } finally {
    dispatch(setLoading(false));
  }
};


// Create New Task
export const createTask =
  (task) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {

      const { data } =
        await axiosInstance.post(
          "/admin/tasks",
          task
        );


       if (data.success) {
             dispatch(addTask(data.task));
            toast.success("Task created successfully");
        }
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to create task"
        )
      );
      toast(error.response?.data?.message)
    } finally {
      dispatch(setLoading(false));
    }
  };


// Create a Project
export const createProject =
  (project) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {

      const { data } =
        await axiosInstance.post(
          "/admin/project",
          project
        );

        if (data.success) {
             dispatch(addProject(data.project));
            toast.success("Project created successfully");
        }

    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to create task"
        )
      );
      toast(error.response?.data?.message)
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Get User Details By Id
  export const getUserDetailsById =
  (id) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {

      const {data} = await axiosInstance.get(`/admin/users/${id}`);

        if (data.success) {
          toast(data.message)
          dispatch(setEmployee(data.user))
        }

    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Failed to create task"
        )
      );
      toast(error.response?.data?.message)
    } finally {
      dispatch(setLoading(false));
    }
  };



export const addMembersToProject = async (projectId, members) => {
  try {
    const { data } = await axiosInstance.put(
      `/admin/projects/${projectId}/members`,
      { members },
      {
        withCredentials: true,
      }
    );
    if (data.success) {
      toast(data.message)
    }
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message,
      }
    );
  }
  toast(error.response?.data)
};

export const removeMembersFromProject = async (projectId, memberId) => {
  try {
    const { data } = await axiosInstance.put(
      `/admin/projects/${projectId}/members/delete`,
      { members : [memberId] },
      {
        withCredentials: true,
      }
    );
    if (data.success) {
      toast(data.message)
      return true
    }
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message,
      }
    );
  }
  // toast(error.response?.data)
};
export const deleteUserById = async (userId) => {
  try {
    const { data } = await axiosInstance.delete(`/admin/${userId}`,);
    if (data.success) {
      toast(`You Deleted ${data.user.name} Permanently`)
      
    }
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message,
      }
    );
  }
  // toast(error.response?.data)
};



// 
export const toogleAccountStatus = async (userId) => {
  try {
    const { data } = await axiosInstance.patch(`/admin/${userId}`,);
    if (data.success) {
      toast(data.message)
    }
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message,
      }
    );
  }
  // toast(error.response?.data)
};


// Update Company Details
export const updateCompanyInfo = async (formData) => {
  try {
        for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const { data } = await axiosInstance.patch(`/company`,formData);
    console.log(data)
    if (data.success) {
      toast(data.message)
    }
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: error.message,
      }
    );
  }
  // toast(error.response?.data)
};