import { Router } from "express";
import { getMyProfile, googleLogin, login, register } from "../controllers/auth.controllers.js";
import auth from "../middlewares/auth.middleware.js";
const router = Router()

// POST
router.post("/google", googleLogin);
router.post("/register", register);
router.post("/login", login);
router.get(
  "/profile",auth,
  getMyProfile
);
export default router