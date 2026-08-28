import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Building2, UserPlus, Search, ArrowRight, CheckCircle2, Shield, LogOut, Loader2 } from "lucide-react";
import { joinCompany, logout } from "../redux/authSlice";
import CompanyWizard from "./CompanyWizard";
import axiosInstance from "../api/axios";
import toast from "react-hot-toast";

export default function OnboardingOptions() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [mode, setMode] = useState("select"); // 'select' | 'create' | 'join'
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (mode === "join") {
      fetchCompanies();
    }
  }, [mode]);

  const fetchCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const { data } = await axiosInstance.get("/company/all");
      if (data.success) {
        setCompanies(data.companies || []);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load companies");
    } finally {
      setLoadingCompanies(false);
    }
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCompanyId) {
      toast.error("Please select a company to join");
      return;
    }
    setJoining(true);
    await dispatch(joinCompany(selectedCompanyId));
    setJoining(false);
  };

  if (mode === "create") {
    return (
      <div className="relative">
        <button
          onClick={() => setMode("select")}
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 shadow-lg transition"
        >
          ← Back to Selection
        </button>
        <CompanyWizard />
      </div>
    );
  }

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 mb-4 border border-indigo-500/20 shadow-xl shadow-indigo-600/10">
            <Shield size={28} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Welcome to CampusNest, {user?.name || "Member"}!
          </h1>
          <p className="text-slate-400 text-base max-w-md mx-auto">
            To get started, choose whether to set up a brand new organization or join an existing company space.
          </p>
        </div>

        {mode === "select" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Create Company Card */}
            <div
              onClick={() => setMode("create")}
              className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-8 cursor-pointer transition-all duration-300 shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <Building2 size={24} />
                </div>
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition">
                  Create New Company
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Set up an organization workspace from scratch. You will automatically become the Admin and manage your team, projects, and tasks.
                </p>
              </div>
              <div className="flex items-center text-sm font-semibold text-indigo-400 group-hover:text-indigo-300 transition">
                <span>Start Setup Wizard</span>
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Join Company Card */}
            <div
              onClick={() => setMode("join")}
              className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-3xl p-8 cursor-pointer transition-all duration-300 shadow-xl hover:shadow-purple-500/10 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                  <UserPlus size={24} />
                </div>
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition">
                  Join Existing Company
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Search for your organization or college workspace and join as an employee or team member to access assigned tasks.
                </p>
              </div>
              <div className="flex items-center text-sm font-semibold text-purple-400 group-hover:text-purple-300 transition">
                <span>Browse Companies</span>
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </div>
        ) : (
          /* Join Mode Screen */
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">Join an Organization</h2>
                <p className="text-slate-400 text-xs mt-0.5">Select your organization from the active workspace directory</p>
              </div>
              <button
                onClick={() => setMode("select")}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
              >
                ← Back
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search company by name, industry, or email..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            {/* Company List */}
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1 mb-6">
              {loadingCompanies ? (
                <div className="py-12 text-center text-slate-500 flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  <span>Fetching active companies...</span>
                </div>
              ) : filteredCompanies.length === 0 ? (
                <div className="py-10 text-center text-slate-500 text-sm">
                  No registered companies match "{search}".
                </div>
              ) : (
                filteredCompanies.map((c) => {
                  const isSelected = selectedCompanyId === c._id;
                  return (
                    <div
                      key={c._id}
                      onClick={() => setSelectedCompanyId(c._id)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                        isSelected
                          ? "bg-purple-900/30 border-purple-500 text-white"
                          : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-purple-400 overflow-hidden flex-shrink-0">
                          {c.logo ? (
                            <img src={c.logo} alt={c.name} className="w-full h-full object-cover" />
                          ) : (
                            c.name.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{c.name}</p>
                          <p className="text-xs text-slate-500">{c.industry || "General"} • {c.companySize || "1-10"} members</p>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 size={20} className="text-purple-400" />}
                    </div>
                  );
                })
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-500">
                Selected: {companies.find((c) => c._id === selectedCompanyId)?.name || "None"}
              </span>
              <button
                onClick={handleJoinSubmit}
                disabled={!selectedCompanyId || joining}
                className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-purple-600/20"
              >
                {joining ? <Loader2 size={16} className="animate-spin" /> : "Join Company"}
              </button>
            </div>
          </div>
        )}

        {/* Footer Logout */}
        <div className="mt-8 text-center">
          <button
            onClick={() => dispatch(logout())}
            className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition"
          >
            <LogOut size={14} />
            <span>Sign in as a different user</span>
          </button>
        </div>
      </div>
    </div>
  );
}
