import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminDashboard } from '../redux/adminSlice'
import { getUserDashboard, getProfile } from '../redux/userSlice'

const StatCard = ({ label, value, icon, user }) => (
  <div style={{ backgroundColor: user?.company.secondaryColor }} className=" border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <span className="text-slate-600 text-base">{icon}</span>
    </div>
    <p className="text-2xl font-semibold text-white">{value ?? '—'}</p>
  </div>
)

const Dashboard = () => {
  const dispatch = useDispatch()
  const { dashboardInfo: adminDash } = useSelector((state) => state.admin)
  const { dashboardInfo: userDash, user } = useSelector((state) => state.user)
  const isAdmin = user?.role === 'admin'
  const d = isAdmin ? adminDash : userDash

  useEffect(() => {
    dispatch(getProfile())
    if (isAdmin) dispatch(getAdminDashboard())
    else dispatch(getUserDashboard())
  }, [dispatch, isAdmin])

  const adminStats = [
    { label: 'Total Projects',   value: d?.totalProjects,   icon: '◈' },
    { label: 'Total Users',      value: d?.totalUsers,      icon: '◉' },
    { label: 'Total Tasks',      value: d?.totalTasks,      icon: '✓' },
    { label: 'Completed Tasks',  value: d?.completedTasks,  icon: '⬡' },
  ]

  const userStats = [
    { label: 'Pending Tasks',    value: d?.pendingTasks,    icon: '◈' },
    { label: 'In Progress',      value: d?.inProgressTasks, icon: '◉' },
    { label: 'Total Tasks',      value: d?.totalTasks,      icon: '✓' },
    { label: 'Completed Tasks',  value: d?.completedTasks,  icon: '⬡' },
  ]

  const stats = isAdmin ? adminStats : userStats

  // Derive a simple completion % for the visual ring
  const completedCount = d?.completedTasks ?? 0
  const totalCount     = d?.totalTasks ?? 0
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const circumference = 2 * Math.PI * 36
  const dash = (pct / 100) * circumference

  return (
    <div style={{ backgroundColor: user?.company?.primaryColor }} className="min-h-screen ml-38 md:ml-58  px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <p className="text-xs font-medium text-indigo-400 uppercase tracking-widest mb-1">Overview</p>
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Welcome back, <span className="text-slate-300">{user?.name ?? 'there'}</span>. Here's what's happening today.
          </p>
        </div>

        {/* Stat cards */}
        <div  className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map(s => (
            <StatCard user={user} key={s.label} {...s} />
          ))}
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Completion ring */}
          <div style={{ backgroundColor: user?.company.secondaryColor }} className=" border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-3">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Task Completion</p>
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
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
                <span className="text-xl font-bold text-white">{pct}%</span>
              </div>
            </div>
            <div className="flex gap-4 text-center">
              <div>
                <p className="text-base font-semibold text-emerald-400">{completedCount}</p>
                <p className="text-[11px] text-slate-500">Done</p>
              </div>
              <div className="w-px bg-slate-800" />
              <div>
                <p className="text-base font-semibold text-slate-300">{totalCount}</p>
                <p className="text-[11px] text-slate-500">Total</p>
              </div>
            </div>
          </div>

          {/* Status breakdown */}
          <div style={{ backgroundColor: user?.company?.secondaryColor }} className="lg:col-span-2 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Status Breakdown</p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Completed',   value: d?.completedTasks,  color: 'bg-emerald-400', textColor: 'text-emerald-400' },
                { label: 'In Progress', value: d?.inProgressTasks, color: 'bg-blue-400',    textColor: 'text-blue-400' },
                { label: 'Pending',     value: d?.pendingTasks,    color: 'bg-violet-400',  textColor: 'text-violet-400' },
              ].map(({ label, value, color, textColor }) => {
                const barPct = totalCount > 0 ? Math.round(((value ?? 0) / totalCount) * 100) : 0
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-slate-400">{label}</span>
                      <span className={`text-xs font-semibold ${textColor}`}>{value ?? 0}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${color} transition-all duration-700`}
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Admin-only: extra counts */}
        {isAdmin && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center gap-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-indigo-400 text-lg">◈</span>
              </div>
              <div>
                <p className="text-2xl font-semibold text-white">{d?.totalProjects ?? '—'}</p>
                <p className="text-xs text-slate-500 mt-0.5">Active Projects</p>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center gap-5">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-violet-400 text-lg">◉</span>
              </div>
              <div>
                <p className="text-2xl font-semibold text-white">{d?.totalUsers ?? '—'}</p>
                <p className="text-xs text-slate-500 mt-0.5">Team Members</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard