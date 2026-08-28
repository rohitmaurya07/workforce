import Project from "../models/Project.Model.js";
import Task from "../models/Task.Model.js";
import User from "../models/User.Model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.company) {
      return res.status(400).json({
        success: false,
        message: "User company not found",
      });
    }
    const companyId = user.company.toString();

    const totalUsers = await User.countDocuments({ company: companyId });
    const totalProjects = await Project.countDocuments({ company: companyId });
    const totalTasks = await Task.countDocuments({ company: companyId });
    const completedTasks = await Task.countDocuments({ company: companyId, status: "completed" });

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


