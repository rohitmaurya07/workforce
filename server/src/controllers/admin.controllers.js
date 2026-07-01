import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import Task from "../models/Task.Model.js";


export const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      department,
    } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required.",
      });
    }

    // Check if employee already exists
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Employee already exists.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create employee
    const employee = await User.create({
      name,
      email,
      department,
      password: hashedPassword,
      role: "employee",
      isActive: true,
      isVerified: false,
    });

    res.status(201).json({
      success: true,
      message: "Employee added successfully.",
      employee,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add employee.",
    });
  }
};


// Get User details by Id
export const getUserById = async (req, res) => {
  try {
    // Ensure only admins can access
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { id } = req.params;

    const user = await User.findById(id)
      .select("-password -refreshToken")
      .populate("tasks", "title description priority status dueDate")
      const stats = {
        totalTasks: user.tasks.length,
      completedTasks: user.tasks.filter(
        (task) => task.status === "completed"
      ).length,
      pendingTasks: user.tasks.filter(
        (task) => task.status === "pending"
      ).length,
      inProgressTasks: user.tasks.filter(
        (task) => task.status === "in-progress"
      ).length,
    };
    const performance = stats.completedTasks / stats.totalTasks * 100;
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        stats,
        performance
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Delete USer By Id
export const deleteUserById = async (req,res)=>{
  try {
      const {id} = req.params;
      const user = await User.findByIdAndDelete(id)
      return res.status(200).json({
        message: "User Deleted From DataBase",
        success: true,
        user
      })
  } catch (error) {
    console.log("error Came : ",error)
  }
}


// Toggle Account Status of a Employee
export const toggleEmployeeAccountStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isActive: !user.isActive },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Employee account ${
        updatedUser.isActive ? "activated" : "deactivated"
      } successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};