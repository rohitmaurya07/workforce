import ProjectModel from "../models/Project.Model.js";
import Task  from "../models/Task.Model.js";
import User from "../models/User.Model.js";

export const createTask = async (
  req,
  res
) => {
  try {
    const user = await User.findById(req.user.id)
        const companyId = user.company.toString();
    const taskData = {
      ...req.body,
      assignedBy: req.user.id,
      company: companyId,
    };
    if (!taskData.projectId) {
      delete taskData.projectId;
    }

    const task = await Task.create(taskData);

    // Add task id to project's tasks array if project exists
    if (req.body.projectId) {
      await ProjectModel.findByIdAndUpdate(req.body.projectId, {
        $push: { tasks: task._id },
      });
    }
    await User.findByIdAndUpdate(req.body.assignedTo, {
      $push: { tasks: task._id },
    });

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const assignTask = async (
  req,
  res
) => {
  try {
    const {
      assignedTo,
    } = req.body;

    const task =
      await Task.findByIdAndUpdate(
        req.params.id,
        { assignedTo },
        { new: true }
      );

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllTasks = async (
  req,
  res
) => {
  try {
    const user = await User.findById(req.user.id)
        const companyId = user.company.toString();
    const tasks =
      await Task.find({company: companyId})
        .populate(
          "assignedTo",
          "name email"
        )
        .populate(
          "assignedBy",
          "name email"
        )
        .populate(
          "projectId",
          "name"
        );

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

export const getTaskDetails = async (
  req,
  res
) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("assignedBy", "name email")
      .populate("projectId", "name");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const assignedId = task.assignedTo?._id?.toString() || task.assignedTo?.toString();
    const isAssignee = assignedId === req.user.id.toString();
    const isAssigner = task.assignedBy?._id?.toString() === req.user.id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isAssignee && !isAssigner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Remove task id from project's tasks array
    if (task.projectId) {
      await ProjectModel.findByIdAndUpdate(task.projectId, {
        $pull: { tasks: task._id },
      });
    }

    // Remove task id from assigned user's tasks array
    if (task.assignedTo) {
      await User.findByIdAndUpdate(task.assignedTo, {
        $pull: { tasks: task._id },
      });
    }

    // Delete the task
    await Task.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};