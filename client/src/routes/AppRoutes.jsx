import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

// import AdminHome from "../modules/admin/AdminHome";
import LoginPanel from "../modules/authentication/Login";
import TaskDetail from "../modules/admin/components/TaskDetails";
import ProjectDetail from "../modules/admin/components/ProjectDetails";

import ProtectedRoute from "../guards/ProtectedRoute"
import Tasks from "../modules/admin/components/Tasks";
import Projects from "../modules/admin/components/Projects";
import Dashboard from "../modules/admin/components/Dashboard";
import Employees from "../modules/admin/components/Employees";
import UserDetail from "../modules/admin/components/UserDetails";
import EmployeeProfileSettings from "../modules/admin/components/Settings";

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