import express from "express";
import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";
import { createCompany, deleteCompany, getCompany, updateCompany } from "../controllers/company.controllers.js";
import { upload } from "../middlewares/multer.js";
const router = Router();

router.post("/", auth, allowRoles("admin"), createCompany);
router.get("/", auth, getCompany);
router.patch("/", auth, allowRoles("admin"), upload.single("logo"), updateCompany);
router.delete("/", auth, allowRoles("admin"), deleteCompany);

export default router;