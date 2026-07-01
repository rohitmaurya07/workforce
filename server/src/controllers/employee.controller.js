import User from "../models/User.model.js";
import Task from "../models/Task.Model.js";
import {Comment} from "../models/Comment.model.js";


export const getMyTasks = async (
  req,
  res
) => {
  try {
    const tasks = await Task.find({assignedTo: req.user.id,})
      .populate(
        "projectId",
        "name"
      )
      .populate(
        "assignedBy",
        "name"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export const updateTaskStatus =
  async (req, res) => {
    try {
      const { status } = req.body;
      const user = await User.findById(req.user.id);
      if (!user) {
  return res.status(404).json({
    success: false,
    message: "User not found",
  });
}
      if (!user.isActive) 
        return res.json({
          success: false,
          message: "You cant Update Task Status as Your Account is Not Active"
      })
      const task =
        await Task.findById(
          req.params.id
        );

      if (!task) {
        return res.status(404).json({
          success: false,
          message:
            "Task not found",
        });
      }

      if (
        task.assignedTo.toString() !==
        req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Access denied",
        });
      }

      task.status = status;

      if (
        status === "completed"
      ) {
        task.completedAt =
          new Date();
      }

      await task.save();

      res.status(200).json({
        success: true,
        task,
        message : `Task Updated to ${task.status} Successfully`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


  export const uploadTaskFile =
  async (req, res) => {
    try {
      const task =
        await Task.findById(
          req.params.id
        );

      if (!task) {
        return res.status(404).json({
          success: false,
          message:
            "Task not found",
        });
      }

      task.attachments.push({
        fileUrl:
          req.file.path,
      });

      await task.save();

      res.status(200).json({
        success: true,
        task,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };



export const addComment =
  async (req, res) => {
    try {
      const comment =
        await Comment.create({
          taskId:
            req.params.id,

          userId:
            req.user.id,

          content:
            req.body.content,
        });

      res.status(201).json({
        success: true,
        comment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


  export const getEmployeeDashboard =
  async (req, res) => {
    try {
      const totalTasks =
        await Task.countDocuments({
          assignedTo:
            req.user.id,
        });

      const completedTasks =
        await Task.countDocuments({
          assignedTo:
            req.user.id,

          status:
            "completed",
        });

      const pendingTasks =
        await Task.countDocuments({
          assignedTo:
            req.user.id,

          status: "todo",
        });

      const inProgressTasks =
        await Task.countDocuments({
          assignedTo:
            req.user.id,

          status:
            "in_progress",
        });

      res.status(200).json({
        success: true,
        stats: {
          totalTasks,
          completedTasks,
          pendingTasks,
          inProgressTasks,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


