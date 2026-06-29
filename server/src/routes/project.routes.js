import { Router } from "express";
import { getProjectById, getProjects } from "../controllers/project.controllers.js";
import auth from "../middlewares/auth.middleware.js";
const router = Router()

// GET Requests
router.get("/",getProjects)
// router.get("/:id")
router.get(
  "/:id",
  auth,
  getProjectById
);
// POST
// router.patch("/")

// PATCH
// router.patch("/:id")

// Delete
// router.delete("/:id")


export default router
