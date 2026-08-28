import React, { useRef, useState } from "react";
import {
  User, Shield, Bell, Palette, SlidersHorizontal, Sparkles, Activity as ActivityIcon,
  Info, Menu, X, Camera, Mail, Phone, Calendar, MapPin, UserCircle2, Briefcase,
  Building2, Clock, Laptop2, CheckCircle2, ListTodo, AlertTriangle, Timer,
  TrendingUp, Award, Target, FileUp, MessageSquare, FolderPlus, LogOut,
  KeyRound, Smartphone, Monitor, Eye, EyeOff, Globe, ChevronDown, Sun, Moon,
  Zap, BrainCircuit, FileText, ScrollText, ShieldCheck, ExternalLink, Edit3,
  Plus, Circle,
  SaveAll,
  School, Type,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { profileUpdate } from "../redux/userSlice";
import { updateCompanyInfo } from "../redux/adminSlice";
import { logout } from "../redux/authSlice";
import { useTheme } from "../context/ThemeContext";

const navItems = [
  { key: "company", label: "Company", icon: School },
  { key: "profile", label: "Profile", icon: User },
  { key: "settings", label: "Settings", icon: User },
  { key: "appearance", label: "Appearance", icon: User },
];
const accentColors = [
  { name: "Indigo", value: "#6366F1" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Emerald", value: "#10B981" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Orange", value: "#F97316" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Pink", value: "#EC4899" },
];


function Card({ title, description, icon: Icon, action, children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-900 shadow-xl transition-shadow duration-300 ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-slate-800">
          <div className="flex items-start gap-3 min-w-0">
            {Icon && (
              <span className="mt-0.5 text-indigo-400 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <Icon size={18} />
              </span>
            )}
            <div className="min-w-0">
              <h3 className="text-base font-bold text-white truncate">{title}</h3>
              {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className="p-5 sm:p-6 text-slate-100">{children}</div>
    </div>
  );
}

function Field({ label, icon: Icon, value, name, onChange, type = "text", disabled, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-300">
        {Icon && <Icon size={13} className="text-indigo-400 opacity-80" />}
        {label}
      </span>
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </label>
  );
}

function Toggle({ label, description, checked: initial = false, small }) {
  const [checked, setChecked] = useState(initial);
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-200 dark:text-slate-100">{label}</p>
        {description && <p className="text-xs text-slate-200 dark:text-slate-100 mt-0.5">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => setChecked((c) => !c)}
        className={`relative inline-flex ${small ? "h-5 w-9" : "h-6 w-11"} shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 ${checked ? "bg-indigo-100" : "bg-slate-300 dark:bg-slate-700"
          }`}
      >
        <span
          className={`inline-block ${small ? "h-3.5 w-3.5" : "h-4.5 w-4.5"} transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? (small ? "translate-x-4.5" : "translate-x-6") : "translate-x-1"
            }`}
          style={{ transform: checked ? (small ? "translateX(18px)" : "translateX(22px)") : "translateX(3px)" }}
        />
      </button>
    </div>
  );
}

function ProgressBar({ label, value, tint = "indigo" }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-200 dark:text-slate-100">{label}</span>
        <span className="text-slate-200">{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
        <div
          className={`h-full rounded-full  transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function RadialProgress({ value, size = 96, stroke = 8, label }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="stroke-slate-100 dark:stroke-white/5" fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="stroke-indigo-500 transition-all duration-700"
        />
      </svg>
      <div className="-mt-16 flex h-24 flex-col items-center justify-center">
        <span className="text-lg font-bold text-slate-200 dark:text-white">{value}%</span>
      </div>
      <span className="text-xs font-medium text-slate-100 dark:text-slate-200 text-center">{label}</span>
    </div>
  );
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-lg bg-indigo-50 dark:bg-indigo-100/10 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-300 ring-1 ring-inset ring-indigo-500/20">
      {children}
    </span>
  );
}

function Select({ label, options = [], value, name, onChange, icon: Icon }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-300">
        {Icon && <Icon size={13} className="text-indigo-400 opacity-80" />}
        {label}
      </span>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 pr-9 text-sm text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
        >
          {options.map((o) => (
            <option key={o} value={o} className="bg-slate-900 text-slate-100">
              {o}
            </option>
          ))}
        </select>
        <ChevronDown size={15} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
    </label>
  );
}

function Button({ children, variant = "primary", icon: Icon, className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none active:scale-[0.98]";
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
    danger: "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20",
    ghost: "text-slate-400 hover:text-white hover:bg-slate-800/60",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon size={15} />}
      {children}
    </button>
  );
}

// Profile Section
function ProfileSection(user) {
  const emp = user.user || {};
  const [isChanged, setIsChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(emp.avatar);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: emp.name || "",
    email: emp.email || "",
    phone: emp.phone || "",
    dob: emp.dob || "",
    gender: emp.gender || "",
    address: emp.address || "",
    emergencyContact: emp.emergencyContact || "",
  });

  useEffect(() => {
    if (emp) {
      setAvatar(emp.avatar);
      setForm({
        name: emp.name || "",
        email: emp.email || "",
        phone: emp.phone || "",
        dob: emp.dob || "",
        gender: emp.gender || "",
        address: emp.address || "",
        emergencyContact: emp.emergencyContact || "",
      });
    }
  }, [emp]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsChanged(true);
  };

  // Handle Form & Avatar Update
  const handleFormUpdate = async () => {
    setLoading(true);
    const data = new FormData();
    data.append("name", form.name);
    data.append("phone", form.phone);
    data.append("dob", form.dob);
    if (form.gender) {
      data.append("gender", form.gender);
    }
    data.append("address", form.address);
    data.append("emergencyContact", form.emergencyContact);

    if (avatarFile) {
      data.append("avatar", avatarFile);
    }

    const res = await dispatch(profileUpdate(data));
    setLoading(false);
    if (res?.success) {
      setIsChanged(false);
      setAvatarFile(null);
    }
  };

  const handleChangeAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    const preview = URL.createObjectURL(file);
    setAvatar(preview);
    setAvatarFile(file);
    setIsChanged(true);
  };

  return (
    <div className="space-y-6">
      <Card
        title="Personal Profile Information"
        description="Update your avatar photo, contact details, and account profile"
        icon={UserCircle2}
        action={
          isChanged ? (
            <Button onClick={handleFormUpdate} disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20" icon={SaveAll}>
              {loading ? "Saving Profile..." : "Save Changes"}
            </Button>
          ) : (
            <Button icon={Edit3} variant="secondary">
              Profile Ready
            </Button>
          )
        }
      >
        <div className="mb-6 flex items-center gap-5 p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
          <div className="relative">
            <div className="h-20 w-20 rounded-2xl flex items-center justify-center text-white text-2xl font-semibold shadow-lg shadow-indigo-500/20 bg-slate-900 border border-slate-700 overflow-hidden">
              {avatar ? (
                <img className="h-full w-full object-cover" src={avatar} alt="Avatar" />
              ) : (
                <span className="font-bold text-indigo-400">{emp.name?.slice(0, 2).toUpperCase() || "CN"}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg ring-2 ring-slate-900 transition"
              title="Upload new profile picture"
            >
              <Camera size={14} />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChangeAvatar}
            />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Profile Photo</h3>
            <p className="text-xs text-slate-400 mt-0.5">Upload a new avatar. JPG, PNG, or WEBP up to 5MB.</p>
            <div className="flex items-center gap-3 mt-2.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
              >
                Choose Photo
              </button>
              {avatarFile && (
                <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} /> Photo selected! Click "Save Changes".
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" icon={UserCircle2} name="name" onChange={(e) => handleFormChange(e)} value={form.name} />
          <Field label="Email" icon={Mail} name="email" disabled={true} value={emp.email} type="email" />
          <Field label="Phone Number" icon={Phone} name="phone" onChange={(e) => handleFormChange(e)} value={form.phone} />
          <Field label="Date of Birth" icon={Calendar} onChange={(e) => handleFormChange(e)} name="dob" value={form.dob} type="date" />
          <Select label="Gender" icon={User} onChange={(e) => handleFormChange(e)} name="gender" value={form.gender} options={["Male", "Female", "Other", "Prefer not to say"]} />
          <Field label="Address" icon={MapPin} onChange={(e) => handleFormChange(e)} name="address" value={form.address} />
          <Field label="Emergency Contact" icon={Phone} onChange={(e) => handleFormChange(e)} name="emergencyContact" value={form.emergencyContact} className="sm:col-span-2" />
        </div>
      </Card>

      <Card title="Professional Information" description="Role, team and employment details" icon={Briefcase}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6">
          {[
            { label: "Employee ID", value: emp.id, icon: FileText },
            { label: "Department", value: emp.department, icon: Building2 },
            { label: "Designation", value: emp.designation, icon: Briefcase },
            { label: "Reporting Manager", value: emp.reportingManager, icon: User },
            { label: "Employment Type", value: emp.employmentType, icon: Briefcase },
            { label: "Joining Date", value: new Date(emp.joiningDate).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }), icon: Calendar },
            { label: "Work Mode", value: emp.workMode, icon: Laptop2 },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white dark:bg-white/5  ring-1 ring-slate-200 dark:ring-white/10 shrink-0">
                <item.icon size={15} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-200">{item.label}</p>
                <p className="text-sm font-medium text-slate-200 dark:text-slate-100 truncate">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-5">
          <p className="text-xs font-medium text-slate-100 dark:text-slate-200 mb-2">Skills</p>
          <div className="flex flex-wrap gap-2">
            {emp?.skills?.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
            <button className="inline-flex items-center gap-1 rounded-lg border border-dashed border-slate-300 dark:border-white/15 px-2.5 py-1 text-xs font-medium text-slate-200  hover:border-indigo-300 transition">
              <Plus size={12} /> Add
            </button>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-100 dark:text-slate-200 mb-2">Bio</p>
          <p className="text-sm leading-relaxed text-slate-100 dark:text-slate-100">{emp.bio}</p>
        </div>
      </Card>

      {/* <Card title="Work Statistics" description="Snapshot of your current workload" icon={TrendingUp}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {workStats.map((s) => {
            const t = tintMap[s.tint];
            return (
              <div key={s.label} className={`rounded-xl border border-slate-100 dark:border-white/5 p-4 ${t.bg} transition-transform hover:-translate-y-0.5 duration-200`}>
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-white/10 ${t.text} mb-3 ring-1 ${t.ring}`}>
                  <s.icon size={15} />
                </span>
                <p className="text-xl font-bold text-slate-200 dark:text-white">{s.value}</p>
                <p className="text-xs text-slate-100 dark:text-slate-200 mt-0.5">{s.label}</p>
              </div>
            );
          })}
        </div>
      </Card> */}

      {/* <Card title="Performance" description="Rolling 30-day performance indicators" icon={Target}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-2">
          {performance.map((p) => (
            <RadialProgress key={p.label} value={p.value} label={p.label} size={92} />
          ))}
        </div>
      </Card> */}

      {/* <Card title="Recent Activity" description="Your latest actions across projects" icon={ActivityIcon}>
        <ol className="relative border-l border-slate-100 dark:border-white/10 pl-6 space-y-6">
          {activityFeed.map((a, i) => {
            const t = tintMap[a.tint];
            return (
              <li key={i} className="relative">
                <span className={`absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white dark:ring-slate-900 ${t.bg} ${t.text}`}>
                  <a.icon size={12} />
                </span>
                <p className="text-sm font-medium text-slate-200 dark:text-slate-100">{a.title}</p>
                <p className="text-sm text-slate-100 dark:text-slate-200">{a.desc}</p>
                <p className="text-xs text-slate-200 dark:text-slate-100 mt-1">{a.time}</p>
              </li>
            );
          })}
        </ol>
      </Card> */}
    </div>
  );
}

// Company Section
function CompanySection(props) {
  const emp = props.user || props;
  const isAdmin = emp?.role === "admin";
  const company = emp?.company || {};

  const [isChanged, setisChanged] = useState(false);
  const [avatar, setAvatar] = useState(company?.logo);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const [form, setform] = useState({
    name: company?.name || "",
    logo: company?.logo || "",
    email: company?.email || "",
    phone: company?.phone || "",
    foundedYear: company?.foundedYear || "",
    industry: company?.industry || "",
    address: company?.address || "",
    website: company?.website || "",
    size: company?.companySize || "",
    primaryColor: company?.primaryColor || "",
    secondaryColor: company?.secondaryColor || "",
    officeStartTime: company?.officeStartTime || "",
    officeEndTime: company?.officeEndTime || "",
    timeZone: company?.timezone || "",
    currency: company?.currency || "",
    workingDays: company?.workingDays || "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setform((prev) => ({
      ...prev,
      [name]: value,
    }));
    setisChanged(true);
  };

  const handleFormUpdate = () => {
    const data = new FormData();
    data.append("name", form.name);
    data.append("email", form.email);
    data.append("phone", form.phone);
    data.append("foundedYear", form.foundedYear);
    data.append("industry", form.industry);
    data.append("website", form.website);
    data.append("companySize", form.size);
    data.append("address", form.address);
    if (avatarFile) {
      data.append("logo", avatarFile);
    }
    dispatch(updateCompanyInfo(data));
    setisChanged(false);
  };

  const handleChangeAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const preview = URL.createObjectURL(file);
    setAvatar(preview);
    setAvatarFile(file);
    setisChanged(true);
  };

  // If user is NOT admin, show clean READ-ONLY company view
  if (!isAdmin) {
    const details = [
      { label: "Company Name", value: company?.name || "N/A", icon: Building2 },
      { label: "Business Email", value: company?.email || "N/A", icon: Mail },
      { label: "Phone Number", value: company?.phone || "N/A", icon: Phone },
      { label: "Industry", value: company?.industry || "N/A", icon: Briefcase },
      { label: "Company Size", value: company?.companySize || "N/A", icon: UserCircle2 },
      { label: "Founded Year", value: company?.foundedYear || "N/A", icon: Calendar },
      { label: "Website", value: company?.website || "N/A", icon: Globe },
      { label: "Address", value: company?.address || "N/A", icon: MapPin },
    ];

    return (
      <div className="space-y-6">
        <Card
          title="Organization Details"
          description="Read-only view of your company workspace"
          icon={Building2}
        >
          <div className="mb-6 flex items-center gap-4 border-b border-slate-100 dark:border-white/10 pb-6">
            <div className="h-16 w-16 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xl overflow-hidden border border-indigo-500/20">
              {company?.logo ? (
                <img src={company.logo} alt={company.name} className="h-full w-full object-cover" />
              ) : (
                (company?.name || "CN").slice(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">{company?.name || "CampusNest Organization"}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{company?.industry || "Workspace"} • {company?.companySize || "1-10"} members</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {details.map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] p-3.5 border border-slate-200/60 dark:border-white/5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white dark:bg-white/5 ring-1 ring-slate-200 dark:ring-white/10 text-indigo-500 shrink-0">
                  <item.icon size={16} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-100 truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // Admin editable view
  return (
    <div className="space-y-6">
      <Card
        title="Company Information"
        description="Manage your organization settings (Admin only)"
        icon={UserCircle2}
        action={isChanged ? (<Button onClick={handleFormUpdate} className="bg-indigo-600 text-white" icon={SaveAll}>Save Changes</Button>) : null}
      >
        <div className="mb-6 flex items-center gap-4">
          <div className="relative">
            <div className="h-20 w-20 rounded-2xl bg-slate-800 flex items-center justify-center text-white text-2xl font-semibold shadow-lg overflow-hidden border border-slate-700">
              {avatar ? (
                <img className="h-full w-full object-cover" src={avatar} alt="Logo" />
              ) : (
                (form.name || "CN").slice(0, 2).toUpperCase()
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white shadow ring-2 ring-slate-900 hover:bg-indigo-500 transition"
            >
              <Camera size={13} />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleChangeAvatar} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">Organization Logo</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">JPG or PNG. Max 4MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Company Name" icon={UserCircle2} name="name" onChange={handleFormChange} value={form.name} />
          <Field label="Company Email" icon={Mail} name="email" disabled={true} value={form.email} type="email" />
          <Field label="Company Phone Number" icon={Phone} name="phone" onChange={handleFormChange} value={form.phone} />
          <Field label="Founded Year" icon={Calendar} onChange={handleFormChange} name="foundedYear" value={form.foundedYear} />
          <Select label="Industry" icon={Briefcase} onChange={handleFormChange} name="industry" value={form.industry} options={["Sole Proprietorship", "Partnership", "Limited Liability Company", "Corporation (e.g., C-Corp or S-Corp)", "Cooperative", "Education / College", "Technology"]} />
          <Field label="Company Address" icon={MapPin} onChange={handleFormChange} name="address" value={form.address} />
          <Select label="Company Size" icon={UserCircle2} onChange={handleFormChange} name="size" value={form.size} options={["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]} />
          <Field label="Website" icon={Globe} onChange={handleFormChange} name="website" value={form.website} className="sm:col-span-2" />
        </div>
      </Card>
    </div>
  );
}

// Settings Sub sections
function Settings() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = ()=>{
    dispatch(logout())
    navigate("/login")

    console.log("Logout");
  }
  return (
    <div>
      <button onClick={handleLogout} className="bg-primary text-white bg-hover  p-2 px-4 rounded-2xl">LogOut</button>
    </div>
  );
}

function NotificationsSection() {
  const items = [
    ["Task Assigned", "Get notified when a new task is assigned to you"],
    ["Task Updated", "Changes made to tasks you're following"],
    ["Task Completed", "When a task you created is marked complete"],
    ["Comments", "New comments on your tasks and projects"],
    ["Mentions", "Someone @mentions you"],
    ["Project Updates", "Milestones and status changes on your projects"],
    ["Deadline Reminders", "Upcoming due dates for your tasks"],
    ["Email Notifications", "Receive a copy of notifications via email"],
    ["Push Notifications", "Receive notifications on your devices"],
  ];
  return (
    <Card title="Notifications" description="Choose what you want to be notified about" icon={Bell}>
      <div className="divide-y divide-slate-100 dark:divide-white/5">
        {items.map(([label, desc], i) => (
          <Toggle key={label} label={label} description={desc} checked={i < 6} />
        ))}
      </div>
    </Card>
  );
}

function AppearanceSection() {
  const { theme, setTheme, accent, setAccent, font, setFont, FONT_OPTIONS } = useTheme();

  return (
    <div className="space-y-6">
      <Card title="Interface Theme" description="Choose light or dark visual theme for your workspace" icon={Palette}>
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: "light", label: "Light Mode", icon: Sun, desc: "Clean slate background with high contrast" },
            { id: "dark", label: "Dark Mode", icon: Moon, desc: "Sleek dark glassmorphic interface" },
          ].map((t) => {
            const active = theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`flex flex-col items-start p-4 rounded-xl border transition-all text-left ${
                  active
                    ? "bg-slate-800/80 text-white border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg"
                    : "bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <t.icon size={18} className={active ? "text-indigo-400" : "text-slate-400"} />
                    <span>{t.label}</span>
                  </div>
                  {active && <CheckCircle2 size={16} className="text-indigo-400" />}
                </div>
                <p className="text-xs text-slate-400">{t.desc}</p>
              </button>
            );
          })}
        </div>
      </Card>

      <Card title="Accent Brand Color" description="Select the primary brand highlight color applied across buttons, cards, and active indicators" icon={Sparkles}>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {accentColors.map((c) => {
              const isSelected = accent?.toLowerCase() === c.value.toLowerCase();
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setAccent(c.value)}
                  aria-label={c.name}
                  className={`relative flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-slate-800 text-white border-indigo-500 ring-2 ring-indigo-500/20"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <span
                    className="h-6 w-6 rounded-full shadow-inner flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: c.value }}
                  >
                    {isSelected && <CheckCircle2 size={14} className="text-white drop-shadow" />}
                  </span>
                  <span className="text-xs font-semibold">{c.name}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Active Primary Theme Color</span>
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full" style={{ backgroundColor: accent }} />
              <span className="text-xs font-mono font-bold text-indigo-400">{accent}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Typography Font Family" description="Choose the typeface used across the interface text, headings, and labels" icon={Type}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {FONT_OPTIONS?.map((f) => {
            const isSelected = font === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFont(f.id)}
                className={`flex flex-col items-start p-4 rounded-xl border transition-all text-left ${
                  isSelected
                    ? "bg-slate-800/90 text-white border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg"
                    : "bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className="text-sm font-bold text-white" style={{ fontFamily: f.stack }}>
                    {f.name}
                  </span>
                  {isSelected && <CheckCircle2 size={16} className="text-indigo-400 flex-shrink-0" />}
                </div>
                <p className="text-xs text-slate-400 mb-3">{f.desc}</p>
                <div className="w-full pt-2 border-t border-slate-800/80">
                  <span className="text-xs font-medium text-slate-300 tracking-wide" style={{ fontFamily: f.stack }}>
                    Aa Bb Cc 123
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function PreferencesSection() {
  return (
    <Card title="Preferences" description="Regional and formatting settings" icon={Globe}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Language" icon={Globe} options={["English (US)", "Hindi", "Punjabi", "Spanish", "French"]} />
        <Select label="Time Zone" icon={Clock} options={["(GMT+5:30) India Standard Time", "(GMT+0:00) UTC", "(GMT-5:00) Eastern Time", "(GMT+1:00) Central European Time"]} />
        <Select label="Date Format" icon={Calendar} options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]} />
        <Select label="Time Format" icon={Clock} options={["12-hour", "24-hour"]} />
        <Select label="Week Starts On" icon={Calendar} options={["Monday", "Sunday"]} />
      </div>
    </Card>
  );
}

function AISection() {
  const [creativity, setCreativity] = useState(60);
  const toggles = [
    ["Enable AI Assistant", "Turn on the WorkForce AI assistant across the app"],
    ["Smart Task Priority", "Let AI reorder your task list by urgency"],
    ["AI Task Breakdown", "Automatically split large tasks into sub-tasks"],
    ["AI Daily Summary", "Get a daily digest of your progress"],
    ["AI Weekly Report", "Get a weekly performance report"],
    ["AI Meeting Notes", "Auto-generate notes from linked meetings"],
    ["AI Deadline Prediction", "Predict realistic completion dates for tasks"],
  ];
  return (
    <div className="space-y-6">
      <Card title="AI Settings" description="Control how AI assists you inside WorkForce" icon={Sparkles}>
        <div className="divide-y divide-slate-100 dark:divide-white/5">
          {toggles.map(([label, desc], i) => (
            <Toggle key={label} label={label} description={desc} checked={i < 4} />
          ))}
        </div>
      </Card>
      <Card title="AI Creativity Level" description="Balance between focused and exploratory AI suggestions" icon={BrainCircuit}>
        <div className="flex items-center gap-4">
          <Zap size={15} className="text-slate-200 shrink-0" />
          <input
            type="range"
            min={0}
            max={100}
            value={creativity}
            onChange={(e) => setCreativity(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
          <span className="w-10 shrink-0 text-right text-sm font-semibold text-slate-100 dark:text-slate-200">{creativity}</span>
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-slate-200">
          <span>Focused</span>
          <span>Balanced</span>
          <span>Exploratory</span>
        </div>
      </Card>
    </div>
  );
}

function PrivacySection() {
  return (
    <Card title="Privacy" description="Control what others can see about you" icon={EyeOff}>
      <div className="divide-y divide-slate-100 dark:divide-white/5">
        <Toggle label="Show Email" description="Display your email on your public profile" checked />
        <Toggle label="Show Phone Number" description="Display your phone number on your public profile" />
        <Toggle label="Show Online Status" description="Let teammates see when you're active" checked />
        <Toggle label="Show Activity" description="Let teammates see your recent activity feed" checked />
      </div>
      <div className="mt-4">
        <Select label="Profile Visibility" icon={Eye} options={["Everyone", "Team Only", "Only Me"]} />
      </div>
    </Card>
  );
}

function ActivitySection() {
  return (
    <Card title="Activity" description="A complete timeline of your recent actions" icon={ActivityIcon}>
      <ol className="relative border-l border-slate-100 dark:border-white/10 pl-6 space-y-6">
        {[...activityFeed, ...activityFeed.slice(0, 2)].map((a, i) => {
          const t = tintMap[a.tint];
          return (
            <li key={i} className="relative">
              <span className={`absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white dark:ring-slate-900 ${t.bg} ${t.text}`}>
                <a.icon size={12} />
              </span>
              <p className="text-sm font-medium text-slate-200 dark:text-slate-100">{a.title}</p>
              <p className="text-sm text-slate-100 dark:text-slate-200">{a.desc}</p>
              <p className="text-xs text-slate-200 dark:text-slate-100 mt-1">{a.time}</p>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

function AboutSection() {
  const rows = [
    ["Application Version", "3.4.1"],
    ["Build Number", "2026.07.02-b118"],
    ["Last Updated", "July 2, 2026"],
    ["License", "Proprietary \u2014 Enterprise"],
    ["Developer", "WorkForce Engineering Team"],
  ];
  return (
    <div className="space-y-6">
      <Card title="About WorkForce" description="Application and build information" icon={Info}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rows.map(([label, value]) => (
            <div key={label} className="rounded-xl bg-slate-50 dark:bg-white/[0.03] px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-200">{label}</p>
              <p className="text-sm font-medium text-slate-200 dark:text-slate-100">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="secondary" icon={ScrollText}>View Changelog</Button>
          <Button variant="secondary" icon={ShieldCheck}>Privacy Policy</Button>
          <Button variant="secondary" icon={ExternalLink}>Terms of Service</Button>
        </div>
      </Card>
    </div>
  );
}

// Sidebar
function Sidebar({ active, setActive, user, dark, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 transform bg-slate-900 border-r border-slate-800 transition-transform duration-300 lg:static lg:translate-x-0 lg:z-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:sticky lg:top-0 lg:h-screen overflow-y-auto shadow-2xl flex flex-col justify-between`}
      >
        <div>
          <div className="flex items-center justify-between px-5 pt-5 lg:hidden border-b border-slate-800 pb-4">
            <span className="text-sm font-bold text-white uppercase tracking-wider">Settings Menu</span>
            <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <div className="px-5 pt-6 pb-5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400 overflow-hidden text-lg">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    user?.name?.slice(0, 2).toUpperCase() || "CN"
                  )}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {user?.role || "Member"}
                </span>
              </div>
            </div>
          </div>

          <nav className="px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = active === item.key;
              const Icon = item.icon || User;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActive(item.key);
                    setMobileOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}

// Main
export default function EmployeeProfileSettings() {
  const [active, setActive] = useState("company");
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const activeLabel = navItems.find((n) => n.key === active)?.label ?? "Company";
  const sectionDescriptions = {
    company: "View and manage organization details",
    profile: "View and manage your personal and professional profile",
    settings: "Account security, active sessions, and password management",
    appearance: "Customize interface theme and visual preferences",
  };

  return (
    <div className="min-h-screen pb-24 md:pb-6 md:ml-60 bg-slate-950 text-slate-100 font-sans">
      <div className="flex">
        <Sidebar active={active} user={user} setActive={setActive} dark={isDark} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <div className="flex-1 bg-slate-950 text-slate-100 min-w-0">
          {/* Top bar (mobile) */}
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800 bg-slate-900/90 backdrop-blur px-4 py-3 lg:hidden">
            <button onClick={() => setMobileOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-200">
              <Menu size={18} />
            </button>
            <span className="text-sm font-bold text-white">{activeLabel}</span>
            <button onClick={toggleTheme} className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-200">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
            <div className="hidden lg:flex items-center justify-between pb-5 border-b border-slate-800">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-1">Preferences & Account</p>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{activeLabel}</h1>
                <p className="text-sm text-slate-400 mt-1">{sectionDescriptions[active]}</p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition shadow-lg"
              >
                {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-400" />}
                {isDark ? "Light Theme" : "Dark Theme"}
              </button>
            </div>

            {active === "company" && <CompanySection user={user} />}
            {active === "profile" && <ProfileSection user={user} />}
            {active === "settings" && <Settings />}
            {active === "appearance" && <AppearanceSection />}
          </main>
        </div>
      </div>
    </div>
  );
}
