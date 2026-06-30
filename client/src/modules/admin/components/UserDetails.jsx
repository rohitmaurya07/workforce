import { useEffect, useState } from "react";
import { getUserDetailsById } from "../redux/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";



const MOCK_STATS = {
  tasksAssigned: 24,
  tasksCompleted: 19,
  tasksInProgress: 4,
  tasksTodo: 1,
  projectsInvolved: 5,
};

const MOCK_RECENT_TASKS = [
  { _id: "t1", title: "Design system tokens audit", status: "completed", priority: "high", dueDate: "2025-06-10", project: "Atlas Dashboard" },
  { _id: "t2", title: "API integration for auth flow", status: "in_progress", priority: "high", dueDate: "2025-06-28", project: "WebVault" },
  { _id: "t3", title: "Write unit tests for userSlice", status: "in_progress", priority: "medium", dueDate: "2025-07-02", project: "Atlas Dashboard" },
  { _id: "t4", title: "Migrate legacy endpoints", status: "todo", priority: "low", dueDate: "2025-07-15", project: "Internal Tools" },
  { _id: "t5", title: "Onboarding flow wireframes", status: "completed", priority: "medium", dueDate: "2025-05-30", project: "CampusNEST" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const statusMeta = {
  completed:   { label: "Completed",   color: "#34d399", bg: "rgba(52,211,153,0.1)",  dot: "#34d399" },
  in_progress: { label: "In Progress", color: "#818cf8", bg: "rgba(129,140,248,0.1)", dot: "#818cf8" },
  todo:        { label: "To Do",       color: "#94a3b8", bg: "rgba(148,163,184,0.08)",dot: "#94a3b8" },
};

const priorityMeta = {
  high:   { label: "High",   color: "#ef4444", bg: "rgba(239,68,68,0.1)"  },
  medium: { label: "Medium", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  low:    { label: "Low",    color: "#22c55e", bg: "rgba(34,197,94,0.1)"  },
};

const deptColor = {
  Development: "#818cf8", Design: "#f472b6", Testing: "#34d399",
  Marketing: "#fb923c", HR: "#a78bfa", Sales: "#38bdf8",
};

//  Sub-components 
const Avatar = ({ name, avatar, size = 72 }) => {
  const initials = name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  if (avatar && !avatar.includes("placehold")) {
    return <img src={avatar} alt={name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }} />;
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.32, fontWeight: 700, color: "#fff", flexShrink: 0,
    }}>{initials}</div>
  );
};

const StatCard = ({ label, value, color = "#818cf8", icon }) => (
  <div style={{
    background: "rgba(30,41,59,0.6)", border: "1px solid rgba(148,163,184,0.08)",
    borderRadius: 12, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 6,
  }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 500 }}>{label}</span>
      <span style={{ color, opacity: 0.7 }}>{icon}</span>
    </div>
    <span style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>{value}</span>
  </div>
);

const Badge = ({ children, color, bg }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 5,
    padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 500,
    color, background: bg, border: `1px solid ${color}33`,
  }}>{children}</span>
);

const ProgressBar = ({ value, max, color }) => (
  <div style={{ height: 6, borderRadius: 99, background: "rgba(148,163,184,0.1)", overflow: "hidden" }}>
    <div style={{
      height: "100%", borderRadius: 99,
      width: `${Math.round((value / max) * 100)}%`,
      background: color, transition: "width 0.6s ease",
    }} />
  </div>
);

//  Main Page 
const UserDetail = ({ stats = MOCK_STATS, tasks = MOCK_RECENT_TASKS, onBack }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const {id} = useParams()
const dispatch = useDispatch()
  const completionRate = Math.round((stats.tasksCompleted / stats.tasksAssigned) * 100);
  const {employee,loading} = useSelector((state)=>state.admin)
  useEffect(() => {
    dispatch(getUserDetailsById(id))
  }, [])
  
  if (loading) {
    return <h1>Loading...</h1>
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box;  }

        .ud-page {
          min-height: 100vh;
          background: #080f1e;
          color: #e2e8f0;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
          padding: 24px;
        }

        /* ── Topbar ── */
        .ud-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }

        .ud-back {
          display: flex; align-items: center; gap: 7px;
          background: rgba(30,41,59,0.7);
          border: 1px solid rgba(148,163,184,0.1);
          color: #94a3b8;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
        }
        .ud-back:hover { color: #e2e8f0; border-color: rgba(148,163,184,0.2); }

        .ud-topbar-actions { display: flex; gap: 8px; }

        .ud-action-btn {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          border: 1px solid rgba(148,163,184,0.12);
          background: transparent;
          color: #94a3b8;
          transition: all 0.15s;
          display: flex; align-items: center; gap: 6px;
        }
        .ud-action-btn:hover { background: rgba(148,163,184,0.06); color: #e2e8f0; }

        .ud-action-btn.danger:hover {
          background: rgba(239,68,68,0.08);
          border-color: rgba(239,68,68,0.3);
          color: #ef4444;
        }

        .ud-action-btn.primary {
          background: linear-gradient(135deg,#6366f1,#8b5cf6);
          border: none; color: #fff;
          box-shadow: 0 4px 12px rgba(99,102,241,0.3);
        }
        .ud-action-btn.primary:hover { box-shadow: 0 6px 18px rgba(99,102,241,0.4); transform: translateY(-1px); }

        /* ── Profile Hero ── */
        .ud-hero {
          background: linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.05) 100%);
          border: 1px solid rgba(99,102,241,0.15);
          border-radius: 18px;
          padding: 28px;
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
        }

        .ud-hero::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%);
          pointer-events: none;
        }

        .ud-hero-top {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          flex-wrap: wrap;
        }

        .ud-hero-avatar-wrap { position: relative; }

        .ud-status-dot {
          position: absolute;
          bottom: 3px; right: 3px;
          width: 14px; height: 14px;
          border-radius: 50%;
          border: 2.5px solid #080f1e;
        }

        .ud-hero-info { flex: 1; min-width: 180px; }

        .ud-hero-name {
          font-size: 24px;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -0.5px;
          margin-bottom: 4px;
        }

        .ud-hero-email {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 12px;
        }

        .ud-hero-badges { display: flex; flex-wrap: wrap; gap: 7px; align-items: center; }

        .ud-hero-meta {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 12px;
          margin-top: 22px;
          padding-top: 22px;
          border-top: 1px solid rgba(148,163,184,0.08);
        }

        .ud-meta-item { display: flex; flex-direction: column; gap: 3px; }
        .ud-meta-label { font-size: 11px; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500; }
        .ud-meta-value { font-size: 13px; color: #cbd5e1; font-weight: 500; }

        /* ── Tabs ── */
        .ud-tabs {
          display: flex;
          gap: 4px;
          background: rgba(15,23,42,0.8);
          border: 1px solid rgba(148,163,184,0.08);
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 20px;
          width: fit-content;
        }

        .ud-tab {
          padding: 7px 16px;
          border-radius: 7px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          background: transparent;
          color: #64748b;
          font-family: inherit;
          transition: all 0.15s;
        }

        .ud-tab.active {
          background: rgba(99,102,241,0.15);
          color: #818cf8;
          border: 1px solid rgba(99,102,241,0.2);
        }

        .ud-tab:hover:not(.active) { color: #94a3b8; }

        /* ── Grid ── */
        .ud-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .ud-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 16px; }
        .ud-span-2 { grid-column: span 2; }

        @media (max-width: 700px) {
          .ud-grid { grid-template-columns: 1fr; }
          .ud-grid-3 { grid-template-columns: 1fr 1fr; }
          .ud-span-2 { grid-column: span 1; }
        }

        /* ── Card ── */
        .ud-card {
          background: rgba(15,23,42,0.8);
          border: 1px solid rgba(148,163,184,0.08);
          border-radius: 14px;
          padding: 20px;
        }

        .ud-card-title {
          font-size: 13px;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* ── Task Table ── */
        .ud-task-row {
          display: grid;
          grid-template-columns: 1fr auto auto auto;
          gap: 12px;
          align-items: center;
          padding: 11px 14px;
          border-radius: 9px;
          transition: background 0.12s;
          cursor: default;
        }
        .ud-task-row:hover { background: rgba(148,163,184,0.04); }

        .ud-task-title {
          font-size: 13px;
          color: #cbd5e1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ud-task-project {
          font-size: 11px;
          color: #475569;
          margin-top: 2px;
        }

        .ud-task-date {
          font-size: 12px;
          color: #475569;
          white-space: nowrap;
        }

        /* ── Toggle ── */
        .ud-toggle {
          width: 40px; height: 22px;
          background: rgba(148,163,184,0.15);
          border-radius: 99px;
          position: relative;
          cursor: pointer;
          border: none;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .ud-toggle.on { background: rgba(34,197,94,0.4); }
        .ud-toggle::after {
          content: '';
          position: absolute;
          top: 3px; left: 3px;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #94a3b8;
          transition: all 0.2s;
        }
        .ud-toggle.on::after { left: 21px; background: #22c55e; }

        /* ── Info row ── */
        .ud-info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid rgba(148,163,184,0.06);
        }
        .ud-info-row:last-child { border-bottom: none; }
        .ud-info-key { font-size: 13px; color: #64748b; }
        .ud-info-val { font-size: 13px; color: #cbd5e1; font-weight: 500; text-align: right; }

        .ud-divider { height: 1px; background: rgba(148,163,184,0.06); margin: 4px 0; }
      `}</style>

      <div className="ud-page   ">

        {/* ── Topbar ── */}
        <div className="ud-topbar">
          <Link to={"/employees"} className="ud-back" onClick={onBack}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            All Employees
          </Link>

          <div className="ud-topbar-actions">
            <button className="ud-action-btn danger">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
              Remove
            </button>
            <button className="ud-action-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z"/>
              </svg>
              Edit
            </button>
            <button className="ud-action-btn primary">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Assign Task
            </button>
          </div>
        </div>

        {/* ── Hero ── */}
        <div className="ud-hero">
          <div className="ud-hero-top">
            <div className="ud-hero-avatar-wrap">
              <Avatar name={employee?.name} avatar={employee?.avatar} size={72} />
              <span
                className="ud-status-dot"
                style={{ background: employee?.isActive ? "#22c55e" : "#475569" }}
                title={employee?.isActive ? "Active" : "Inactive"}
              />
            </div>

            <div className="ud-hero-info">
              <div className="ud-hero-name">{employee?.name}</div>
              <div className="ud-hero-email">{employee?.email}</div>
              <div className="ud-hero-badges">
                <Badge
                //   color={deptColor[dept] || "#818cf8"}
                //   bg={`${deptColor[dept] || "#818cf8"}18`}
                >
                  {employee?.department || "No department"}
                  
                </Badge>
                <Badge
                  color={employee?.role === "admin" ? "#f59e0b" : "#94a3b8"}
                  bg={employee?.role === "admin" ? "rgba(245,158,11,0.1)" : "rgba(148,163,184,0.08)"}
                >
                  {employee?.role === "admin" ? "👑 Admin" : "Employee"}
                </Badge>
                <Badge
                  color={employee?.isVerified ? "#34d399" : "#f59e0b"}
                  bg={employee?.isVerified ? "rgba(52,211,153,0.1)" : "rgba(245,158,11,0.1)"}
                >
                  {employee?.isVerified ? "✓ Verified" : "Unverified"}
                </Badge>
                {employee?.googleId && (
                  <Badge color="#60a5fa" bg="rgba(96,165,250,0.1)">Google SSO</Badge>
                )}
              </div>
            </div>

            {/* Quick toggles */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "#64748b" }}>Active</span>
                <button
                  className={`ud-toggle ${employee?.isActive ? "on" : ""}`}
                  onClick={() => setemployee((u) => ({ ...u, isActive: !u.isActive }))}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "#64748b" }}>Verified</span>
                <button
                  className={`ud-toggle ${employee?.isVerified ? "on" : ""}`}
                  onClick={() => setemployee((u) => ({ ...u, isVerified: !u.isVerified }))}
                />
              </div>
            </div>
          </div>

          {/* Meta row */}
          <div className="ud-hero-meta">
            <div className="ud-meta-item">
              <span className="ud-meta-label">Member Since</span>
              <span className="ud-meta-value">{formatDate(employee?.createdAt)}</span>
            </div>
            <div className="ud-meta-item">
              <span className="ud-meta-label">Last Login</span>
              <span className="ud-meta-value">{employee?.updatedAt ? timeAgo(employee?.updatedAt) : "Never"}</span>
            </div>
            <div className="ud-meta-item">
              <span className="ud-meta-label">Last Updated</span>
              <span className="ud-meta-value">{formatDate(employee?.updatedAt)}</span>
            </div>
            <div className="ud-meta-item">
              <span className="ud-meta-label">Auth Method</span>
              <span className="ud-meta-value">{employee?.googleId ? "Google OAuth" : "Email & Password"}</span>
            </div>
            <div className="ud-meta-item">
              <span className="ud-meta-label">User ID</span>
              <span className="ud-meta-value" style={{ fontSize: 11, fontFamily: "monospace", color: "#475569" }}>
                {employee?._id}
              </span>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="ud-tabs">
          {["overview", "tasks", "account"].map((t) => (
            <button
              key={t}
              className={`ud-tab ${activeTab === t ? "active" : ""}`}
              onClick={() => setActiveTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* ══════════════════════ OVERVIEW TAB ══════════════════════ */}
        {activeTab === "overview" && (
          <>
            {/* Stat cards */}
            <div className="ud-grid-3">
              <StatCard
                label="Tasks Assigned"
                value={employee?.stats?.totalTasks}
                color="#818cf8"
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
              />
              <StatCard
                label="Completed"   
                value={employee?.stats?.completedTasks}
                color="#34d399"
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>}
              />
              <StatCard
                label="Projects"
                value={employee?.projects?.length}
                color="#f59e0b"
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>}
              />
            </div>

            <div className="ud-grid">
              {/* Completion rate */}
              <div className="ud-card">
                <div className="ud-card-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
                  Performance
                </div>

                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 42, fontWeight: 800, color: "#f1f5f9", lineHeight: 1 }}>{employee?.performance}%</span>
                  <span style={{ fontSize: 13, color: "#64748b", marginBottom: 6 }}>completion rate</span>
                </div>

                <ProgressBar value={employee?.stats.completedTasks} max={employee?.stats.inProgressTasks} color="#6366f1" />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 18 }}>
                  {[
                    { label: "In Progress", val: employee?.stats?.inProgressTasks, color: "#818cf8" },
                    { label: "Todo",        val: employee?.stats?.totalTasks - employee?.stats?.completedTasks,       color: "#94a3b8" },
                    { label: "Completed",   val: employee?.stats?.completedTasks,  color: "#34d399" },
                    { label: "Total",       val: employee?.stats?.totalTasks,   color: "#f1f5f9" },
                  ].map(({ label, val, color }) => (
                    <div key={label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.4px" }}>{label}</span>
                      <span style={{ fontSize: 20, fontWeight: 700, color }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Task breakdown bar */}
              <div className="ud-card">
                <div className="ud-card-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  Recent Tasks
                </div>

                {employee?.tasks?.slice(0, 4).map((task) => {
                  const s = statusMeta[task.status];
                  const p = priorityMeta[task.priority];
                  return (
                    <div key={task._id} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "9px 0", borderBottom: "1px solid rgba(148,163,184,0.06)",
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, color: "#cbd5e1", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {task.title}
                        </div>
                        <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{task.project}</div>
                      </div>
                      <div style={{ display: "flex", gap: 6, marginLeft: 12, flexShrink: 0 }}>
                        {/* <span style={{ */}
                           {/* fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 5, */}
                           {/* color: p.color, background: p.bg, */}
                        {/* // }}>{p.label}</span> */}
                        {/* <span style={{
                          fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 5,
                          color: s.color, background: s.bg,
                        }}>{s.label}</span> */}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* */}
        {activeTab === "tasks" && (
          <div className="ud-card">
            <div className="ud-card-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              All Assigned Tasks ({employee?.tasks?.length})
            </div>

            {/* Header */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr auto auto auto",
              gap: 12, padding: "8px 14px",
              fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.4px",
              borderBottom: "1px solid rgba(148,163,184,0.08)", marginBottom: 4,
            }}>
              <span>Task</span><span>Priority</span><span>Status</span><span>Due</span>
            </div>

            {employee.tasks.map((task) => {
              const s = statusMeta[task.status];
              const p = priorityMeta[task.priority];
              return (
                <div key={task._id} className="ud-task-row">
                  <div>
                    <div className="ud-task-title">{task.title}</div>
                    <div className="ud-task-project">{task.project}</div>
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 6,
                    color: p.color, background: p.bg, border: `1px solid ${p.color}33`,
                  }}>{p.label}</span>
                  <span style={{
                    fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 6,
                    display: "flex", alignItems: "center", gap: 5,
                    color: s.color, background: s.bg, border: `1px solid ${s.color}33`,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
                    {s.label}
                  </span>
                  <span className="ud-task-date">{formatDate(task.dueDate)}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* ══════════════════════ ACCOUNT TAB ══════════════════════ */}
        {activeTab === "account" && (
          <div className="ud-grid">
            {/* Identity */}
            <div className="ud-card">
              <div className="ud-card-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                Identity
              </div>
              {[
                { k: "Full Name",    v: employee?.name },
                { k: "Email",        v: employee?.email },
                { k: "Role",         v: employee?.role.charAt(0).toUpperCase() + employee?.role.slice(1) },
                { k: "Department",   v: employee?.department || "—" },
                { k: "Auth Method",  v: employee?.googleId ? "Google OAuth" : "Email & Password" },
                { k: "Google ID",    v: employee?.googleId || "—" },
              ].map(({ k, v }) => (
                <div key={k} className="ud-info-row">
                  <span className="ud-info-key">{k}</span>
                  <span className="ud-info-val" style={{ fontFamily: k === "Google ID" ? "monospace" : "inherit", fontSize: k === "Google ID" ? 11 : 13 }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Status & Security */}
            <div className="ud-card">
              <div className="ud-card-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Status & Security
              </div>
              {[
                { k: "Account Status", v: employee?.isActive ? "Active" : "Inactive", color: employee?.isActive ? "#22c55e" : "#ef4444" },
                { k: "Email Verified", v: employee?.isVerified ? "Verified" : "Unverified", color: employee?.isVerified ? "#34d399" : "#f59e0b" },
                { k: "Last Login",     v: employee?.lastLogin ? timeAgo(employee.lastLogin) : "Never" },
                { k: "Member Since",   v: formatDate(employee?.createdAt) },
                { k: "Last Updated",   v: formatDate(employee?.updatedAt) },
              ].map(({ k, v, color }) => (
                <div key={k} className="ud-info-row">
                  <span className="ud-info-key">{k}</span>
                  <span className="ud-info-val" style={{ color: color || "#cbd5e1" }}>{v}</span>
                </div>
              ))}

              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(148,163,184,0.08)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button className="ud-action-btn" style={{ width: "100%", justifyContent: "center", fontSize: 13 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    Send Password Reset
                  </button>
                  <button className="ud-action-btn danger" style={{ width: "100%", justifyContent: "center", fontSize: 13 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    Revoke Access
                  </button>
                </div>
              </div>
            </div>

            {/* System */}
            <div className="ud-card ud-span-2">
              <div className="ud-card-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                System Info
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {[
                  { k: "User ID",      v: employee?._id },
                  { k: "Created At",   v: employee?.createdAt.toISOString() },
                  { k: "Updated At",   v: employee?.updatedAt.toISOString() },
                ].map(({ k, v }) => (
                  <div key={k}>
                    <div style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 4 }}>{k}</div>
                    <div style={{ fontSize: 12, color: "#64748b", fontFamily: "monospace", wordBreak: "break-all" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserDetail;