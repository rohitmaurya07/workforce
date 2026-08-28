import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUserById, getAllUsers, toogleAccountStatus, updateEmployeeByAdmin } from "../redux/adminSlice";
import AddEmployeeModal from "./AddEmployeeModal";
import { Link } from "react-router-dom";
import { Search, UserPlus, Shield, User, Mail, Building2, Trash2, Eye, Edit3 } from "lucide-react";

const Employees = () => {
  const dispatch = useDispatch();
  const { employees } = useSelector((state) => state.admin);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const filtered = employees.filter((e) => {
    const query = search.toLowerCase();
    return (
      e.name?.toLowerCase().includes(query) ||
      e.email?.toLowerCase().includes(query) ||
      e.role?.toLowerCase().includes(query) ||
      e.department?.toLowerCase().includes(query)
    );
  });

  const handleDelete = (empId) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      dispatch(deleteUserById(empId));
    }
  };

  const handleToggleStatus = (empId) => {
    dispatch(toogleAccountStatus(empId));
  };

  return (
    <div className="min-h-screen pb-24 md:pb-6 md:ml-60 px-4 py-6 sm:px-6 lg:px-8 bg-slate-950 font-sans text-slate-100">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Team Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Users & Team</h1>
            <p className="text-slate-400 text-sm mt-1">
              {employees.length} active team member{employees.length !== 1 ? "s" : ""} in your organization workspace
            </p>
          </div>
          <button
            onClick={() => setShowAddEmployee(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-indigo-600/20 self-start sm:self-auto"
          >
            <UserPlus size={16} />
            Add Employee
          </button>
        </div>

        {showAddEmployee && (
          <AddEmployeeModal onClose={() => setShowAddEmployee(false)} />
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search users by name, email, role, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-5 py-4">Employee</th>
                <th className="px-4 py-4">Role & Dept</th>
                <th className="px-4 py-4">Account Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-16 text-slate-500 text-sm">
                    No team members match your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((emp) => (
                  <tr key={emp._id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Employee info */}
                    <td className="px-5 py-4">
                      <Link to={`/user/${emp._id}`} className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-indigo-400 overflow-hidden ring-1 ring-slate-700 flex-shrink-0">
                          {emp.avatar ? (
                            <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover" />
                          ) : (
                            emp.name?.slice(0, 2).toUpperCase() || "CN"
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white group-hover:text-indigo-400 transition-colors">{emp.name}</p>
                          <p className="text-xs text-slate-400">{emp.email}</p>
                        </div>
                      </Link>
                    </td>

                    {/* Role & Dept */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {emp.role || "employee"}
                        </span>
                        <span className="text-xs text-slate-400">
                          {emp.department || "General"}
                        </span>
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(emp._id)}
                          className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-200 focus:outline-none ${
                            emp.isActive !== false ? "bg-emerald-500" : "bg-slate-700"
                          }`}
                          title={emp.isActive !== false ? "Click to deactivate" : "Click to activate"}
                        >
                          <span
                            className={`inline-block w-3.5 h-3.5 bg-white rounded-full shadow transition-transform duration-200 ${
                              emp.isActive !== false ? "translate-x-[18px]" : "translate-x-[2px]"
                            }`}
                          />
                        </button>
                        <span className={`text-xs font-semibold ${emp.isActive !== false ? "text-emerald-400" : "text-slate-500"}`}>
                          {emp.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/user/${emp._id}`}
                          className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-indigo-600/20 transition"
                        >
                          <Eye size={14} />
                          View Profile
                        </Link>
                        <button
                          onClick={() => handleDelete(emp._id)}
                          className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-rose-500/20 transition"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-14 text-slate-500 text-sm bg-slate-900 rounded-2xl border border-slate-800">
              No team members match your search.
            </div>
          ) : (
            filtered.map((emp) => (
              <div key={emp._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-indigo-400 overflow-hidden ring-1 ring-slate-700 flex-shrink-0">
                    {emp.avatar ? (
                      <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover" />
                    ) : (
                      emp.name?.slice(0, 2).toUpperCase() || "CN"
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{emp.name}</p>
                    <p className="text-xs text-slate-400 truncate">{emp.email}</p>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(emp._id)}
                    className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-200 flex-shrink-0 ${
                      emp.isActive !== false ? "bg-emerald-500" : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`inline-block w-3.5 h-3.5 bg-white rounded-full shadow transition-transform duration-200 ${
                        emp.isActive !== false ? "translate-x-[18px]" : "translate-x-[2px]"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                  <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {emp.role || "employee"} • {emp.department || "General"}
                  </span>
                  <div className="flex items-center gap-3">
                    <Link to={`/user/${emp._id}`} className="text-indigo-400 font-semibold hover:underline">
                      View
                    </Link>
                    <button onClick={() => handleDelete(emp._id)} className="text-rose-400 font-semibold hover:underline">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Employees;