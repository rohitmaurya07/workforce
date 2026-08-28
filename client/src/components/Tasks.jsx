import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTasks } from "../redux/adminSlice";
import AddTaskModal from "./AddTaskModal";
import { getMyTasks, getProfile } from "../redux/userSlice";
import { Link } from "react-router-dom";
import { Calendar, Clock, Plus, Filter, CheckCircle2, ChevronRight } from "lucide-react";

const statusMeta = (status) => {
  switch (status) {
    case "completed":   return { dot: "bg-emerald-400", bar: "bg-emerald-400" };
    case "in_progress": return { dot: "bg-blue-400",    bar: "bg-blue-400" };
    case "todo":        return { dot: "bg-amber-400",   bar: "bg-amber-400" };
    default:            return { dot: "bg-slate-600",   bar: "bg-slate-600" };
  }
};

const filterMap = {
  "All": "All",
  "Todo": "todo",
  "In Progress": "in_progress",
  "Done": "completed",
};

const isSameDay = (dateString, targetDate) => {
  if (!dateString) return false;
  const d1 = new Date(dateString);
  const d2 = new Date(targetDate);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const Tasks = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("All");
  const [dateMode, setDateMode] = useState("all"); // 'all' | 'today' | 'yesterday' | 'custom'
  const [customDate, setCustomDate] = useState("");
  const statuses = ["All", "Todo", "In Progress", "Done"];
  const [newTask, setNewTask] = useState(false);

  const { user: userAuth } = useSelector((state) => state.auth);
  const { user: userSlice } = useSelector((state) => state.user);
  const user = userSlice || userAuth;
  const isAdmin = user?.role === "admin";

  const { tasks: adminTasks } = useSelector((state) => state.admin);
  const { tasks: userTasks }  = useSelector((state) => state.user);
  const tasks = (isAdmin ? adminTasks : userTasks) || [];

  useEffect(() => {
    dispatch(getProfile());
    if (isAdmin) dispatch(getAllTasks());
    else dispatch(getMyTasks());
  }, [dispatch, isAdmin]);

  const matchesStatus = (tStatus, f) => {
    if (f === "All") return true;
    return tStatus === filterMap[f];
  };

  const matchesDateFilter = (task) => {
    if (dateMode === "all") return true;

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const taskDate = task.dueDate || task.createdAt;

    if (dateMode === "today") {
      return isSameDay(taskDate, today);
    }
    if (dateMode === "yesterday") {
      return isSameDay(taskDate, yesterday);
    }
    if (dateMode === "custom" && customDate) {
      return isSameDay(taskDate, customDate);
    }

    return true;
  };

  const filtered = tasks.filter((t) => matchesStatus(t.status, filter) && matchesDateFilter(t));

  const todayCount = tasks.filter((t) => isSameDay(t.dueDate || t.createdAt, new Date())).length;
  const yesterdayCount = tasks.filter((t) => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return isSameDay(t.dueDate || t.createdAt, d);
  }).length;

  const statusCounts = statuses.reduce((acc, s) => {
    acc[s] = s === "All" ? tasks.length : tasks.filter((t) => matchesStatus(t.status, s)).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen pb-24 md:pb-5 md:ml-60 px-4 py-6 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Clock size={14} /> Workspace Taskboard
            </p>
            <h1 className="text-2xl font-extrabold text-white">Tasks & Activities</h1>
          </div>
          {isAdmin && (
            <button
              onClick={() => setNewTask(true)}
              className="inline-flex bg-indigo-600 hover:bg-indigo-500 text-white items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all w-full sm:w-auto justify-center"
            >
              <Plus size={16} />
              New Task
            </button>
          )}
        </div>

        {/* Modal */}
        {newTask && <AddTaskModal onClose={() => setNewTask(false)} />}

        {/* ── Stats strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Tasks",       count: tasks.length,                                      color: "text-slate-200" },
            { label: "In Progress", count: tasks.filter(t => t.status === "in_progress").length, color: "text-blue-400" },
            { label: "Review",      count: tasks.filter(t => t.status === "review").length,   color: "text-violet-400" },
            { label: "Completed",        count: tasks.filter(t => t.status === "completed").length,     color: "text-emerald-400" },
          ].map(({ label, count, color }) => (
            <div key={label} className="bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-3.5 shadow-lg">
              <p className={`text-2xl font-extrabold ${color}`}>{count}</p>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Filtering Panel: Status & Date Filters ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl">
          {/* Date Wise Tasks Filter Section */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Calendar size={14} className="text-indigo-400" /> Filter by Date Range
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "all", label: "All Tasks", count: tasks.length },
                { id: "today", label: "Today's Tasks", count: todayCount },
                { id: "yesterday", label: "Yesterday's Tasks", count: yesterdayCount },
                { id: "custom", label: "Select Date", count: null },
              ].map((d) => {
                const isSelected = dateMode === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      setDateMode(d.id);
                      if (d.id !== "custom") setCustomDate("");
                    }}
                    className={`inline-flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl font-semibold transition ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                    }`}
                  >
                    <span>{d.label}</span>
                    {d.count !== null && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isSelected ? "bg-indigo-700 text-indigo-100" : "bg-slate-800 text-slate-400"}`}>
                        {d.count}
                      </span>
                    )}
                  </button>
                );
              })}

              {dateMode === "custom" && (
                <div className="flex items-center gap-2 ml-1">
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-indigo-500"
                  />
                  {customDate && (
                    <span className="text-xs text-indigo-400 font-mono font-semibold">
                      {new Date(customDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-3" />

          {/* Status Filter Section */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Filter size={14} className="text-indigo-400" /> Filter by Status
            </span>
            <div className="flex gap-2 flex-wrap">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition ${
                    filter === s
                      ? "bg-slate-800 text-white border border-indigo-500/40 shadow"
                      : "bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {s}
                  {statusCounts[s] > 0 && (
                    <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${filter === s ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"}`}>
                      {statusCounts[s]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Card Grid ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <Calendar className="w-10 h-10 mx-auto mb-3 text-slate-600" />
            <p className="text-sm font-semibold text-slate-300">No tasks found</p>
            <p className="text-xs text-slate-500 mt-1">
              No tasks match status "{filter}" and date filter "{dateMode === "custom" ? customDate || "Custom" : dateMode}".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((t) => {
              const { dot, bar } = statusMeta(t.status);
              const priorityBg =
                t.priority === "high"
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  : t.priority === "medium"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-slate-500/10 text-slate-400 border-slate-500/20";

              const dateDisplay = t.dueDate ? new Date(t.dueDate).toLocaleDateString() : t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "No Date";

              return (
                <Link to={`/task/${t._id}`} key={t._id} className="group block">
                  <div className="relative bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 flex flex-col gap-4 h-full shadow-lg hover:shadow-indigo-500/5 transition-all duration-200 overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-1 ${bar}`} />

                    {/* Status + Priority */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${dot}`} />
                        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          {t.status === "in_progress" ? "In Progress" : t.status === "completed" ? "Completed" : "Todo"}
                        </span>
                      </div>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${priorityBg}`}>
                        {t.priority || "medium"}
                      </span>
                    </div>

                    {/* Title */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                        {t.title}
                      </h3>
                      {t.description && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{t.description}</p>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                      <span className="text-slate-400 font-medium truncate">
                        {isAdmin ? `To: ${t?.assignedTo?.name || "Unassigned"}` : `By: ${t?.assignedBy?.name || "Admin"}`}
                      </span>
                      <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                        <Calendar size={12} className="text-indigo-400" />
                        {dateDisplay}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;