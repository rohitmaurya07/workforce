import cloudinary from "../middlewares/cloudinary.js";
import Task from "../models/Task.Model.js";
import User from "../models/User.model.js";
import https from "https";


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-__v")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateUserRole = async (
  req,
  res
) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const disableUser = async (
  req,
  res
) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const uploadTaskSubmission = async (req, res) => {
  try {
    const { id } = req.params; // Task ID

    const task = await Task.findById(id);
    console.log(task)
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to upload files for this task.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file.",
      });
    }

    // Determine Cloudinary resource type
    const imageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];

    const resourceType = imageTypes.includes(req.file.mimetype)
      ? "image"
      : "raw";

      console.log(req.file.originalname);
console.log(req.file.mimetype);

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "task-submissions",
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
    });

    console.log(result.resource_type);
console.log(result.format);
console.log(result.secure_url);



    task.attachments.push({
      fileName: req.file.originalname,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date(),
    });

    await task.save();

    res.status(200).json({
      success: true,
      message: "File uploaded successfully.",
      attachments: task.attachments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const downloadAttachment = async (req, res) => {
  try {
    const { taskId, attachmentId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const attachment = task.attachments.id(attachmentId);

    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: "Attachment not found",
      });
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${attachment.fileName}"`
    );

    res.setHeader("Content-Type", attachment.mimeType);

    https.get(attachment.fileUrl, (cloudinaryRes) => {
      cloudinaryRes.pipe(res);
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};