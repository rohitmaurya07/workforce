import Project from "../models/Project.Model.js";
import Task from "../models/Task.Model.js";
import User from "../models/User.model.js";

export const getDashboardStats =
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id)
          const companyId = user.company.toString();

      const totalUsers =
      await User.find({company: companyId}).countDocuments();


      const totalProjects =
        await Project.find({company: companyId}).countDocuments();

      const totalTasks =
        await Task.find({company: companyId}).countDocuments();


      const completedTasks =
        await Task.find({company: companyId}).countDocuments({
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


