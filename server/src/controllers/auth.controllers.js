import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../middlewares/cloudinary.js";
// Updated
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

import crypto from "crypto";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "employee",
      isActive: true,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role, company: user.company },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        company: user.company,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket =
      await client.verifyIdToken({
        idToken: credential,
        audience:
          process.env.GOOGLE_CLIENT_ID,
      });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const {
      sub,
      email,
      name,
      picture,
    } = payload;

    let user = await User.findOne({
      email,
    });

    if (!user) {
      user = await User.create({
        googleId: sub,
        name,
        email,
        avatar: picture || "https://placehold.net/avatar.svg",
        role: "employee",
        isActive: true,
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        company: user.company,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        company: user.company,
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Google Login Failed",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hash;
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 mins
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset link generated successfully",
      resetToken, // Returned so frontend can link to reset UI
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const hash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful. You can now login.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const getMyProfile = async (req,res) => {
  try {
    if(!req.user.id)
      return  res.status(400).json({
      success: false,
      message: "User Not Logged in",
    });

    const user = await User.findById(req.user.id).populate("company").select("-__v");

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


export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const updates = {};
    const unset = {};

    const allowedFields = [
      "name",
      "phone",
      "designation",
      "department",
      "reportingManager",
      "employmentType",
      "workMode",
      "dob",
      "gender",
      "address",
      "bio",
      "skills",
      "avatar",
      "emergencyContact",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "gender" && req.body[field].trim() === "") {
          unset[field] = 1;
        } else {
          updates[field] = req.body[field];
        }
      }
    });

    // Avatar uploaded?
    if (req.file) {
      try {
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "employee-profile",
          });
          updates.avatar = result.secure_url;
        } else {
          const fs = await import("fs");
          const fileData = fs.readFileSync(req.file.path);
          updates.avatar = `data:${req.file.mimetype};base64,${fileData.toString("base64")}`;
        }
      } catch (cloudErr) {
        console.error("Cloudinary upload error, using base64 fallback:", cloudErr);
        const fs = await import("fs");
        const fileData = fs.readFileSync(req.file.path);
        updates.avatar = `data:${req.file.mimetype};base64,${fileData.toString("base64")}`;
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates, ...(Object.keys(unset).length ? { $unset: unset } : {}) },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.error("updateProfile Error:", err);

    res.status(500).json({
      success: false,
      message: err.message || "Failed to update profile",
    });
  }
};