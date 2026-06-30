import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { deleteTaskById, getTaskById, updateTaskStatus } from "../redux/userSlice";
import Chat from "./Chat";

const priorityConfig = {
  High:   { dot: "bg-red-400",     badge: "bg-red-500/10 text-red-400 ring-1 ring-red-500/20" },
  Medium: { dot: "bg-amber-400",   badge: "bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20" },
  Low:    { dot: "bg-emerald-400", badge: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20" },
};

const statusConfig = {
  Todo:        { label: "To Do",       bar: "bg-slate-500",   badge: "bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/20" },
  "In Progress":{ label: "In Progress", bar: "bg-blue-400",    badge: "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20" },
  Review:      { label: "Review",      bar: "bg-violet-400",  badge: "bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20" },
  Done:        { label: "Done",        bar: "bg-emerald-400", badge: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20" },
};

const Avatar = ({ name, size = "md" }) => {
  const initials = name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() ?? "?";
  const sz = size === "sm" ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-xs";
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white flex-shrink-0`}>
      {initials}
    </div>
  );
};

const MetaRow = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{label}</span>
    <div className="text-sm font-medium text-slate-200">{children}</div>
  </div>
);

const TaskDetail = () => {
  const { task } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [comment, setComment] = useState("");

  const isAdmin = user?.role === "admin";

  useEffect(() => { dispatch(getTaskById(id)); }, [id]);
  useEffect(() => { if (task?.status) setSelectedStatus(task.status); }, [task]);

  if (!task) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto">
          <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-slate-500 text-sm">Task not found.</p>
      </div>
    </div>
  );

  const priority = priorityConfig[task.priority] || priorityConfig.Low;
  const status   = statusConfig[task.status]     || statusConfig.Todo;

  const handleUpdateTaskStatus = () => dispatch(updateTaskStatus({ id: task._id, status: selectedStatus }));
  const handleDeleteTask = () => { dispatch(deleteTaskById(task._id)); navigate("/tasks"); };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-4">

        {/* ── Back + Breadcrumb ── */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-800"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <span className="text-xs text-slate-600">{task.projectId?.name}</span>
          <span className="text-slate-700 text-xs">/</span>
          <span className="text-xs text-slate-400 truncate">{task.title}</span>
        </div>

        {/* ── Header Card ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          {/* colored top bar */}
          <div className={`h-0.5 w-full ${status.bar}`} />
          <div className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl font-semibold text-white leading-snug">{task.title}</h1>
                {task.description && (
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed">{task.description}</p>
                )}
              </div>
              <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${priority.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                  {task.priority}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.badge}`}>
                  {status.label}
                </span>
              </div>
            </div>

            {/* Footer strip */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                Due{" "}
                <span className="text-slate-300 font-medium">
                  {new Date(task.dueDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
              {isAdmin && (
                <button
                  onClick={handleDeleteTask}
                  className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Delete Task
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Details + Actions ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Task Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-5">Task Details</p>
            <div className="space-y-5">
              <MetaRow label="Project">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-sm bg-indigo-500" />
                  {task.projectId?.name ?? "—"}
                </div>
              </MetaRow>
              <MetaRow label="Assigned To">
                <div className="flex items-center gap-2">
                  <Avatar name={task.assignedTo?.name} size="sm" />
                  {task.assignedTo?.name ?? "—"}
                </div>
              </MetaRow>
              <MetaRow label="Created By">
                <div className="flex items-center gap-2">
                  <Avatar name={task.assignedBy?.name} size="sm" />
                  {task.assignedBy?.name ?? "—"}
                </div>
              </MetaRow>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-5">Actions</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Update Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60 transition-all cursor-pointer"
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Done</option>
                </select>
              </div>
              <button
                onClick={handleUpdateTaskStatus}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
              >
                Save Status
              </button>
              <button className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                Upload Work
              </button>
            </div>
          </div>
        </div>

      {/* Comments */}
      <Chat/> 

      </div>
    </div>
  );
};

export default TaskDetail;