import mongoose from "mongoose";
import cloudinary from "../middlewares/cloudinary.js";
import Company from "../models/Company.Model.js";
import User from "../models/User.model.js";
import bcrypt from "bcrypt";



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

    if (!loginName || !loginEmail || !loginPassword || !name) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const ownerEmail = loginEmail.trim().toLowerCase();
    const companyEmail = email?.trim().toLowerCase();

    const existingUser = await User.findOne({ email: ownerEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const existingCompany = await Company.findOne({
      email: companyEmail,
    });

    if (existingCompany) {
      return res.status(409).json({
        success: false,
        message: "Company already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(loginPassword, 10);

    let company = null;
    let user = null;

    try {
      company = await Company.create({
        name,
        legalName,
        website,
        email: companyEmail,
        phone,
        logo,
        industry,
        companySize,
        foundedYear,
        currency,
        timezone,
      });

      user = await User.create({
        name: loginName,
        email: ownerEmail,
        password: hashedPassword,
        company: company._id,
        role: "admin",
      });

      company.owner = user._id;
      await company.save();

      return res.status(201).json({
        success: true,
        message: "Company created successfully",
        company,
      });

    } catch (err) {
      if (user) {
        await User.findByIdAndDelete(user._id);
      }

      if (company) {
        await Company.findByIdAndDelete(company._id);
      }

      throw err;
    }

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
    const company = await Company.findOne({
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
