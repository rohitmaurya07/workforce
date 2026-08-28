import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminDashboard } from '../redux/adminSlice'
import { getUserDashboard, getProfile } from '../redux/userSlice'

const StatCard = ({ label, value, icon, color = "from-indigo-500/20 to-purple-500/20 border-indigo-500/30 text-indigo-400" }) => (
  <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-xl group">
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} border flex items-center justify-center font-bold text-sm group-hover:scale-110 transition duration-200`}>
        {icon}
      </div>
    </div>
    <p className="text-3xl font-extrabold text-white mt-4">{value ?? "0"}</p>
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboardInfo: adminDash } = useSelector((state) => state.admin);
  const { dashboardInfo: userDash, user: userSlice } = useSelector((state) => state.user);
  const { user: authUser } = useSelector((state) => state.auth);
  const user = userSlice || authUser;
  const isAdmin = user?.role === "admin";
  const d = isAdmin ? adminDash : userDash;

  useEffect(() => {
    dispatch(getProfile());
    if (isAdmin) dispatch(getAdminDashboard());
    else dispatch(getUserDashboard());
  }, [dispatch, isAdmin]);

  const adminStats = [
    { label: "Total Projects", value: d?.totalProjects, icon: "◈", color: "from-indigo-500/20 to-purple-500/20 border-indigo-500/30 text-indigo-400" },
    { label: "Team Members", value: d?.totalUsers, icon: "◉", color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400" },
    { label: "Total Tasks", value: d?.totalTasks, icon: "✓", color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400" },
    { label: "Completed Tasks", value: d?.completedTasks, icon: "⬡", color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400" },
  ];

  const userStats = [
    { label: "Pending Tasks", value: d?.pendingTasks, icon: "◈", color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400" },
    { label: "In Progress", value: d?.inProgressTasks, icon: "◉", color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400" },
    { label: "Total Assigned", value: d?.totalTasks, icon: "✓", color: "from-indigo-500/20 to-purple-500/20 border-indigo-500/30 text-indigo-400" },
    { label: "Completed", value: d?.completedTasks, icon: "⬡", color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400" },
  ];

  const stats = isAdmin ? adminStats : userStats;

  const completedCount = d?.completedTasks ?? 0;
  const totalCount = d?.totalTasks ?? 0;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const circumference = 2 * Math.PI * 36;
  const dash = (pct / 100) * circumference;

  return (
    <div className="min-h-screen pb-24 md:pb-6 md:ml-60 px-4 py-6 sm:px-6 lg:px-8 bg-slate-950 font-sans text-slate-100">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">Workspace Overview</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">
              Welcome back, <span className="text-indigo-400 font-semibold">{user?.name ?? "Member"}</span>. Here's your workspace activity overview.
            </p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 self-start sm:self-auto">
            {user?.company?.name || "CampusNest Workspace"}
          </span>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Completion ring */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Task Completion Rate</p>
            <div className="relative w-28 h-28">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="36" fill="none" stroke="#1e293b" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="36"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${dash} ${circumference}`}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-extrabold text-white">{pct}%</span>
              </div>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-lg font-bold text-emerald-400">{completedCount}</p>
                <p className="text-[11px] text-slate-400 uppercase font-medium">Completed</p>
              </div>
              <div className="w-px bg-slate-800" />
              <div>
                <p className="text-lg font-bold text-slate-200">{totalCount}</p>
                <p className="text-[11px] text-slate-400 uppercase font-medium">Total Tasks</p>
              </div>
            </div>
          </div>

          {/* Status breakdown */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between gap-4 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Task Status Distribution</p>
            <div className="flex flex-col gap-4">
              {[
                { label: "Completed", value: d?.completedTasks, color: "bg-emerald-400", textColor: "text-emerald-400" },
                { label: "In Progress", value: d?.inProgressTasks, color: "bg-blue-400", textColor: "text-blue-400" },
                { label: "Pending", value: d?.pendingTasks, color: "bg-amber-400", textColor: "text-amber-400" },
              ].map(({ label, value, color, textColor }) => {
                const barPct = totalCount > 0 ? Math.round(((value ?? 0) / totalCount) * 100) : 0;
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-slate-300">{label}</span>
                      <span className={`text-xs font-bold ${textColor}`}>{value ?? 0} ({barPct}%)</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full ${color} transition-all duration-700`}
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard