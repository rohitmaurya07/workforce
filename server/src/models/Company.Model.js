import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    legalName: {
      type: String,
      trim: true,
    },

    logo: {
      type: String, // Cloudinary URL
      default: "",
    },

    website: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    // Address
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },

    // Company Information
    industry: {
      type: String,
      default: "",
    },

    companySize: {
      type: String,
      enum: [
        "1-10",
        "11-50",
        "51-200",
        "201-500",
        "501-1000",
        "1000+",
      ],
    },

    foundedYear: Number,

    registrationNumber: String,

    taxId: String,

    // Branding
    primaryColor: {
      type: String,
      default: "#2563eb",
    },

    secondaryColor: {
      type: String,
      default: "#1e293b",
    },

    // HR Settings
    workingDays: {
      type: [String],
      default: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
    },

    officeStartTime: {
      type: String,
      default: "09:00",
    },

    officeEndTime: {
      type: String,
      default: "18:00",
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    currency: {
      type: String,
      default: "INR",
    },

    // Admin
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Company", companySchema);