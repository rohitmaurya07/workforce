import mongoose from "mongoose";
import { Schema } from "mongoose";

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
      type: String
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
    department: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: false
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

    lastLogin: {
      type: Date
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;