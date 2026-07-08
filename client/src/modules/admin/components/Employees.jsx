import React, { useEffect, useState } from 'react'
import { teams, statusBadge } from '../data';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUserById, getAllUsers, toogleAccountStatus } from '../redux/adminSlice';
import AddEmployeeModal from "./AddEmployeeModal";
import { Link } from 'react-router-dom';

const Employees = () => {
  const dispatch = useDispatch();
  const { employees } = useSelector((state) => state.admin);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("All Teams");

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const filtered = employees.filter((e) => {
    const matchesSearch =
      e.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.role?.toLowerCase().includes(search.toLowerCase()) ||
      e.department?.toLowerCase().includes(search.toLowerCase());
    const matchesTeam =
      selectedTeam === "All Teams" || e.department === selectedTeam;
    return matchesSearch && matchesTeam;
  });

 

  const handleDelete = (empId) => {
    // dispatch your delete action here
    console.log("Delete employee:", empId);
    dispatch(deleteUserById(empId))
  };
  const handleToggleStatus = (empId) => {
    console.log("employee:", empId);
    dispatch(toogleAccountStatus(empId))
  };

  

  return (
    <div className="min-h-screen ml-58 bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Employees</h1>
            <p className="text-slate-400 text-sm mt-1">
              {employees.length} team member{employees.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setShowAddEmployee(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm px-4 py-2.5 rounded-xl font-medium transition-all duration-150 shadow-lg shadow-indigo-600/20 self-start sm:self-auto"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Employee
          </button>
        </div>

        {showAddEmployee && (
          <AddEmployeeModal onClose={() => setShowAddEmployee(false)} />
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, role, or team…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition"
            />
          </div>
          <select
            value={selectedTeam}
            onChange={e => setSelectedTeam(e.target.value)}
            className="bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition cursor-pointer min-w-[140px]"
          >
            <option>All Teams</option>
            {teams.map(t => <option key={t._id}>{t.name}</option>)}
          </select>
        </div>

        {/* ── Desktop Table ── */}
        <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3.5">Employee</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5">Team</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5">Status</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5">Joined</th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-14 text-slate-500 text-sm">
                    No employees match your search.
                  </td>
                </tr>
              ) : filtered.map((emp) => (
                <tr key={emp._id} className="hover:bg-slate-800/40 transition-colors group">
                  {/* Employee */}
                  <td className="px-5 py-4">
                    <Link to={`/user/${emp._id}`} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-slate-700 group-hover:ring-indigo-500/50 transition">
                        <img
                          src={emp.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=6366f1&color=fff`}
                          alt={emp.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition">{emp.name}</p>
                        <p className="text-xs text-slate-500">{emp.email}</p>
                      </div>
                    </Link>
                  </td>

                  {/* Team */}
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-lg font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0"></span>
                      {emp.department || '—'}
                    </span>
                  </td>

                  {/* Status Toggle */}
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleToggleStatus(emp._id)}
                      className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                        emp.isActive
                          ? 'bg-emerald-500 focus:ring-emerald-500'
                          : 'bg-slate-600 focus:ring-slate-500'
                      }`}
                      title={emp.isActive ? 'Mark inactive' : 'Mark active'}
                    >
                      <span
                        className={`inline-block w-3.5 h-3.5 bg-white rounded-full shadow transition-transform duration-200 ${
                          emp.isActive ? 'translate-x-[18px]' : 'translate-x-[2px]'
                        }`}
                      />
                    </button>
                    <span className={`ml-2 text-xs font-medium ${emp.isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {emp.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  {/* Joined */}
                  <td className="px-4 py-4 text-sm text-slate-500">{emp.joined || '—'}</td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/user/${emp._id}`}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2.5 py-1.5 rounded-lg hover:bg-indigo-500/10 transition"
                      >
                        View
                      </Link>
                      <button
                        // onClick={() => handleDelete(emp._id)}
                        className="text-xs text-green-400 hover:text-green-300 font-medium px-2.5 py-1.5 rounded-lg hover:bg-green-500/10 transition"
                      >
                        Edit
                      </button>
                      <button
                        // onClick={() => handleDelete(emp._id)}
                        className="text-xs text-rose-400 hover:text-rose-300 font-medium px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Mobile Cards ── */}
        <div className="md:hidden space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-14 text-slate-500 text-sm bg-slate-900 rounded-2xl border border-slate-800">
              No employees match your search.
            </div>
          ) : filtered.map((emp) => (
            <div key={emp._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              {/* Top row */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-slate-700">
                  <img
                    src={emp.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=6366f1&color=fff`}
                    alt={emp.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-100 truncate">{emp.name}</p>
                  <p className="text-xs text-slate-500 truncate">{emp.email}</p>
                </div>
                {/* Status toggle */}
                <button
                  onClick={() => handleToggleStatus(emp._id)}
                  className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-200 flex-shrink-0 ${
                    emp.isActive ? 'bg-emerald-500' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block w-3.5 h-3.5 bg-white rounded-full shadow transition-transform duration-200 ${
                      emp.isActive ? 'translate-x-[18px]' : 'translate-x-[2px]'
                    }`}
                  />
                </button>
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-lg font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                  {emp.department || '—'}
                </span>
                <span className={`text-xs font-medium ${emp.isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {emp.isActive ? '● Active' : '● Inactive'}
                </span>
                {emp.joined && (
                  <span className="text-xs text-slate-600 ml-auto">Joined {emp.joined}</span>
                )}
              </div>

              {/* Action row */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                <Link
                  to={`/user/${emp._id}`}
                  className="flex-1 text-center text-xs text-indigo-400 hover:text-indigo-300 font-medium py-1.5 rounded-lg hover:bg-indigo-500/10 transition"
                >
                  View Profile
                </Link>
                <div className="w-px h-4 bg-slate-700" />
                <button
                  onClick={() => handleDelete(emp._id)}
                  className="flex-1 text-center text-xs text-rose-400 hover:text-rose-300 font-medium py-1.5 rounded-lg hover:bg-rose-500/10 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Employees;