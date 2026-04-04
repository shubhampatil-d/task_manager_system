import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  toggleTask,
} from "../controllers/taskController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getTasks);
router.patch("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);
router.patch("/:id/toggle", authMiddleware, toggleTask);

export default router;