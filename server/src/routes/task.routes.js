import { Router } from "express";
import { assignTask, getAllTasks, getTaskDetails } from "../controllers/task.controllers.js";
import allowRoles from "../middlewares/role.middleware.js";
import auth from "../middlewares/auth.middleware.js";
const router = Router()

// GET Requests
router.get("/",getAllTasks)
router.get("/:id",auth,getTaskDetails)


// POST
// router.patch("/api/tasks")

// PATCH
// router.patch("/api/tasks/:id")
router.patch(
  "/:id/assign",
  auth,allowRoles("admin"),
  assignTask
);

// Delete
// router.delete("/api/tasks/:id")


export default router