import Project from "../models/Project.Model.js";
import Task from "../models/Task.Model.js";

export const createProject = async (
  req,
  res
) => {
  try {
    const project =
      await Project.create({
        ...req.body,
        createdBy: req.user.id,
      });

    res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getProjects = async (
  req,
  res
) => {
  try {
    const projects =
      await Project.find()
        .populate(
          "createdBy",
          "name email"
        );

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateProject = async (
  req,
  res
) => {
  try {
    const project =
      await Project.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Projects
export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { createdBy: req.user.id },
        { members: req.user.id },
      ],
    })
      .populate("createdBy", "name email")
      .populate("members", "name email");

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//  Get Project details

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email")
      .populate("tasks", "title description");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isCreator = project.createdBy._id.equals(req.user.id);
    const isMember = project.members.some((member) =>
      member._id.equals(req.user.id)
    );

    if (!isCreator && !isMember && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Delete Project By id
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Delete all tasks belonging to this project
    await Task.deleteMany({ projectId: id });

    // Delete the project
    await Project.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add New Members to Project
export const addMembersToProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { members } = req.body;

    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Members must be a non-empty array of user IDs",
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Remove members that already exist in the project
    const existingMembers = project.members.map((member) => member.toString());

    const newMembers = members.filter(
      (memberId) => !existingMembers.includes(memberId)
    );

    if (newMembers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All selected users are already members of the project",
      });
    }

    project.members.push(...newMembers);
    await project.save();

    res.status(200).json({
      success: true,
      message: "New members added successfully",
      addedMembers: newMembers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};