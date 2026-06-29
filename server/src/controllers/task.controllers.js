import ProjectModel from "../models/Project.Model.js";
import Task  from "../models/Task.Model.js";
import User from "../models/User.Model.js";

export const createTask = async (
  req,
  res
) => {
  try {
    console.log(req.body)
    const task =
      await Task.create({
        ...req.body,
        assignedBy:
          req.user.id,
      });

      // Add task id to project's tasks array
    await ProjectModel.findByIdAndUpdate(req.body.projectId, {
      $push: { tasks: task._id },
    });
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
    const tasks =
      await Task.find()
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
    // const task = await Task.findById(
    //   req.params.id
    // );

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

 if (
  !task.assignedTo._id.equals(req.user.id) &&
  req.user.role !== "admin"
) {
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
    await ProjectModel.findByIdAndUpdate(task.project, {
      $pull: { tasks: task._id },
    });

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