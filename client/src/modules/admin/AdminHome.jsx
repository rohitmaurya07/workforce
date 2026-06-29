import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminDashboard } from "./redux/adminSlice";
import { getProfile } from "./redux/userSlice";
import { FolderKanban, LayoutDashboard, SquareCheckBig, Users, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: <LayoutDashboard size={18} /> },
  { label: "Users",     path: "/employees", icon: <Users size={18} /> },
  { label: "Tasks",     path: "/tasks",     icon: <SquareCheckBig size={18} /> },
  { label: "Projects",  path: "/projects",  icon: <FolderKanban size={18} /> },
];

/* ── Desktop Sidebar ─────────────────────────────────────────── */
function Sidebar({ collapsed, setCollapsed, user, isAdmin }) {
  const filtered = isAdmin ? navItems : navItems.filter(i => i.path !== "/employees");

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-60"
      } hidden md:flex flex-col bg-slate-900 min-h-screen flex-shrink-0 transition-all duration-200`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-800">
        {!collapsed && (
          <span className="text-white font-bold text-base tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            WorkForce
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white ml-auto p-1 rounded-lg hover:bg-slate-800 transition"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-0.5 px-2">
        {filtered.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? "bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-600/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-slate-800">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.name?.slice(0, 2).toUpperCase() || "RA"}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-white text-xs font-medium truncate">{user?.name}</p>
              <p className="text-slate-500 text-xs truncate">{user?.email}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

/* ── Mobile Drawer ───────────────────────────────────────────── */
function MobileDrawer({ open, onClose, user, isAdmin }) {
  const filtered = isAdmin ? navItems : navItems.filter(i => i.path !== "/employees");

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 flex flex-col transform transition-transform duration-200 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-800">
          <span className="text-white font-bold text-base bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            WorkForce
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {filtered.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-600/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.slice(0, 2).toUpperCase() || "RA"}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-xs font-medium truncate">{user?.name}</p>
              <p className="text-slate-500 text-xs truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ── Mobile Bottom Tab Bar ───────────────────────────────────── */
function BottomNav({ isAdmin }) {
  const filtered = isAdmin ? navItems : navItems.filter(i => i.path !== "/employees");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900 border-t border-slate-800 md:hidden">
      <div className="flex">
        {filtered.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
                isActive ? "text-indigo-400 font-medium" : "text-slate-500 hover:text-slate-300"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`p-1 rounded-lg ${isActive ? "bg-indigo-600/20" : ""}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

/* ── Root App ────────────────────────────────────────────────── */
export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isAdmin) dispatch(getProfile());
  }, [dispatch, isAdmin]);

  useEffect(() => {
    dispatch(getAdminDashboard());
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans">
      {/* Desktop sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        user={user}
        isAdmin={isAdmin}
      />

      {/* Mobile drawer */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={user}
        isAdmin={isAdmin}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
     

        {/* Page content */}
        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          {/* <Outlet /> */}
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <BottomNav isAdmin={isAdmin} />
    </div>
  );
}