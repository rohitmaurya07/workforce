import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addEmployee } from "../redux/adminSlice";

const DEPARTMENTS = ["Development", "Design", "Testing", "Marketing", "HR", "Sales"];

const AddEmployeeModal = ({ onClose }) => {
  const dispatch = useDispatch();
const {user }= useSelector((state=>state.auth))
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    company: user.company._id,
  });


  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(addEmployee(formData));
    setFormData({ name: "", email: "", password: "", department: "" });
    onClose();
  };

  return (
    <>
      <style>{`
        .aem-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 16px;
          animation: aem-fade 0.2s ease;
        }

        @keyframes aem-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes aem-slide-up {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .aem-modal {
          background: #0f172a;
          border: 1px solid rgba(148, 163, 184, 0.1);
          border-radius: 20px;
          width: 100%;
          max-width: 480px;
          animation: aem-slide-up 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .aem-header {
          padding: 28px 28px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .aem-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .aem-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .aem-title {
          font-size: 18px;
          font-weight: 600;
          color: #f1f5f9;
          margin: 0;
          letter-spacing: -0.3px;
        }

        .aem-subtitle {
          font-size: 12px;
          color: #64748b;
          margin: 2px 0 0;
        }

        .aem-close {
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

        .aem-close:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }

        .aem-divider {
          height: 1px;
          background: rgba(148, 163, 184, 0.08);
          margin: 24px 0 0;
        }

        .aem-body {
          padding: 24px 28px 28px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .aem-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .aem-label {
          font-size: 12px;
          font-weight: 500;
          color: #94a3b8;
          letter-spacing: 0.4px;
          text-transform: uppercase;
        }

        .aem-input-wrap {
          position: relative;
        }

        .aem-input-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #475569;
          display: flex;
          align-items: center;
          pointer-events: none;
        }

        .aem-input, .aem-select {
          background: rgba(30, 41, 59, 0.7);
          border: 1px solid rgba(148, 163, 184, 0.1);
          border-radius: 10px;
          padding: 11px 14px 11px 38px;
          color: #e2e8f0;
          font-size: 14px;
          width: 100%;
          box-sizing: border-box;
          transition: all 0.15s;
          outline: none;
          font-family: inherit;
        }

        .aem-input::placeholder {
          color: #475569;
        }

        .aem-input:focus, .aem-select:focus {
          border-color: rgba(99, 102, 241, 0.5);
          background: rgba(30, 41, 59, 0.9);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08);
        }

        .aem-select {
          appearance: none;
          -webkit-appearance: none;
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2364748b' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
        }

        .aem-select option {
          background: #1e293b;
          color: #e2e8f0;
        }

        .aem-pw-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #475569;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }

        .aem-pw-toggle:hover { color: #94a3b8; }

        .aem-input-pw {
          padding-right: 42px;
        }

        /* Department grid */
        .aem-dept-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .aem-dept-pill {
          padding: 9px 0;
          border-radius: 8px;
          border: 1px solid rgba(148, 163, 184, 0.1);
          background: rgba(30, 41, 59, 0.7);
          color: #64748b;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          text-align: center;
          transition: all 0.15s;
          font-family: inherit;
        }

        .aem-dept-pill:hover {
          border-color: rgba(148, 163, 184, 0.2);
          color: #94a3b8;
        }

        .aem-dept-pill.active {
          background: rgba(99, 102, 241, 0.12);
          border-color: rgba(99, 102, 241, 0.4);
          color: #818cf8;
        }

        .aem-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          padding-top: 8px;
          border-top: 1px solid rgba(148, 163, 184, 0.08);
        }

        .aem-btn-cancel {
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

        .aem-btn-cancel:hover {
          border-color: rgba(148, 163, 184, 0.25);
          color: #94a3b8;
          background: rgba(148, 163, 184, 0.04);
        }

        .aem-btn-submit {
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

        .aem-btn-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }

        .aem-btn-submit:active { transform: translateY(0); }
      `}</style>

      <div className="aem-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="aem-modal">

          {/* Header */}
          <div className="aem-header">
            <div className="aem-header-left">
              <div className="aem-icon-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M19 8v6M22 11h-6" />
                </svg>
              </div>
              <div>
                <p className="aem-title">Add Employee</p>
                <p className="aem-subtitle">Create a new team member account</p>
              </div>
            </div>
            <button className="aem-close" onClick={onClose}>×</button>
          </div>

          <div className="aem-divider" />

          <form onSubmit={handleSubmit}>
            <div className="aem-body">

              {/* Name */}
              <div className="aem-field">
                <label className="aem-label">Full Name</label>
                <div className="aem-input-wrap">
                  <span className="aem-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </span>
                  <input
                    className="aem-input"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Priya Sharma"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="aem-field">
                <label className="aem-label">Email Address</label>
                <div className="aem-input-wrap">
                  <span className="aem-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input
                    className="aem-input"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="priya@company.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="aem-field">
                <label className="aem-label">Temporary Password</label>
                <div className="aem-input-wrap">
                  <span className="aem-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    className={`aem-input aem-input-pw`}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    required
                  />
                  <button
                    type="button"
                    className="aem-pw-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Department */}
              <div className="aem-field">
                <label className="aem-label">Department</label>
                <div className="aem-dept-grid">
                  {DEPARTMENTS.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      className={`aem-dept-pill ${formData.department === dept ? "active" : ""}`}
                      onClick={() => setFormData((prev) => ({ ...prev, department: dept }))}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
                {/* Hidden required field for validation */}
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  required
                  readOnly
                  style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }}
                />
              </div>

              {/* Footer */}
              <div className="aem-footer">
                <button type="button" className="aem-btn-cancel" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="aem-btn-submit">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M19 8v6M22 11h-6" />
                  </svg>
                  Add Employee
                </button>
              </div>

            </div>
          </form>

        </div>
      </div>
    </>
  );
};

export default AddEmployeeModal;