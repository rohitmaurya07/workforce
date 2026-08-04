import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { router } from "./routes/AppRoutes";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { socket } from "./socket/socket";
import "./App.css";
import { getMyProjects, getProfile, getUserDashboard } from "./redux/userSlice";
import { getCurrentUser } from "./redux/authSlice";
import { getAdminDashboard, getAllProjects, getAllUsers } from "./redux/adminSlice";


const App = () => {
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const { user : nuser,  } = useSelector((state) => state.user);
  const isAdmin = user?.role === "admin";
  console.log("In the App ",nuser)


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

    useEffect(() => {

        socket.on("connect", () => {
            console.log("Connected");
        });

        return () => {
            socket.off("connect");
        };

    }, []);

useEffect(() => {
 document.documentElement.style.setProperty("--accent", "#6366F1");
}, [])



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