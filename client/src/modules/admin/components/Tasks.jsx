import React, { useEffect, useState } from 'react'
import { priorityBadge, statusBadge } from '../data';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTasks } from '../redux/adminSlice';
import AddTaskModal from './AddTaskModal';
import { getMyTasks, getProfile } from '../redux/userSlice';
import { Link } from 'react-router';

const statusMeta = (status) => {
  switch (status) {
    case "completed":        return { dot: "bg-emerald-400", bar: "bg-emerald-400" };
    case "in_progress": return { dot: "bg-blue-400",    bar: "bg-blue-400" };
    case "review":      return { dot: "bg-violet-400",  bar: "bg-violet-400" };
    default:            return { dot: "bg-slate-600",   bar: "bg-slate-600" };
  }
};

const Tasks = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Todo", "In Progress", "Done"];
  const [newTask, setNewTask] = useState(false);

  const { user } = useSelector((state) => state.user);
  const isAdmin = user?.role === "admin";

  const { tasks: adminTasks } = useSelector((state) => state.admin);
  const { tasks: userTasks }  = useSelector((state) => state.user);
  const tasks = isAdmin ? adminTasks : userTasks;

  useEffect(() => {
    dispatch(getProfile());
    if (isAdmin) dispatch(getAllTasks());
    else dispatch(getMyTasks());
  }, [dispatch, isAdmin]);

  const filtered = filter === "All" ? tasks : tasks.filter(t => t.status === filter);

  const statusCounts = statuses.reduce((acc, s) => {
    acc[s] = s === "All" ? tasks.length : tasks.filter(t => t.status === s).length;
    return acc;
  }, {});

  return (
    <div style={{ backgroundColor: user.company.primaryColor }} className="min-h-screen ml-38 md:ml-58  px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-indigo-400 uppercase tracking-widest mb-1">Workspace</p>
            <h1 className="text-2xl font-semibold text-white">Tasks</h1>
          </div>
          {isAdmin && (
            <button
              onClick={() => setNewTask(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center"
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
            { label: "Total",       count: tasks.length,                                      color: "text-slate-200" },
            { label: "In Progress", count: tasks.filter(t => t.status === "in_progress").length, color: "text-blue-400" },
            { label: "Review",      count: tasks.filter(t => t.status === "review").length,   color: "text-violet-400" },
            { label: "Done",        count: tasks.filter(t => t.status === "completed").length,     color: "text-emerald-400" },
          ].map(({ label, count, color }) => (
            <div style={{ backgroundColor: user.company.secondaryColor }} key={label} className=" border border-slate-800 rounded-xl px-4 py-3">
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
                  ? "bg-indigo-600 text-white"
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
          <div className="text-center py-20 text-slate-600">
            <svg className="w-9 h-9 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm">No tasks here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(t => {
              const { dot, bar } = statusMeta(t.status);
              return (
                <Link to={`/task/${t._id}`} key={t._id} className="group block">
                  <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 h-full hover:border-slate-600 transition-colors overflow-hidden">

                    {/* Top colored bar */}
                    <div className={`absolute top-0 left-0 right-0 h-0.5 ${bar} opacity-60`} />

                    {/* Top row: status dot + priority badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 ">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
                        <span className="text-xs text-gray-400">{t.status}</span>
                      </div>
                      <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${priorityBadge(t.priority)}`}>
                        {t.priority}
                      </span>
                    </div>

                    {/* Title + project */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-100 group-hover:text-white leading-snug transition-colors line-clamp-2">
                        {t.title}
                      </p>
                      {t.project && (
                        <p className="text-xs text-slate-500 mt-1 truncate">{t.project}</p>
                      )}
                    </div>

                    {/* Footer: assignee + due */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Avatar placeholder */}
                        <div className="px-2 h-6 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-[9px] font-bold text-indigo-300 uppercase">
                            {
                              isAdmin ? <div>Assigned To : {t?.assignedTo?.name}</div> : <div>Assigned By : {t?.assignedBy?.name}</div> 
                            }
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 truncate">{t.assignee}</span>
                      </div>
                      <span className="text-[11px] text-slate-600 flex-shrink-0 ml-2">
                        {t.due}
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