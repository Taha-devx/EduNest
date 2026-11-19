
import express from "express";
import {
  enrollCourse,
  getMyEnrollments,
  getEnrolledCourseContent,
  completeLesson,
  submitQuizAttempt,
} from "../controllers/enrollment.controller.js";

import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticateUser, authorizeRoles("student"));

router.post("/:courseId", enrollCourse);
router.get("/my-courses", getMyEnrollments);

// Access course content
router.get("/:courseId/content", getEnrolledCourseContent);

// Mark lesson completed
router.patch(
  "/:courseId/lessons/:lessonId/complete",
  completeLesson
);

router.post(
  "/:courseId/quizzes/:quizId/attempts",
  submitQuizAttempt
);


export default router;
