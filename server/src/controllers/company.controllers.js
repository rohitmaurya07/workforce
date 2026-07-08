import Company from "../models/Company.Model.js";
import User from "../models/User.Model.js";



// Creating a Company
export const createCompany = async (req, res) => {
  try {
    console.log(req.body)
    const company = await Company.create({
      ...req.body,
      owner: req.user.id,
    });

     await User.findByIdAndUpdate(
      req.user.id,
      {
        company: company._id,
      },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Company created successfully",
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