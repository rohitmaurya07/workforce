import Project from "../models/Project.Model.js";
import Task from "../models/Task.Model.js";
import User from "../models/User.model.js";

export const getDashboardStats =
  async (req, res) => {
    try {

      const totalUsers =
        await User.countDocuments();

      const totalProjects =
        await Project.countDocuments();

      const totalTasks =
        await Task.countDocuments();

      const completedTasks =
        await Task.countDocuments({
          status: "completed",
        });

      res.status(200).json({
        success: true,
        stats: {
          totalUsers,
          totalProjects,
          totalTasks,
          completedTasks,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


