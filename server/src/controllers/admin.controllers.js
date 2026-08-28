import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User.Model.js";
import bcrypt from "bcryptjs";
import Task from "../models/Task.Model.js";


export const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      department,
      company,
    } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
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

    let targetCompany = company;
    if (!targetCompany) {
      const adminUser = await User.findById(req.user.id);
      targetCompany = adminUser?.company;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create employee
    const employee = await User.create({
      name,
      email,
      department,
      company: targetCompany,
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
      message: error.message || "Failed to add employee.",
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
      .populate("tasks", "title description priority status dueDate");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const tasksList = user.tasks || [];
    const stats = {
      totalTasks: tasksList.length,
      completedTasks: tasksList.filter(
        (task) => task.status === "completed"
      ).length,
      pendingTasks: tasksList.filter(
        (task) => task.status === "todo" || task.status === "pending"
      ).length,
      inProgressTasks: tasksList.filter(
        (task) => task.status === "in_progress" || task.status === "in-progress"
      ).length,
    };
    const performance = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

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

// Update Employee Details as Admin
export const updateEmployeeDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, department, designation, phone, isActive, isVerified } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (role !== undefined) updates.role = role;
    if (department !== undefined) updates.department = department;
    if (designation !== undefined) updates.designation = designation;
    if (phone !== undefined) updates.phone = phone;
    if (isActive !== undefined) updates.isActive = isActive;
    if (isVerified !== undefined) updates.isVerified = isVerified;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee details updated successfully",
      user,
    });
  } catch (error) {
    console.error("updateEmployeeDetails Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update employee details",
    });
  }
};
