import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProject, getAllProjects } from "../redux/adminSlice";
import { Link } from "react-router-dom";
import { getMyProjects } from "../redux/userSlice";

const statusConfig = {
  PLANNING: {
    badge: "bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20",
    dot: "bg-violet-400",
  },
  ACTIVE: {
    badge: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
    dot: "bg-emerald-400",
  },
  COMPLETED: {
    badge: "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20",
    dot: "bg-blue-400",
  },
  ARCHIVED: {
    badge: "bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/20",
    dot: "bg-slate-400",
  },
};

const progressColor = (p) =>
  p >= 70 ? "bg-emerald-500" : p >= 40 ? "bg-blue-500" : "bg-amber-400";

const Avatar = ({ name, size = "sm" }) => {
  const initials = name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const sz = size === "xs" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs";
  return (
    <div
      className={`${sz} rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-semibold text-white flex-shrink-0`}
    >
      {initials}
    </div>
  );
};

const InputField = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
      {label}
    </label>
    {children}
  </div>
);

const inputClass =
  "w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2.5 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60 transition-all";

const defaultForm = {
  name: "",
  description: "",
  status: "PLANNING",
  startDate: "",
  endDate: "",
  progress: 0,
  members: [],
};

const Projects = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(defaultForm);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { employees: users, projects: allProjects } = useSelector((state) => state.admin);
  const { myProjects } = useSelector((state) => state.user);

  const isAdmin = user?.role === "admin";
  const projects = isAdmin ? allProjects : myProjects;
  const activeCount = projects?.filter((p) => p.status === "ACTIVE").length ?? 0;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleMemberToggle = (id) =>
    setFormData((prev) => ({
      ...prev,
      members: prev.members.includes(id)
        ? prev.members.filter((m) => m !== id)
        : [...prev.members, id],
    }));

  const handleCreateProject = () => {
    dispatch(createProject({ ...formData }));
    setShowModal(false);
    setFormData(defaultForm);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(defaultForm);
  };

  return (
    <div style={{ backgroundColor: user.company.primaryColor }} className="min-h-screen ml-58  px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Projects</h1>
            <p className="text-slate-500 text-sm mt-1">
              {projects?.length ?? 0} total · {activeCount} active
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-150 shadow-lg shadow-indigo-600/20 self-start sm:self-auto flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Project
            </button>
          )}
        </div>

        {/* ── Project Cards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects?.map((p) => {
            const sc = statusConfig[p.status] ?? statusConfig.PLANNING;
            return (
              <Link to={`/project/${p._id}`} key={p._id}>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200 group h-full flex flex-col">

                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                      {
                        user?._id !== p?.createdBy?._id ? (<p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        Created By : {p?.createdBy?.name} </p>)
                        :
                        (<p className="text-xs border-2 w-23 rounded-2xl p-1 text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        Created By You
                      </p>)
                      
                      }
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${sc.badge}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      <span className="hidden xs:inline">{p.status}</span>
                      <span className="xs:hidden">{p.status.slice(0, 3)}</span>
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-500">Progress</span>
                      <span className="text-xs font-semibold text-slate-300">{p.progress}%</span>
                    </div>
                    <div className="bg-slate-800 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${progressColor(p.progress ?? 0)}`}
                        style={{ width: `${p.progress ?? 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mt-auto">
                    {[
                      {
                        label: "Members",
                        value: Array.isArray(p.members) ? p.members.length : (p.members ?? 0),
                      },
                      { label: "Tasks", value: p.tasks?.length ?? 0 },
                      {
                        label: "Deadline",
                        value: p.endDate
                          ? new Date(p.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                          : p.deadline ?? "—",
                      },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="bg-slate-800/60 border border-slate-800 rounded-xl p-2.5 sm:p-3 text-center"
                      >
                        <p className="text-sm font-semibold text-white truncate">{value}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Empty state */}
          {(projects?.length ?? 0) === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center">
                <svg className="w-7 h-7 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-slate-300 text-sm font-medium">No projects yet</p>
                <p className="text-slate-500 text-xs mt-1">Create one to get started.</p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  New Project
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Create Project Modal ── */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
            {/* Bottom sheet on mobile, centered modal on sm+ */}
            <div className="bg-slate-900 border border-slate-800 w-full sm:max-w-xl rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh]">

              {/* Drag handle (mobile only) */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-slate-700" />
              </div>

              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-800 flex-shrink-0">
                <div>
                  <h2 className="text-base font-semibold text-white">Create Project</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Fill in the details to get started</p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body — scrollable */}
              <div className="px-5 sm:px-6 py-4 sm:py-5 space-y-4 overflow-y-auto flex-1">

                <InputField label="Project Name">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. Employee Attendance Portal"
                  />
                </InputField>

                <InputField label="Description">
                  <textarea
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={`${inputClass} resize-none`}
                    placeholder="What's this project about?"
                  />
                </InputField>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <InputField label="Status">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="PLANNING">Planning</option>
                      <option value="ACTIVE">Active</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </InputField>

                  <InputField label="Progress (%)">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      name="progress"
                      value={formData.progress}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </InputField>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <InputField label="Start Date">
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </InputField>

                  <InputField label="End Date">
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </InputField>
                </div>

                {/* Members */}
                <InputField
                  label={`Members${formData.members.length > 0 ? ` (${formData.members.length} selected)` : ""}`}
                >
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-2 space-y-1 max-h-36 overflow-y-auto">
                    {users?.length > 0 ? (
                      users.map((u) => {
                        const selected = formData.members.includes(u._id);
                        return (
                          <button
                            key={u._id}
                            type="button"
                            onClick={() => handleMemberToggle(u._id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                              selected
                                ? "bg-indigo-600/20 text-indigo-300"
                                : "text-slate-300 hover:bg-slate-700"
                            }`}
                          >
                            <Avatar name={u.name} size="xs" />
                            <span className="text-sm flex-1 truncate">{u.name}</span>
                            {selected && (
                              <svg className="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            )}
                          </button>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-500 text-center py-3">No employees found</p>
                    )}
                  </div>
                </InputField>

              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 px-5 sm:px-6 py-4 border-t border-slate-800 flex-shrink-0">
                <button
                  onClick={closeModal}
                  className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProject}
                  disabled={!formData.name.trim()}
                  className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                >
                  Create Project
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Projects;