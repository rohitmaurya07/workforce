import mongoose from "mongoose";
import cloudinary from "../middlewares/cloudinary.js";
import Company from "../models/Company.Model.js";
import User from "../models/User.Model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Creating a Company
export const createCompany = async (req, res) => {
  try {
    const {
      loginName,
      loginEmail,
      loginPassword,
      name,
      legalName,
      website,
      email,
      phone,
      logo,
      industry,
      companySize,
      foundedYear,
      currency,
      timezone,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    const companyEmail = email?.trim().toLowerCase();
    const existingCompany = companyEmail ? await Company.findOne({ email: companyEmail }) : null;

    if (existingCompany) {
      return res.status(409).json({
        success: false,
        message: "Company with this email already exists",
      });
    }

    let user = null;
    const loggedInUserId = req.user?.id || req.user?._id;

    if (loggedInUserId) {
      user = await User.findById(loggedInUserId);
    } else {
      const ownerEmail = loginEmail?.trim().toLowerCase();
      if (!ownerEmail || !loginPassword || !loginName) {
        return res.status(400).json({
          success: false,
          message: "Admin login credentials are required",
        });
      }

      const existingUser = await User.findOne({ email: ownerEmail });
      if (existingUser) {
        // If user exists without company, use existing user
        if (!existingUser.company) {
          user = existingUser;
        } else {
          return res.status(409).json({
            success: false,
            message: "User already belongs to another company",
          });
        }
      } else {
        const hashedPassword = await bcrypt.hash(loginPassword, 10);
        user = await User.create({
          name: loginName,
          email: ownerEmail,
          password: hashedPassword,
          role: "admin",
          isActive: true,
        });
      }
    }

    let logoUrl = typeof logo === "string" ? logo : "";
    if (req.file) {
      try {
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "company-logo",
          });
          logoUrl = result.secure_url;
        } else {
          const fs = await import("fs");
          const fileData = fs.readFileSync(req.file.path);
          logoUrl = `data:${req.file.mimetype};base64,${fileData.toString("base64")}`;
        }
      } catch (cloudErr) {
        console.error("Cloudinary upload error, using base64 fallback:", cloudErr);
        const fs = await import("fs");
        const fileData = fs.readFileSync(req.file.path);
        logoUrl = `data:${req.file.mimetype};base64,${fileData.toString("base64")}`;
      }
    }

    const company = await Company.create({
      name,
      legalName,
      website,
      email: companyEmail || user.email,
      phone,
      logo: logoUrl,
      industry,
      companySize,
      foundedYear,
      currency,
      timezone,
      owner: user._id,
    });

    user.company = company._id;
    user.role = "admin";
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        company: company._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" || !!process.env.RAILWAY_ENVIRONMENT,
      sameSite: process.env.NODE_ENV === "production" || !!process.env.RAILWAY_ENVIRONMENT ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const populatedUser = await User.findById(user._id).populate("company").select("-password");

    return res.status(201).json({
      success: true,
      message: "Company created successfully",
      token,
      company,
      user: populatedUser,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get All Available Companies (for joining)
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ isActive: true })
      .select("name legalName logo industry companySize email website")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      companies,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Join an Existing Company
export const joinCompany = async (req, res) => {
  try {
    const { companyId } = req.body;
    const userId = req.user?.id || req.user?._id;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    const company = await Company.findById(companyId);
    if (!company || !company.isActive) {
      return res.status(404).json({
        success: false,
        message: "Company not found or inactive",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.company = company._id;
    user.role = "employee";
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        company: company._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" || !!process.env.RAILWAY_ENVIRONMENT,
      sameSite: process.env.NODE_ENV === "production" || !!process.env.RAILWAY_ENVIRONMENT ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const populatedUser = await User.findById(user._id).populate("company").select("-password");

    return res.status(200).json({
      success: true,
      message: `Joined ${company.name} successfully!`,
      token,
      user: populatedUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// Get Company Details
export const getCompany = async (req, res) => {
  try {
    let company = await Company.findOne({
      $or: [
        { owner: req.user.id },
        { _id: req.user.company },
      ],
    });

    if (!company && req.user.id) {
      const user = await User.findById(req.user.id);
      if (user && user.company) {
        company = await Company.findById(user.company);
      }
    }

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      company,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update Company Details
export const updateCompany = async (req, res) => {
  try {
    console.log(req.body)
    const allowedFields = [
      "name",
      "legalName",
      "website",
      "email",
      "phone",
      "industry",
      "companySize",
      "foundedYear",
      "registrationNumber",
      "taxId",
      "logo",
      "primaryColor",
      "secondaryColor",
      "workingDays",
      "officeStartTime",
      "officeEndTime",
      "timezone",
      "currency",
      "address",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Avatar uploaded?
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "company-logo",
      });

      updates.logo = result.secure_url;
    }
    const company = await Company.findOneAndUpdate(
      { owner: req.user.id },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// Delete Company Details
export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findOneAndDelete({
      owner: req.user.id,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
