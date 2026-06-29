import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask } from "../redux/adminSlice";

const AddTaskModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { employees, projects } = useSelector((state) => state.admin);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",
    priority: "medium",
    status: "todo",
    dueDate: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createTask(formData));
    onClose();
  };

  const priorityConfig = {
    low: { color: "#22c55e", bg: "rgba(34,197,94,0.12)", label: "Low" },
    medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "Medium" },
    high: { color: "#ef4444", bg: "rgba(239,68,68,0.12)", label: "High" },
  };

  const statusConfig = {
    todo: { color: "#94a3b8", label: "To Do" },
    in_progress: { color: "#818cf8", label: "In Progress" },
    completed: { color: "#34d399", label: "Completed" },
  };

  return (
    <>
      <style>{`
        .atm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 16px;
          animation: atm-fade-in 0.2s ease;
        }

        @keyframes atm-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes atm-slide-up {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .atm-modal {
          background: #0f172a;
          border: 1px solid rgba(148, 163, 184, 0.1);
          border-radius: 20px;
          width: 100%;
          max-width: 580px;
          max-height: 90vh;
          overflow-y: auto;
          animation: atm-slide-up 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          scrollbar-width: none;
        }

        .atm-modal::-webkit-scrollbar { display: none; }

        .atm-header {
          padding: 28px 28px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .atm-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .atm-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .atm-title {
          font-size: 18px;
          font-weight: 600;
          color: #f1f5f9;
          margin: 0;
          letter-spacing: -0.3px;
        }

        .atm-subtitle {
          font-size: 12px;
          color: #64748b;
          margin: 2px 0 0;
        }

        .atm-close {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          border: 1px solid rgba(148, 163, 184, 0.12);
          background: rgba(148, 163, 184, 0.06);
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          line-height: 1;
          transition: all 0.15s;
        }

        .atm-close:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }

        .atm-divider {
          height: 1px;
          background: rgba(148, 163, 184, 0.08);
          margin: 24px 0 0;
        }

        .atm-body {
          padding: 24px 28px 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .atm-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .atm-label {
          font-size: 12px;
          font-weight: 500;
          color: #94a3b8;
          letter-spacing: 0.4px;
          text-transform: uppercase;
        }

        .atm-input, .atm-select, .atm-textarea {
          background: rgba(30, 41, 59, 0.7);
          border: 1px solid rgba(148, 163, 184, 0.1);
          border-radius: 10px;
          padding: 11px 14px;
          color: #e2e8f0;
          font-size: 14px;
          width: 100%;
          box-sizing: border-box;
          transition: all 0.15s;
          outline: none;
          font-family: inherit;
        }

        .atm-input::placeholder, .atm-textarea::placeholder {
          color: #475569;
        }

        .atm-input:focus, .atm-select:focus, .atm-textarea:focus {
          border-color: rgba(99, 102, 241, 0.5);
          background: rgba(30, 41, 59, 0.9);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08);
        }

        .atm-select {
          appearance: none;
          -webkit-appearance: none;
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2364748b' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
        }

        .atm-select option {
          background: #1e293b;
          color: #e2e8f0;
        }

        .atm-textarea {
          resize: none;
          line-height: 1.6;
        }

        .atm-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        /* Priority Pills */
        .atm-priority-group {
          display: flex;
          gap: 8px;
        }

        .atm-pill {
          flex: 1;
          padding: 9px 0;
          border-radius: 8px;
          border: 1px solid transparent;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          text-align: center;
          transition: all 0.15s;
          background: rgba(30, 41, 59, 0.7);
          color: #64748b;
        }

        .atm-pill:hover {
          border-color: rgba(148, 163, 184, 0.2);
          color: #94a3b8;
        }

        .atm-pill.active-low {
          background: rgba(34, 197, 94, 0.1);
          border-color: rgba(34, 197, 94, 0.35);
          color: #22c55e;
        }

        .atm-pill.active-medium {
          background: rgba(245, 158, 11, 0.1);
          border-color: rgba(245, 158, 11, 0.35);
          color: #f59e0b;
        }

        .atm-pill.active-high {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.35);
          color: #ef4444;
        }

        /* Status pills */
        .atm-status-group {
          display: flex;
          gap: 8px;
        }

        .atm-status-pill {
          flex: 1;
          padding: 9px 0;
          border-radius: 8px;
          border: 1px solid transparent;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          text-align: center;
          transition: all 0.15s;
          background: rgba(30, 41, 59, 0.7);
          color: #64748b;
        }

        .atm-status-pill:hover {
          border-color: rgba(148, 163, 184, 0.2);
          color: #94a3b8;
        }

        .atm-status-pill.active-todo {
          background: rgba(148, 163, 184, 0.08);
          border-color: rgba(148, 163, 184, 0.3);
          color: #94a3b8;
        }

        .atm-status-pill.active-in_progress {
          background: rgba(129, 140, 248, 0.1);
          border-color: rgba(129, 140, 248, 0.35);
          color: #818cf8;
        }

        .atm-status-pill.active-completed {
          background: rgba(52, 211, 153, 0.1);
          border-color: rgba(52, 211, 153, 0.35);
          color: #34d399;
        }

        .atm-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          padding-top: 8px;
          border-top: 1px solid rgba(148, 163, 184, 0.08);
        }

        .atm-btn-cancel {
          padding: 10px 20px;
          border-radius: 10px;
          border: 1px solid rgba(148, 163, 184, 0.12);
          background: transparent;
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
        }

        .atm-btn-cancel:hover {
          border-color: rgba(148, 163, 184, 0.25);
          color: #94a3b8;
          background: rgba(148, 163, 184, 0.04);
        }

        .atm-btn-submit {
          padding: 10px 22px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 7px;
          letter-spacing: -0.1px;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
        }

        .atm-btn-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }

        .atm-btn-submit:active {
          transform: translateY(0);
        }
      `}</style>

      <div className="atm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="atm-modal">

          {/* Header */}
          <div className="atm-header">
            <div className="atm-header-left">
              <div className="atm-icon-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <div>
                <p className="atm-title">Create Task</p>
                <p className="atm-subtitle">Add a new task to your workflow</p>
              </div>
            </div>
            <button className="atm-close" onClick={onClose}>×</button>
          </div>

          <div className="atm-divider" />

          {/* Body */}
          <form onSubmit={handleSubmit}>
            <div className="atm-body">

              {/* Title */}
              <div className="atm-field">
                <label className="atm-label">Task Title</label>
                <input
                  className="atm-input"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Design onboarding flow"
                  required
                />
              </div>

              {/* Description */}
              <div className="atm-field">
                <label className="atm-label">Description</label>
                <textarea
                  className="atm-textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What needs to be done?"
                />
              </div>

              {/* Project + Assign */}
              <div className="atm-row">
                <div className="atm-field">
                  <label className="atm-label">Project</label>
                  <select
                    className="atm-select"
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select project</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="atm-field">
                  <label className="atm-label">Assign To</label>
                  <select
                    className="atm-select"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select employee</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Priority */}
              <div className="atm-field">
                <label className="atm-label">Priority</label>
                <div className="atm-priority-group">
                  {["low", "medium", "high"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`atm-pill ${formData.priority === p ? `active-${p}` : ""}`}
                      onClick={() => setFormData((prev) => ({ ...prev, priority: p }))}
                    >
                      {priorityConfig[p].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="atm-field">
                <label className="atm-label">Status</label>
                <div className="atm-status-group">
                  {["todo", "in_progress", "completed"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`atm-status-pill ${formData.status === s ? `active-${s}` : ""}`}
                      onClick={() => setFormData((prev) => ({ ...prev, status: s }))}
                    >
                      {statusConfig[s].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date */}
              <div className="atm-field">
                <label className="atm-label">Due Date</label>
                <input
                  className="atm-input"
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Footer */}
              <div className="atm-footer">
                <button type="button" className="atm-btn-cancel" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="atm-btn-submit">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Create Task
                </button>
              </div>

            </div>
          </form>

        </div>
      </div>
    </>
  );
};

export default AddTaskModal;