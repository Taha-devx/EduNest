
import express from "express";
import {
  createLesson,
  getLessons,
} from "../controllers/lesson.controller.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticateUser, authorizeRoles("educator"));

router.post("/", createLesson);
router.get("/section/:sectionId", getLessons);

export default router;
