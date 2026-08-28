import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllTasks } from '../redux/adminSlice';
import AddTaskModal from './AddTaskModal';
import { getMyTasks, getProfile } from '../redux/userSlice';
import { Link } from 'react-router-dom';

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

const Tasks = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("All");
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

  const matchesFilter = (tStatus, f) => {
    if (f === "All") return true;
    return tStatus === filterMap[f];
  };

  const filtered = tasks.filter(t => matchesFilter(t.status, filter));

  const statusCounts = statuses.reduce((acc, s) => {
    acc[s] = s === "All" ? tasks.length : tasks.filter(t => matchesFilter(t.status, s)).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen pb-24 md:pb-5 md:ml-60 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-accent   uppercase tracking-widest mb-1">Workspace</p>
            <h1 className="text-2xl font-semibold ">Tasks</h1>
          </div>
          {isAdmin && (
            <button
              onClick={() => setNewTask(true)}
              className="inline-flex bg-primary text-white items-center gap-2   text-sm font-medium px-4 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Task
            </button>
          )}
        </div>

        {/* Modal */}
        {newTask && <AddTaskModal onClose={() => setNewTask(false)} />}

        {/* ── Stats strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total",       count: tasks.length,                                      color: "text-slate-600" },
            { label: "In Progress", count: tasks.filter(t => t.status === "in_progress").length, color: "text-blue-400" },
            { label: "Review",      count: tasks.filter(t => t.status === "review").length,   color: "text-violet-400" },
            { label: "Done",        count: tasks.filter(t => t.status === "completed").length,     color: "text-emerald-400" },
          ].map(({ label, count, color }) => (
            <div  key={label} className="border border-slate-800 rounded-xl px-4 py-3">
              <p className={`text-xl font-semibold ${color}`}>{count}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Filter pills ── */}
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
            <button
            
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === s
                  ? "bg-primary text-white"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-600"
              }`}
            >
              {s}
              {statusCounts[s] > 0 && (
                <span className={`ml-1.5 ${filter === s ? "text-indigo-200" : "text-slate-600"}`}>
                  {statusCounts[s]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Card Grid ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <svg className="w-10 h-10 mx-auto mb-3 text-slate-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm font-semibold text-slate-300">No tasks found</p>
            <p className="text-xs text-slate-500 mt-1">There are no tasks matching "{filter}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(t => {
              const { dot, bar } = statusMeta(t.status);
              const priorityBg =
                t.priority === "high"
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  : t.priority === "medium"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-slate-500/10 text-slate-400 border-slate-500/20";

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
                      {t.dueDate && (
                        <span className="text-slate-500 text-[11px]">
                          {new Date(t.dueDate).toLocaleDateString()}
                        </span>
                      )}
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