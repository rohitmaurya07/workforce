import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controllers.js";
import { getAllUsers, updateUserRole } from "../controllers/user.controllers.js";
import { addMembersToProject, createProject, deleteProject, getProjects } from "../controllers/project.controllers.js";
import { createTask, deleteTask, getAllTasks } from "../controllers/task.controllers.js";
import { employeePerformance } from "../controllers/report.controller.js";
import auth from "../middlewares/auth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";
import { addEmployee, getUserById } from "../controllers/admin.controllers.js";
const router  = Router()


router.use(auth);
router.use(
  allowRoles("admin")
);

router.get(
  "/dashboard",
  getDashboardStats
);

router.get(
  "/users",
  getAllUsers
);

router.patch(
  "/users/:id/role",
  updateUserRole
);

router.post(
  "/project",
  createProject
);

router.post(
  "/tasks",
  createTask
);
router.get(
  "/tasks",
  getAllTasks
);
router.get(
  "/projects",
  getProjects
);

router.delete("/projects/:id", deleteProject);
router.delete("/tasks/:id", deleteTask);
router.get("/users/:id", getUserById);
router.put("/projects/:id/members", addMembersToProject);

router.get(
  "/reports/performance",
  employeePerformance
);

router.post(
  "/adduser",
  auth,
  allowRoles("admin"),
  addEmployee
);


export default router