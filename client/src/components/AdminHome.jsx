import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FolderKanban, LayoutDashboard, SquareCheckBig, Users, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: <LayoutDashboard size={18} /> },
  { label: "Users",     path: "/employees", icon: <Users size={18} /> },
  { label: "Tasks",     path: "/tasks",     icon: <SquareCheckBig size={18} /> },
  { label: "Projects",  path: "/projects",  icon: <FolderKanban size={18} /> },
  { label: "Settings",  path: "/settings",  icon: <FolderKanban size={18} /> },
];

// Desktop Sidebar
// Desktop Sidebar
function Sidebar({ collapsed, setCollapsed, user, isAdmin }) {
  const filtered = isAdmin ? navItems : navItems.filter((i) => i.path !== "/employees");
  const companyName = user?.company?.name || "CampusNest";
  const companyLogo = user?.company?.logo;

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-60"
      } hidden fixed z-30 bg-slate-900 border-r border-slate-800 md:flex flex-col h-screen flex-shrink-0 transition-all duration-300 shadow-2xl select-none`}
    >
      {/* Logo / Header */}
      <div className="flex items-center justify-between px-3.5 py-4 border-b border-slate-800/80">
        {!collapsed ? (
          <div className="flex items-center gap-3 min-w-0 pr-1">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center font-extrabold text-indigo-400 text-xs overflow-hidden flex-shrink-0 shadow-inner">
              {companyLogo ? (
                <img src={companyLogo} alt={companyName} className="w-full h-full object-cover" />
              ) : (
                companyName.slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-extrabold tracking-tight text-white truncate">
                {companyName}
              </h2>
              <span className="inline-block text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {isAdmin ? "Admin Workspace" : "Employee View"}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400 text-xs overflow-hidden shadow-md">
            {companyLogo ? (
              <img src={companyLogo} alt={companyName} className="w-full h-full object-cover" />
            ) : (
              companyName.slice(0, 2).toUpperCase()
            )}
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
          aria-label="Toggle collapse"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 space-y-1 px-3 overflow-y-auto">
        {filtered.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 ring-1 ring-indigo-400/30"
                  : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
              } ${collapsed ? "justify-center px-0" : ""}`
            }
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/50">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-md overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.slice(0, 2).toUpperCase() || "CN"
              )}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden min-w-0">
              <p className="text-slate-200 text-xs font-semibold truncate">{user?.name || "User"}</p>
              <p className="text-slate-500 text-[11px] truncate">{user?.email || ""}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

// Mobile Drawer 
function MobileDrawer({ open, onClose, user, isAdmin }) {
  const filtered = isAdmin ? navItems : navItems.filter((i) => i.path !== "/employees");
  const companyName = user?.company?.name || "CampusNest";
  const companyLogo = user?.company?.logo;

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
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400 text-xs overflow-hidden flex-shrink-0">
              {companyLogo ? (
                <img src={companyLogo} alt={companyName} className="w-full h-full object-cover" />
              ) : (
                companyName.slice(0, 2).toUpperCase()
              )}
            </div>
            <span className="text-white font-bold text-sm truncate">
              {companyName}
            </span>
          </div>
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

//  Mobile Bottom Tab Bar 
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

//  Root App 
export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { user: userAuth } = useSelector((state) => state.auth);
  const { user: userSlice } = useSelector((state) => state.user);
  const user = userSlice || userAuth;

  const isAdmin = user?.role === "admin";

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

      {/* Mobile bottom tab bar */}
      <BottomNav isAdmin={isAdmin} />
    </div>
  );
}