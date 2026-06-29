import express from "express";

import {
  getMyTasks,
  updateTaskStatus,
  getEmployeeDashboard,
  addComment,
} from "../controllers/employee.controller.js";
import auth from "../middlewares/auth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";
import { getMyProjects } from "../controllers/project.controllers.js";


const router = express.Router();

router.use(auth);

router.use(
  allowRoles("employee")
);

router.get(
  "/dashboard",
  getEmployeeDashboard
);



router.get(
  "/tasks",
  getMyTasks
);

router.get(
  "/projects",
  getMyProjects
);



router.patch(
  "/tasks/:id/status",
  updateTaskStatus
);

router.post(
  "/tasks/:id/comments",
  addComment
);

export default router;