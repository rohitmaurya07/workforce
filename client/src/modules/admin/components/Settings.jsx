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
  School,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { profileUpdate } from "../redux/userSlice";
import { updateCompanyInfo } from "../redux/adminSlice";



const employee = {
  name: "Ananya Sharma",
  id: "EMP-2291",
  designation: "Senior Frontend Engineer",
  department: "Product Engineering",
  email: "ananya.sharma@nexora.io",
  phone: "+91 98765 43210",
  dob: "1997-04-18",
  gender: "Female",
  address: "B-402, Silver Oak Residency, Jalandhar, Punjab, IN",
  emergencyContact: "Rahul Sharma · +91 91234 56789",
  reportingManager: "Vikram Anand",
  employmentType: "Full-time",
  joiningDate: "2022-03-14",
  workMode: "Hybrid",
  skills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "Redux Toolkit", "Socket.IO", "GraphQL"],
  bio: "Frontend engineer focused on building fast, accessible interfaces for internal tooling. Enjoys design systems, real-time features, and mentoring new joiners.",
  profileCompletion: 82,
};

const workStats = [
  { label: "Active Projects", value: 6, icon: FolderPlus, tint: "indigo" },
  { label: "Completed Projects", value: 24, icon: CheckCircle2, tint: "emerald" },
  { label: "Active Tasks", value: 14, icon: ListTodo, tint: "violet" },
  { label: "Completed Tasks", value: 312, icon: Award, tint: "emerald" },
  { label: "Overdue Tasks", value: 2, icon: AlertTriangle, tint: "rose" },
  { label: "Weekly Hours", value: "38.5h", icon: Timer, tint: "amber" },
  { label: "Attendance", value: "96%", icon: Calendar, tint: "sky" },
  { label: "Leave Balance", value: "9 days", icon: Briefcase, tint: "indigo" },
];

const performance = [
  { label: "Task Completion Rate", value: 88 },
  { label: "Productivity Score", value: 92 },
  { label: "Attendance", value: 96 },
  { label: "Weekly Goal Progress", value: 74 },
];

const activityFeed = [
  { icon: CheckCircle2, title: "Completed task", desc: "Finalized \u2018Payment Retry Flow\u2019 in WorkForce Billing", time: "2h ago", tint: "emerald" },
  { icon: FileUp, title: "Uploaded file", desc: "Added design-tokens.json to Design System repo", time: "5h ago", tint: "indigo" },
  { icon: MessageSquare, title: "Commented on project", desc: "Left feedback on \u2018Notifications Revamp\u2019", time: "Yesterday", tint: "violet" },
  { icon: FolderPlus, title: "Joined new project", desc: "Added to \u2018Mobile Onboarding v2\u2019", time: "2 days ago", tint: "sky" },
  { icon: Clock, title: "Logged work hours", desc: "Logged 7.5 hours across 3 tasks", time: "3 days ago", tint: "amber" },
];

const sessions = [
  { device: "MacBook Pro \u2014 Chrome", location: "Jalandhar, IN", icon: Laptop2, current: true },
  { device: "iPhone 14 \u2014 App", location: "Jalandhar, IN", icon: Smartphone, current: false },
  { device: "Windows PC \u2014 Edge", location: "Mohali, IN", icon: Monitor, current: false },
];

const accentColors = [
  { name: "Indigo", value: "#6366f1" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Sky", value: "#0ea5e9" },
  { name: "Emerald", value: "#10b981" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Rose", value: "#f43f5e" },
];

const navItems = [
  { key: "company", label: "Company", icon: School },
  { key: "profile", label: "Profile", icon: User },
  { key: "security", label: "Security", icon: Shield },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "preferences", label: "Preferences", icon: SlidersHorizontal },
  { key: "ai", label: "AI Settings", icon: Sparkles },
  { key: "privacy", label: "Privacy", icon: EyeOff },
  { key: "activity", label: "Activity", icon: ActivityIcon },
  { key: "about", label: "About", icon: Info },
];

const tintMap = {
  indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400", ring: "ring-indigo-500/20" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-400", ring: "ring-rose-500/20" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20" },
};

// small reusable primitives

function Card({ title, description, icon: Icon, action, children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 shadow-sm hover:shadow-md dark:shadow-none transition-shadow duration-300 ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-start gap-3 min-w-0">
            {Icon && (
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Icon className="h-4.5 w-4.5" size={18} />
              </span>
            )}
            <div className="min-w-0">
              <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white truncate">{title}</h3>
              {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

function Field({ label, icon: Icon, value, name, onChange, type = "text", disabled, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
        {Icon && <Icon size={13} className="opacity-70" />}
        {label}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
      />
    </label>
  );
}

function Toggle({ label, description, checked: initial = false, small }) {
  const [checked, setChecked] = useState(initial);
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{label}</p>
        {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => setChecked((c) => !c)}
        className={`relative inline-flex ${small ? "h-5 w-9" : "h-6 w-11"} shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 ${checked ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-700"
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
        <span className="font-medium text-slate-600 dark:text-slate-300">{label}</span>
        <span className="text-slate-400">{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
        <div
          className={`h-full rounded-full bg-gradient-to-r from-${tint}-500 to-violet-500 transition-all duration-700`}
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
        <span className="text-lg font-bold text-slate-800 dark:text-white">{value}%</span>
      </div>
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center">{label}</span>
    </div>
  );
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-300 ring-1 ring-inset ring-indigo-500/20">
      {children}
    </span>
  );
}

function Select({ label, options, value, name, onChange, icon: Icon }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
        {Icon && <Icon size={13} className="opacity-70" />}
        {label}
      </span>
      <div className="relative">
        <select className="w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2.5 pr-9 text-sm text-slate-800 dark:text-slate-100 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10">
          name={name}
          value={value}
          onChange={onChange}
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
    </label>
  );
}

function Button({ children, variant = "primary", icon: Icon, className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 active:scale-[0.98]";
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-sm shadow-indigo-500/30 hover:shadow-md hover:shadow-indigo-500/40",
    secondary: "bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10",
    danger: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20",
    ghost: "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5",
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
  const emp = user.user
  const [isChanged, setisChanged] = useState(false)
  const [avatar, setAvatar] = useState(emp.avatar);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch()
  const [form, setform] = useState({
    "name": emp.name || "",
    "email": emp.email,
    "phone": emp.phone || "",
    "dob": emp.dob || "",
    "gender": emp.gender || "",
    "address": emp.address || "",
    "emergencyContact": emp.emergencyContact || "",
  })

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setform((prev) => ({
      ...prev,
      [name]: value,
    }));

    setisChanged(true);
  };


  // Handle Form Update
  const handleFormUpdate = () => {
    console.log(form)
    const data = new FormData();

    data.append("name", form.name);
    data.append("phone", form.phone);
    data.append("dob", form.dob);
    data.append("gender", form.gender);
    data.append("address", form.address);
    data.append("emergencyContact", form.emergencyContact);

    if (avatarFile) {
      data.append("avatar", avatarFile);
    }
    dispatch(profileUpdate(data))
    setisChanged(false)
  }


  const handleChangeAvatar = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validate image
    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      alert("Image size should be less than 4MB.");
      return;
    }

    // Local preview
    const preview = URL.createObjectURL(file);
    setAvatar(preview);
    setisChanged(true)

    setAvatarFile(file);                  // Save actual file
    setisChanged(true);
  };


  return (
    <div className="space-y-6">
      <Card
        title="Personal Information"
        description="Your basic contact and identity details"
        icon={UserCircle2}
        action={isChanged ? (<Button onClick={handleFormUpdate} className="bg-blue-700 text-white" icon={SaveAll} >Save Changes</Button>) : (<Button icon={Edit3} variant="secondary">Edit Profile</Button>)}
      >
        <div className="mb-6 flex items-center gap-4">
          <div className="relative">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-2xl font-semibold shadow-lg shadow-indigo-500/20">
              <img
                className="h-full w-full rounded-2xl object-cover"
                src={avatar}
                alt="Avatar"
              />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 shadow ring-1 ring-slate-200 dark:ring-white/10"
            >
              <Camera size={13} />
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
            <p className="text-sm font-semibold text-slate-800 dark:text-white">Profile photo</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">JPG or PNG. Max 4MB.</p>
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
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white dark:bg-white/5 text-indigo-500 ring-1 ring-slate-200 dark:ring-white/10 shrink-0">
                <item.icon size={15} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{item.label}</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-5">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Skills</p>
          <div className="flex flex-wrap gap-2">
            {emp?.skills?.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
            <button className="inline-flex items-center gap-1 rounded-lg border border-dashed border-slate-300 dark:border-white/15 px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-indigo-500 hover:border-indigo-300 transition">
              <Plus size={12} /> Add
            </button>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Bio</p>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{emp.bio}</p>
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
                <p className="text-xl font-bold text-slate-800 dark:text-white">{s.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
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
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{a.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{a.desc}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{a.time}</p>
              </li>
            );
          })}
        </ol>
      </Card> */}
    </div>
  );
}
// Company Section

function CompanySection(user) {
  const emp = user.user
  const [isChanged, setisChanged] = useState(false)
  const [isChangedHR, setisChangedHR] = useState(false)
  const [isChangedBR, setisChangedBR] = useState(false)
  const [avatar, setAvatar] = useState(emp.avatar);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch()
  const [form, setform] = useState({
    "name": emp.company.name || "",
    "email": emp.company.email || "",
    "phone": emp.company.phone || "",
    "foundedYear": emp.company.foundedYear || "",
    "industry": emp.company.industry || "",
    "address": emp.company.address || "",
    "website": emp.company.website || "",
    "size": emp.company.companySize || "",


    "primaryColor": emp.company.primaryColor || "",
    "secondaryColor": emp.company.secondaryColor || "",

    "officeStartTime": emp.company.officeStartTime || "",
    "officeEndTime": emp.company.officeEndTime || "",
    "timeZone": emp.company.timezone || "",
    "currency": emp.company.currency || "",
    "workingDays": emp.company.workingDays || "",
  })

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    console.log(e.target)
    setform((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name == "primaryColor" || name == "secondaryColor") {
      setisChangedBR(true)
    }
    if (
      name === "officeStartTime" ||
      name === "officeEndTime" ||
      name === "workingDays" ||
      name === "currency" ||
      name === "timeZone"
    ) {
      setisChangedHR(true)
    }

    setisChanged(true);
  };


  // Handle Form Update
  const handleFormUpdate = () => {
    console.log("form : ", form)

    const data = new FormData();
    data.append("name", form.name);
    data.append("email", form.email);
    data.append("phone", form.phone);
    data.append("foundedYear", form.foundedYear);
    data.append("industry", form.industry);
    data.append("website", form.website);
    data.append("companySize", form.size);
    data.append("address", form.address);
    data.append("emergencyContact", form.emergencyContact);
    data.append("primaryColor", form.primaryColor);
    data.append("secondaryColor", form.secondaryColor);
    data.append("officeStartTime", form.officeStartTime);
    data.append("officeEndTime", form.officeEndTime);
    data.append("workingDays", form.workingDays);
    data.append("currency", form.currency);
    data.append("timezone", form.timeZone);
    if (avatarFile) {
      data.append("logo", avatarFile);
    }
    dispatch(updateCompanyInfo(data))
    setisChanged(false)
  }


  const handleChangeAvatar = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validate image
    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      alert("Image size should be less than 4MB.");
      return;
    }
    // Local preview
    const preview = URL.createObjectURL(file);
    setAvatar(preview);
    setisChanged(true)

    setAvatarFile(file);                  // Save actual file
    setisChanged(true);
  };


  return (
    <div className="space-y-6">
      <Card
        title="Company Information"
        description="Your basic company details"
        icon={UserCircle2}
        action={isChanged ? (<Button onClick={handleFormUpdate} className="bg-blue-700 text-white" icon={SaveAll} >Save Changes</Button>) : (<Button icon={Edit3} variant="secondary">Edit Profile</Button>)}
      >
        <div className="mb-6 flex items-center gap-4">
          <div className="relative">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-2xl font-semibold shadow-lg shadow-indigo-500/20">
              <img
                className="h-full w-full rounded-2xl object-cover"
                src={avatar}
                alt="Avatar"
              />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 shadow ring-1 ring-slate-200 dark:ring-white/10"
            >
              <Camera size={13} />
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
            <p className="text-sm font-semibold text-slate-800 dark:text-white">Logo</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">JPG or PNG. Max 4MB.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Company Name" icon={UserCircle2} name="name" onChange={(e) => handleFormChange(e)} value={form.name} />
          <Field label="Company Email" icon={Mail} name="email" disabled={true} value={form.email} type="email" />
          <Field label="Company Phone Number" icon={Phone} name="phone" onChange={(e) => handleFormChange(e)} value={form.phone} />
          <Field label="Founded Year" icon={Calendar} onChange={(e) => handleFormChange(e)} name="foundedYear" value={form.foundedYear} />
          <Select label="Industry" icon={User} onChange={(e) => handleFormChange(e)} name="industry" options={[form.industry, "Sole Proprietorship", "Partnership", "Limited Liability Company", "Corporation (e.g., C-Corp or S-Corp)", "Cooperative"]} />
          <Field label="Company Address" icon={MapPin} onChange={(e) => handleFormChange(e)} name="address" value={form.address} />
          <Select label="Company Size" icon={User} onChange={(e) => handleFormChange(e)} name="size" options={[form.size, "1-10",
            "11-50",
            "51-200",
            "201-500",
            "501-1000",
            "1000+",]} />
          <Field label="Website" icon={Phone} onChange={(e) => handleFormChange(e)} name="website" value={form.website} className="sm:col-span-2" />
        </div>
      </Card>

      {/* Hr Settings */}
      <Card
        title="HR Information"
        description="Your basic company details"
        icon={UserCircle2}
        action={isChangedHR ? (<Button onClick={handleFormUpdate} className="bg-blue-700 text-white" icon={SaveAll} >Save Changes</Button>) : (<Button icon={Edit3} variant="secondary">Edit Profile</Button>)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Office Start Time" icon={UserCircle2} name="officeStartTime" onChange={(e) => handleFormChange(e)} value={form.officeStartTime} />
          <Field label="Office End Time" icon={Mail} name="officeEndTime" value={form.officeEndTime} type="email" />
          <Field label="Currency" icon={Mail} name="currency" disabled={true} value={form.currency} type="email" />
          <Select
            label="Working Days"
            icon={User}
            name="workingDays"
            value={form.workingDays}
            onChange={handleFormChange}
            options={[
"Monday-Friday",
"Monday-Saturday",
"All Week"
]}
          />
          <Field label="Time Zone" icon={MapPin} onChange={(e) => handleFormChange(e)} name="timeZone" value={form.timeZone} />
        </div>
      </Card>

      {/* Branding*/}
      <Card
        title="Branding"
        description="Your basic company details"
        icon={UserCircle2}
        action={isChangedBR ? (<Button onClick={handleFormUpdate} className="bg-blue-700 text-white" icon={SaveAll} >Save Changes</Button>) : (<Button icon={Edit3} variant="secondary">Edit Profile</Button>)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Primary Color" icon={UserCircle2} name="primaryColor" onChange={(e) => handleFormChange(e)} value={form.primaryColor} />
          <Field label="Secondary Color" icon={Mail} name="secondaryColor" onChange={(e) => handleFormChange(e)} value={form.secondaryColor} type="email" />
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
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white dark:bg-white/5 text-indigo-500 ring-1 ring-slate-200 dark:ring-white/10 shrink-0">
                <item.icon size={15} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{item.label}</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-5">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Skills</p>
          <div className="flex flex-wrap gap-2">
            {emp?.skills?.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
            <button className="inline-flex items-center gap-1 rounded-lg border border-dashed border-slate-300 dark:border-white/15 px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-indigo-500 hover:border-indigo-300 transition">
              <Plus size={12} /> Add
            </button>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Bio</p>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{emp.bio}</p>
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
                <p className="text-xl font-bold text-slate-800 dark:text-white">{s.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
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
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{a.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{a.desc}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{a.time}</p>
              </li>
            );
          })}
        </ol>
      </Card> */}
    </div>
  );
}

// Settings Sub sections

function SecuritySection() {
  return (
    <div className="space-y-6">
      <Card title="Password & Authentication" description="Manage how you sign in" icon={KeyRound}
        action={<Button icon={KeyRound} variant="secondary">Change Password</Button>}>
        <Toggle label="Two-Factor Authentication" description="Add an extra layer of security using an authenticator app" />
      </Card>
      <Card title="Active Sessions" description="Devices currently signed in to your account" icon={Monitor}
        action={<Button icon={LogOut} variant="danger">Logout All Devices</Button>}>
        <div className="divide-y divide-slate-100 dark:divide-white/5">
          {sessions.map((s) => (
            <div key={s.device} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-300">
                  <s.icon size={16} />
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{s.device}</p>
                  <p className="text-xs text-slate-400">{s.location}</p>
                </div>
              </div>
              {s.current ? (
                <span className="text-xs font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg">This device</span>
              ) : (
                <Button variant="ghost" className="!px-2 !py-1 text-xs">Revoke</Button>
              )}
            </div>
          ))}
        </div>
      </Card>
      <Card title="Last Login" description="Most recent sign-in activity" icon={Clock}>
        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
          <Calendar size={15} className="text-slate-400" />
          <span>Today at 9:14 AM \u00b7 Jalandhar, IN \u00b7 Chrome on macOS</span>
        </div>
      </Card>
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

function AppearanceSection({ dark, setDark }) {
  const [accent, setAccent] = useState(accentColors[0].value);
  return (
    <div className="space-y-6">
      <Card title="Theme" description="Choose how WorkForce looks on your device" icon={Palette}>
        <div className="grid grid-cols-2 gap-3">
          {[{ id: "light", label: "Light", icon: Sun }, { id: "dark", label: "Dark", icon: Moon }].map((t) => {
            const active = (t.id === "dark") === dark;
            return (
              <button
                key={t.id}
                onClick={() => setDark(t.id === "dark")}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${active
                  ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 ring-4 ring-indigo-500/10"
                  : "border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                  }`}
              >
                <t.icon size={15} /> {t.label}
              </button>
            );
          })}
        </div>
      </Card>
      <Card title="Accent Color" description="Pick the primary color used across the app" icon={Palette}>
        <div className="flex flex-wrap gap-3">
          {accentColors.map((c) => (
            <button
              key={c.value}
              onClick={() => setAccent(c.value)}
              aria-label={c.name}
              className="h-9 w-9 rounded-full ring-2 ring-offset-2 dark:ring-offset-slate-900 transition"
              style={{ backgroundColor: c.value, ringColor: accent === c.value ? c.value : "transparent" }}
            />
          ))}
        </div>
      </Card>
      <Card title="Display" description="Fine-tune density and motion" icon={SlidersHorizontal}>
        <div className="divide-y divide-slate-100 dark:divide-white/5">
          <Toggle label="Compact Mode" description="Reduce padding for a denser layout" />
          <Toggle label="Reduced Motion" description="Minimize animations and transitions" />
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
          <Zap size={15} className="text-slate-400 shrink-0" />
          <input
            type="range"
            min={0}
            max={100}
            value={creativity}
            onChange={(e) => setCreativity(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
          <span className="w-10 shrink-0 text-right text-sm font-semibold text-slate-700 dark:text-slate-200">{creativity}</span>
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-slate-400">
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
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{a.title}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{a.desc}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{a.time}</p>
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
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{value}</p>
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
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-72 transform bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/10 transition-transform duration-300 lg:static lg:translate-x-0 lg:z-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          } lg:sticky lg:top-0 lg:h-screen overflow-y-auto`}
      >
        <div className="flex items-center justify-between px-5 pt-5 lg:hidden">
          <span className="text-sm font-semibold text-slate-800 dark:text-white">Menu</span>
          <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-white/5">
          <div className="relative w-fit">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-lg font-semibold shadow-lg shadow-indigo-500/20">
              AS
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-400 ring-4 ring-white dark:ring-slate-900" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-white">{user.name}</p>
          <p className="text-xs text-slate-400">{user.designation}</p>
          <p className="text-xs text-slate-400 mt-0.5">{user.department}</p>
          <div className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-500">
            <Circle size={7} className="fill-emerald-400 stroke-none" /> Online
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-[11px] text-slate-400">
              <span>Profile completion</span>
              <span>{employee.profileCompletion}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                style={{ width: `${employee.profileCompletion}%` }}
              />
            </div>
          </div>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setActive(item.key);
                  setMobileOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                  ? "bg-gradient-to-r from-indigo-500/10 to-violet-500/10 text-indigo-600 dark:text-indigo-300 ring-1 ring-indigo-500/20"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
              >
                <item.icon size={16} className={isActive ? "text-indigo-500" : "opacity-70"} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

// Main
export default function EmployeeProfileSettings() {
  const [active, setActive] = useState("company");
  const [dark, setDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  console.log(user)
  const activeLabel = navItems.find((n) => n.key === active)?.label ?? "Profile";
  const sectionDescriptions = {
    company: "View and manage your company details",
    profile: "View and manage your personal and professional details",
    security: "Manage passwords, sessions and two-factor authentication",
    notifications: "Choose which updates you want to hear about",
    appearance: "Personalize how WorkForce looks for you",
    preferences: "Set your language, time zone and formats",
    ai: "Configure the AI assistant across WorkForce",
    privacy: "Control what teammates can see about you",
    activity: "A timeline of everything you've been up to",
    about: "App version, build info and legal",
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="ml-60 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
        <div className="flex  ">
          <Sidebar active={active} user={user} setActive={setActive} dark={dark} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

          <div className="flex-1 min-w-0">
            {/* Top bar (mobile) */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur px-4 py-3 lg:hidden">
              <button onClick={() => setMobileOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5">
                <Menu size={18} />
              </button>
              <span className="text-sm font-semibold">{activeLabel}</span>
              <button onClick={() => setDark((d) => !d)} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5">
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
              <div className="hidden lg:flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{activeLabel}</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{sectionDescriptions[active]}</p>
                </div>
                <button
                  onClick={() => setDark((d) => !d)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3.5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition"
                >
                  {dark ? <Sun size={15} /> : <Moon size={15} />}
                  {dark ? "Light Mode" : "Dark Mode"}
                </button>
              </div>

              {active === "profile" && <ProfileSection user={user} />}
              {active === "company" && <CompanySection user={user} />}
              {active === "security" && <SecuritySection />}
              {active === "notifications" && <NotificationsSection />}
              {active === "appearance" && <AppearanceSection dark={dark} setDark={setDark} />}
              {active === "preferences" && <PreferencesSection />}
              {active === "ai" && <AISection />}
              {active === "privacy" && <PrivacySection />}
              {active === "activity" && <ActivitySection />}
              {active === "about" && <AboutSection />}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
