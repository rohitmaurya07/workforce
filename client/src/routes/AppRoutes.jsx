import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

// import AdminHome from "../modules/admin/AdminHome";
import LoginPanel from "../components/Login";
import TaskDetail from "../components/TaskDetails";
import ProjectDetail from "../components/ProjectDetails";

import ProtectedRoute from "../guards/ProtectedRoute"
import Tasks from "../components/Tasks";
import Projects from "../components/Projects";
import Dashboard from "../components/Dashboard";
import Employees from "../components/Employees";
import UserDetail from "../components/UserDetails";
import EmployeeProfileSettings from "../components/Settings";

export const router = createBrowserRouter([
  // Public Routes
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPanel />,
      },
    ],
  },

  // Protected Routes
 {
    path: "/",  
    element: (
        <ProtectedRoute>
            <MainLayout />
        </ProtectedRoute>
    ),
    children: [
        {
            index: true,
            element: <Dashboard />,
        },
        {
            path: "admin",
            element: <Dashboard />,
        },
        {
            path: "user/:id",
            element: <UserDetail />,
        },
        {
            path: "employees",
            element: <Employees />,
        },
        {
            path: "tasks",
            element: <Tasks />,
        },
        {
            path: "settings",
            element: <EmployeeProfileSettings />,
        },
        {
            path: "task/:id",
            element: <TaskDetail />,
        },
        {
            path: "projects",
            element: <Projects />,
        },
        {
            path: "project/:id",
            element: <ProjectDetail />,
        },
    ]
}
]);