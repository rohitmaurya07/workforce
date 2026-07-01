import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { deleteProjectById, getProjectById } from "../redux/userSlice";
import { PlusCircle, X } from "lucide-react";
import { addMembersToProject, removeMembersFromProject } from "../redux/adminSlice";
import Chat from "./Chat";

// ── Design tokens ────────────────────────────────────────────────────────────

const statusConfig = {
  PLANNING: {
    badge: "bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20",
    dot: "bg-violet-400",
    bar: "bg-violet-500",
  },
  ACTIVE: {
    badge: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
    dot: "bg-emerald-400",
    bar: "bg-emerald-500",
  },
  COMPLETED: {
    badge: "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20",
    dot: "bg-blue-400",
    bar: "bg-blue-500",
  },
  ARCHIVED: {
    badge: "bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/20",
    dot: "bg-slate-400",
    bar: "bg-slate-500",
  },
};

const taskStatusConfig = {
  completed: { label: "Completed", badge: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20" },
  in_progress: { label: "In Progress", badge: "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20" },
  todo: { label: "To Do", badge: "bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/20" },
};

const priorityConfig = {
  high: { dot: "bg-red-500", label: "High" },
  medium: { dot: "bg-amber-400", label: "Medium" },
  low: { dot: "bg-emerald-500", label: "Low" },
};

const progressColor = (p) =>
  p >= 70 ? "bg-emerald-500" : p >= 40 ? "bg-blue-500" : "bg-amber-400";

// ── Sub-components ───────────────────────────────────────────────────────────

const Avatar = ({ name, size = "md" }) => {
  const initials =
    name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "?";
  const sz =
    size === "xs" ? "w-6 h-6 text-[10px]"
    : size === "sm" ? "w-7 h-7 text-xs"
    : "w-9 h-9 text-sm";
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-semibold text-white flex-shrink-0`}>
      {initials}
    </div>
  );
};

const SectionLabel = ({ children }) => (
  <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
    {children}
  </h2>
);

const StatCard = ({ label, value, accent }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-col gap-1">
    <span className={`text-xl sm:text-2xl font-bold ${accent ?? "text-white"}`}>{value}</span>
    <span className="text-xs text-slate-500">{label}</span>
  </div>
);

// ── Tab: Tasks ───────────────────────────────────────────────────────────────

const TabTasks = ({ tasks = [] }) => {
  if (!tasks.length)
    return (
      <div className="flex flex-col items-center justify-center py-14 gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
          <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2" />
          </svg>
        </div>
        <p className="text-slate-500 text-sm">No tasks yet for this project.</p>
      </div>
    );

  return (
    <div className="space-y-2">
      {tasks.map((task) => {
        const ts = taskStatusConfig[task.status] ?? taskStatusConfig.todo;
        const pr = priorityConfig[task.priority] ?? priorityConfig.low;
        return (
          <div
            key={task._id}
            className="flex items-center gap-3 sm:gap-4 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-800 rounded-xl px-3 sm:px-4 py-3 transition-colors cursor-pointer group"
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${pr.dot}`} title={pr.label} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
                {task.title}
              </p>
              {task.assignedTo?.name && (
                <p className="text-xs text-slate-500 mt-0.5">{task.assignedTo.name}</p>
              )}
            </div>
            <span className={`text-xs px-2 sm:px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${ts.badge}`}>
              <span className="hidden sm:inline">{ts.label}</span>
              <span className="sm:hidden">{ts.label.split(" ")[0]}</span>
            </span>
            {task.dueDate && (
              <span className="text-xs text-slate-600 flex-shrink-0 hidden md:block">
                {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
            <svg className="w-4 h-4 text-slate-700 group-hover:text-slate-500 flex-shrink-0 hidden sm:block transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

// Tab: Members 

const TabMembers = ({ members = [] , handleRemoveMembers}) => {
  if (!members.length)
    return (
      <div className="flex flex-col items-center justify-center py-14 gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
          <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
        </div>
        <p className="text-slate-500 text-sm">No members assigned yet.</p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {members.map((m) => {
        const member = m.userId ?? m;
        return (
          <div
            key={member._id}
            className="flex items-center gap-3 bg-slate-800/40 border border-slate-800 rounded-xl px-4 py-3"
          >
            <Avatar name={member.name} size="md" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{member.name}</p>
              <p className="text-xs text-slate-500 truncate">{member.email ?? member.role ?? "Team Member"}</p>
            </div>
            <button onClick={()=>handleRemoveMembers(member._id)} className="bg-white text-black p-1 px-4 rounded-2xl ">Remove</button>
          </div>
        );
      })}
    </div>
  );
};

// ── Add Member Modal ─────────────────────────────────────────────────────────

const AddMemberModal = ({ employees, selectedIds, onToggle, onSave, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
    <div className="bg-slate-900 border border-slate-800 w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
      {/* Drag handle */}
      <div className="flex justify-center pt-3 pb-1 sm:hidden">
        <div className="w-10 h-1 rounded-full bg-slate-700" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 flex-shrink-0">
        <div>
          <h3 className="text-sm font-semibold text-white">Add Members</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {selectedIds.length > 0 ? `${selectedIds.length} selected` : "Select team members to add"}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
        >
          <X size={15} />
        </button>
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1 p-3 space-y-1">
        {employees?.length > 0 ? (
          employees.map((u) => {
            const selected = selectedIds.includes(u._id);
            return (
              <button
                key={u._id}
                type="button"
                onClick={() => onToggle(u._id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                  selected ? "bg-indigo-600/20 text-indigo-300" : "text-slate-300 hover:bg-slate-800"
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
          <p className="text-xs text-slate-500 text-center py-6">No employees found</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex gap-3 px-5 py-4 border-t border-slate-800 flex-shrink-0">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={selectedIds.length === 0}
          className="flex-1 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
        >
          Add {selectedIds.length > 0 ? `(${selectedIds.length})` : "Members"}
        </button>
      </div>
    </div>
  </div>
);

// ── Main Component ───────────────────────────────────────────────────────────

const TABS = ["Overview", "Tasks", "Members"];

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("Overview");
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const { project, user } = useSelector((state) => state.user);
  const { employees } = useSelector((state) => state.admin);
  const isAdmin = user?.role === "admin";

  const totalTasks = project?.tasks?.length || 0;
  const completedTasks = project?.tasks?.filter(
        (task) => task.status === "completed"
      ).length;
  const calProgress = Math.round((completedTasks / totalTasks) * 100);

  useEffect(() => {
    dispatch(getProjectById(id));
  }, [id]);

  const handleDeleteProject = () => {
    dispatch(deleteProjectById(project._id));
    navigate("/projects");
  };

  const handleMemberToggle = (memberId) =>
    setSelectedMembers((prev) =>
      prev.includes(memberId) ? prev.filter((m) => m !== memberId) : [...prev, memberId]
    );

  const handleSaveMembers = () => {
    dispatch(addMembersToProject(project._id, selectedMembers));
    setShowAddMember(false);
    setSelectedMembers([]);
  };

  const handleRemoveMembers = async (memberId) => {
  try {
    console.log("Members Removed");

    await removeMembersFromProject(project._id, memberId);
    window.location.reload();
  } catch (error) {
    toast.error(error.message);
  }
};

  // ── Loading / not found ──
  if (!project)
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
          <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
          </svg>
        </div>
        <p className="text-slate-500 text-sm">Project not found.</p>
      </div>
    );

  const sc = statusConfig[project.status] ?? statusConfig.PLANNING;
  const tasksDone = project.tasks?.filter((t) => t.status === "completed").length ?? 0;
  const tasksTotal = project.tasks?.length ?? 0;
  const daysLeft = project.endDate
    ? Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 sm:px-6 lg:px-8 pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* ── Back ── */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back to Projects
        </button>

        {/* ── Hero Header ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6">
          {/* Top row: status badge + delete */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
              {project.status}
            </span>
            {isAdmin && (
              <button
                onClick={handleDeleteProject}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-3 py-1.5 rounded-xl transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                Delete Project
              </button>
            )}
          </div>

          <h1 className="text-lg sm:text-xl font-semibold text-white">{project.name}</h1>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">{project.description}</p>

          {/* Date range */}
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25" />
            </svg>
            <span className="truncate">
              {new Date(project.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              {" → "}
              {new Date(project.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>

          {/* Progress */}
          <div className="mt-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-500">Overall Progress</span>
              <span className="text-xs font-semibold text-slate-300">{calProgress }%</span>
            </div>
            <div className="bg-slate-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-700 ${progressColor(project.progress)}`}
                style={{ width: `${calProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── Stat Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Total Tasks" value={tasksTotal} />
          <StatCard label="Completed" value={tasksDone} accent="text-emerald-400" />
          <StatCard label="Members" value={project.members?.length ?? 0} />
          <StatCard
            label="Days Left"
            value={daysLeft !== null ? (daysLeft < 0 ? "Overdue" : daysLeft) : "—"}
            accent={
              daysLeft !== null && daysLeft < 0
                ? "text-rose-400"
                : daysLeft !== null && daysLeft < 14
                ? "text-amber-400"
                : "text-white"
            }
          />
        </div>

        {/* ── Tabs ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

          {/* Tab bar — scrollable on mobile */}
          <div className="flex border-b border-slate-800 px-4 sm:px-6 pt-1 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative flex-shrink-0 flex items-center gap-1.5 px-1 py-4 mr-5 sm:mr-6 text-sm font-medium transition-colors ${
                  activeTab === tab ? "text-white" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab}
                {tab === "Tasks" && (
                  <span className="text-xs bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-full">
                    {tasksTotal}
                  </span>
                )}
                {tab === "Members" && (
                  <span className="text-xs bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-full">
                    {project.members?.length ?? 0}
                  </span>
                )}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-4 sm:p-6">

            {/* ── Overview ── */}
            {activeTab === "Overview" && (
              <div className="space-y-6">
                <div>
                  <SectionLabel>Task Breakdown</SectionLabel>
                  <div className="space-y-2.5">
                    {[
                      { label: "Completed", count: project.tasks?.filter((t) => t.status === "completed").length ?? 0, color: "bg-emerald-500", text: "text-emerald-400" },
                      { label: "In Progress", count: project.tasks?.filter((t) => t.status === "in_progress").length ?? 0, color: "bg-blue-500", text: "text-blue-400" },
                      { label: "To Do", count: project.tasks?.filter((t) => t.status === "todo").length ?? 0, color: "bg-slate-600", text: "text-slate-400" },
                    ].map(({ label, count, color, text }) => (
                      <div key={label} className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 w-20 sm:w-24 flex-shrink-0">{label}</span>
                        <div className="flex-1 bg-slate-800 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${color}`}
                            style={{ width: tasksTotal ? `${(count / tasksTotal) * 100}%` : "0%" }}
                          />
                        </div>
                        <span className={`text-xs font-semibold w-4 text-right ${text}`}>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-800" />

                <div>
                  <SectionLabel>Team</SectionLabel>
                  <div className="flex items-center gap-2 flex-wrap">
                    {project.members?.slice(0, 6).map((m) => {
                      const member = m.userId ?? m;
                      return (
                        <div key={member._id} className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full pl-1 pr-3 py-1">
                          <Avatar name={member.name} size="xs" />
                          <span className="text-xs text-slate-300">{member.name}</span>
                        </div>
                      );
                    })}
                    {(project.members?.length ?? 0) > 6 && (
                      <span className="text-xs text-slate-500 bg-slate-800 border border-slate-700 rounded-full px-3 py-1">
                        +{project.members.length - 6} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-800" />

                <div>
                  <SectionLabel>Timeline</SectionLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {[
                      { label: "Start Date", value: project.startDate },
                      { label: "End Date", value: project.endDate },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-slate-800/40 border border-slate-800 rounded-xl px-4 py-3 flex flex-col gap-1">
                        <span className="text-xs text-slate-500">{label}</span>
                        <span className="text-sm font-medium text-slate-200">
                          {new Date(value).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Tasks ── */}
            {activeTab === "Tasks" && <TabTasks tasks={project.tasks} />}

            {/* ── Members ── */}
            {activeTab === "Members" && (
              <div className="space-y-4">
                {isAdmin && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowAddMember(true)}
                      className="inline-flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-4 py-2 rounded-xl transition-colors"
                    >
                      <PlusCircle size={15} />
                      Add Member
                    </button>
                  </div>
                )}
                <TabMembers handleRemoveMembers={handleRemoveMembers}  members={project.members} />
              </div>
            )}
          </div>
        </div>

        <Chat/>3
      </div>

      {/* ── Add Member Modal ── */}
      {showAddMember && (
        <AddMemberModal
          employees={employees}
          selectedIds={selectedMembers}
          onToggle={handleMemberToggle}
          onSave={handleSaveMembers}
          onClose={() => { setShowAddMember(false); setSelectedMembers([]); }}
        />
      )}
    </div>
  );
};

export default ProjectDetail;