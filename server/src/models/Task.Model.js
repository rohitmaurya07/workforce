import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "MEDIUM",
    },

    status: {
      type: String,
      enum: ["todo", "in_progress", "completed"],
      default: "TODO",
    },

    dueDate: {
      type: Date,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    attachments: [
      {
        fileName: String,
        fileUrl: String,
        publicId: String,
        mimeType: String,
        size: String,
        uploadedBy: String,
        uploadedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Task =
  mongoose.models.Task ||
  mongoose.model("Task", taskSchema);

export default Task;