import { Outlet } from "react-router-dom";
import Sidebar from "../modules/admin/AdminHome";
// import Header from "../components/Header";

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