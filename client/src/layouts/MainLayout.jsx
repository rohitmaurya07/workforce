import { Outlet } from "react-router-dom";
import Sidebar from "../components/AdminHome";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1">
        {/* <Header /> */}

        <div className="">
          <Outlet />
        </div>
      </main>
    </div>
  );
}