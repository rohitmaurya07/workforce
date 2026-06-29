import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { router } from "./routes/AppRoutes";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "./modules/authentication/redux/authSlice";
import { useEffect } from "react";
import { getMyProjects, getProfile, getUserDashboard } from "./modules/admin/redux/userSlice";
import { getAdminDashboard, getAllProjects, getAllUsers } from "./modules/admin/redux/adminSlice";

const App = () => {
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

// useEffect(() => {
//   dispatch(getCurrentUser());
//   dispatch(getProfile())
//   if (isAdmin) {
//     dispatch(getAdminDashboard());
//     dispatch(getAllUsers());
//     dispatch(getAllProjects());
//   } else {
//     dispatch(getUserDashboard());
//     dispatch(getMyProjects());
//   }
// }, [dispatch,isAdmin]);

useEffect(() => {
  dispatch(getCurrentUser());
}, [dispatch]);

useEffect(() => {
  if (!user) return;

  dispatch(getProfile());

  if (user.role === "admin") {
    dispatch(getAdminDashboard());
    dispatch(getAllUsers());
    dispatch(getAllProjects());
  } else {
    dispatch(getUserDashboard());
    dispatch(getMyProjects());
  }
}, [dispatch, user]);


if (authLoading) {
  return <h1>Loading...</h1>;
}

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
};

export default App;