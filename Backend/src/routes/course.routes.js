import express from "express";

import {
  createCourse,
  getMyCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controllers.js";

import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticateUser, authorizeRoles("educator"));

router.post('/', createCourse);
router.get('/my-course', getMyCourse);
router.get('/:id', getCourseById);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

export default router;
