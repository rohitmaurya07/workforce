import { Router } from "express";
import { getMyProfile, googleLogin, login, register, updateProfile } from "../controllers/auth.controllers.js";
import auth from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";
const router = Router()

// POST
router.post("/google", googleLogin);
router.post("/register", register);
router.post("/login", login);
router.patch("/update", auth,upload.single("avatar"),updateProfile);
router.get(
  "/profile",auth,
  getMyProfile
);
export default router