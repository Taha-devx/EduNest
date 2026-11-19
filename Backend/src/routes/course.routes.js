
import express from "express";
import {
  createCourse,
  getMyCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
  getPublishedCourses,
} from "../controllers/course.controller.js";

import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Public course catalog
router.get("/published", getPublishedCourses);

// Educator-only routes
router.use(authenticateUser, authorizeRoles("educator"));

router.post("/", createCourse);
router.get("/my-courses", getMyCourse);
router.get("/:id", getCourseById);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;
