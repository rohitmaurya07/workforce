import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { deleteTaskById, getTaskById, updateTaskStatus, uploadTaskSubmission } from "../redux/userSlice";
import Chat from "./Chat";
import { Upload, File, Loader2, FileX, Download, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const priorityConfig = {
  High: { dot: "bg-red-400", badge: "bg-red-500/10 text-red-400 ring-1 ring-red-500/20" },
  Medium: { dot: "bg-amber-400", badge: "bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20" },
  Low: { dot: "bg-emerald-400", badge: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20" },
};

const statusConfig = {
  Todo: { label: "To Do", bar: "bg-slate-500", badge: "bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/20" },
  "In Progress": { label: "In Progress", bar: "bg-blue-400", badge: "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20" },
  Review: { label: "Review", bar: "bg-violet-400", badge: "bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20" },
  Done: { label: "Done", bar: "bg-emerald-400", badge: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20" },
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
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

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
  const status = statusConfig[task.status] || statusConfig.Todo;

  const handleUpdateTaskStatus = () => dispatch(updateTaskStatus({ id: task._id, status: selectedStatus }));
  const handleDeleteTask = () => { dispatch(deleteTaskById(task._id)); navigate("/tasks"); };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setLoading(true);

      const res = await uploadTaskSubmission(
        task._id,
        selectedFile
      );

      toast.success(res.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

 const formatSize = (bytes) => {
    if (bytes == null) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

// inside your component:
const safeFiles = task.attachments || [];

  return (
    <div className="min-h-screen pb-24 md:pb-6 md:ml-60 px-4 py-6 sm:px-6 lg:px-8 bg-slate-950 font-sans text-slate-100">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── Back + Breadcrumb ── */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-900 border border-slate-800"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <span className="text-slate-400">{task.projectId?.name || "Workspace"}</span>
          <span className="text-slate-700">/</span>
          <span className="text-indigo-400 font-semibold truncate">{task.title}</span>
        </div>

        {/* ── Header Card ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className={`h-1 w-full ${status.bar}`} />
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">{task.title}</h1>
                {task.description && (
                  <p className="text-slate-300 text-sm mt-2 leading-relaxed">{task.description}</p>
                )}
              </div>
              <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${priority.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                  {task.priority} Priority
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${status.badge}`}>
                  {status.label}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                Due Date:{" "}
                <span className="text-white font-semibold">
                  {new Date(task.dueDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
              {isAdmin && (
                <button
                  onClick={handleDeleteTask}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-3.5 py-1.5 rounded-xl font-semibold transition-all"
                >
                  <Trash2 size={14} />
                  Delete Task
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Body Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Side Panel: Metadata + Status Update + Attachments */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Task Details Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Task Details</p>
              <div className="space-y-4">
                <MetaRow label="Project">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-sm bg-indigo-500" />
                    <span className="text-white font-semibold">{task.projectId?.name ?? "Standalone Task"}</span>
                  </div>
                </MetaRow>
                <MetaRow label="Assigned To">
                  <div className="flex items-center gap-2">
                    <Avatar name={task.assignedTo?.name} size="sm" />
                    <span className="text-slate-200">{task.assignedTo?.name ?? "Unassigned"}</span>
                  </div>
                </MetaRow>
                <MetaRow label="Created By">
                  <div className="flex items-center gap-2">
                    <Avatar name={task.assignedBy?.name} size="sm" />
                    <span className="text-slate-200">{task.assignedBy?.name ?? "Admin"}</span>
                  </div>
                </MetaRow>
              </div>
            </div>

            {/* Status Update Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Status & Progress</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1.5 block">Update Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition cursor-pointer"
                  >
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <button
                  onClick={handleUpdateTaskStatus}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                >
                  Update Status
                </button>
              </div>
            </div>

            {/* Attachments & Files Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Attachments
                </h3>
                {task?.attachments?.length > 0 && (
                  <span className="text-xs text-indigo-400 font-semibold">{task.attachments.length} files</span>
                )}
              </div>

              {task.attachments && task.attachments.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {task.attachments.map((file) => (
                    <li
                      key={file._id || file.fileName}
                      className="group flex items-center justify-between gap-3 rounded-xl bg-slate-950 border border-slate-800 p-3 hover:border-indigo-500/30 transition duration-200"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                          <File className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{file.fileName}</p>
                          <p className="text-[10px] text-slate-500">
                            {formatSize(file.size)}
                          </p>
                        </div>
                      </div>

                      {file.fileUrl && (
                        <a
                          href={`${import.meta.env.VITE_BACKEND_BASE_URL}/employee/tasks/${task._id}/attachments/${file._id}/download`}
                          download={file.fileName}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition"
                          aria-label={`Download ${file.fileName}`}
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-800 p-6 text-center">
                  <FileX className="w-6 h-6 text-slate-600" />
                  <p className="text-xs text-slate-500">No attachments uploaded yet</p>
                </div>
              )}

              {/* Upload Form */}
              <div className="pt-2 border-t border-slate-800">
                <label
                  htmlFor="file-upload-input"
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-950 p-4 cursor-pointer transition duration-200"
                >
                  <Upload className="w-5 h-5 text-indigo-400" />
                  <p className="text-xs text-slate-400 text-center">
                    <span className="text-indigo-400 font-semibold">Browse file</span> to attach
                  </p>
                  <input
                    id="file-upload-input"
                    type="file"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>

                {selectedFile && (
                  <div className="mt-3 flex items-center justify-between gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs">
                    <span className="text-slate-200 truncate">{selectedFile.name}</span>
                    <button
                      disabled={loading}
                      onClick={handleUpload}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3 py-1 rounded-lg text-xs transition"
                    >
                      {loading ? "..." : "Upload"}
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Discussion Chat Column */}
          <div className="lg:col-span-8">
            <Chat />
          </div>

        </div>

      </div>
    </div>
  );
};

export default TaskDetail;