import mongoose from "mongoose";
import { Schema } from "mongoose";

const sessionSchema = new Schema(
  {
    device: { type: String },
    userAgent: { type: String },
    ip: { type: String },
    location: { type: String },
    lastActiveAt: { type: Date, default: Date.now },
  },
  { _id: true, timestamps: false }
);

const notificationPreferencesSchema = new Schema(
  {
    taskAssigned: { type: Boolean, default: true },
    taskUpdated: { type: Boolean, default: true },
    taskCompleted: { type: Boolean, default: true },
    comments: { type: Boolean, default: true },
    mentions: { type: Boolean, default: true },
    projectUpdates: { type: Boolean, default: true },
    deadlineReminders: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
  },
  { _id: false }
);

const appearanceSchema = new Schema(
  {
    theme: { type: String, enum: ["light", "dark"], default: "dark" },
    accentColor: { type: String, default: "#6366f1" },
    compactMode: { type: Boolean, default: false },
    reducedMotion: { type: Boolean, default: false },
  },
  { _id: false }
);

const preferencesSchema = new Schema(
  {
    language: { type: String, default: "English (US)" },
    timeZone: { type: String, default: "(GMT+5:30) India Standard Time" },
    dateFormat: { type: String, enum: ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"], default: "DD/MM/YYYY" },
    timeFormat: { type: String, enum: ["12-hour", "24-hour"], default: "12-hour" },
    weekStartsOn: { type: String, enum: ["Monday", "Sunday"], default: "Monday" },
  },
  { _id: false }
);

const aiSettingsSchema = new Schema(
  {
    assistantEnabled: { type: Boolean, default: true },
    smartTaskPriority: { type: Boolean, default: true },
    taskBreakdown: { type: Boolean, default: true },
    dailySummary: { type: Boolean, default: true },
    weeklyReport: { type: Boolean, default: false },
    meetingNotes: { type: Boolean, default: false },
    deadlinePrediction: { type: Boolean, default: false },
    creativityLevel: { type: Number, min: 0, max: 100, default: 60 },
  },
  { _id: false }
);

const privacySchema = new Schema(
  {
    showEmail: { type: Boolean, default: true },
    showPhone: { type: Boolean, default: false },
    showOnlineStatus: { type: Boolean, default: true },
    showActivity: { type: Boolean, default: true },
    profileVisibility: { type: String, enum: ["Everyone", "Team Only", "Only Me"], default: "Everyone" },
  },
  { _id: false }
);

const securitySchema = new Schema(
  {
    twoFactorEnabled: { type: Boolean, default: false },
    sessions: [sessionSchema],
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    googleId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["employee", "admin"],
      default: "employee",
    },
    avatar: {
      type: String,
      default: "https://placehold.net/avatar.svg",
    },

    // Professional info
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
    },
    department: {
      type: String,
    },
    designation: {
      type: String,
    },
    reportingManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Intern"],
      default: "Full-time",
    },
    workMode: {
      type: String,
      enum: ["Remote", "Hybrid", "On-site"],
      default: "On-site",
    },
    joiningDate: {
      type: Date,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    bio: {
      type: String,
      maxlength: 500,
    },

    // Personal info
    phone: {
      type: String,
      trim: true,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say"],
    },
    address: {
      type: String,
      trim: true,
    },
    emergencyContact: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
    },

    isActive: {
      type: Boolean,
      default: false,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],

    // Settings
    notificationPreferences: {
      type: notificationPreferencesSchema,
      default: () => ({}),
    },
    appearance: {
      type: appearanceSchema,
      default: () => ({}),
    },
    preferences: {
      type: preferencesSchema,
      default: () => ({}),
    },
    aiSettings: {
      type: aiSettingsSchema,
      default: () => ({}),
    },
    privacy: {
      type: privacySchema,
      default: () => ({}),
    },
    security: {
      type: securitySchema,
      default: () => ({}),
    },

    lastLogin: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual: quick profile-completion % (personal + professional fields filled)
userSchema.virtual("profileCompletion").get(function () {
  const fields = [
    this.name, this.email, this.phone, this.dob, this.gender, this.address,
    this.designation, this.department, this.joiningDate, this.bio,
    this.skills?.length > 0,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;