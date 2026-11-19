import express from "express";

import {
  createSection,
  getSections,
} from "../controllers/section.controller.js";

import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticateUser, authorizeRoles("educator"));

router.post("/", createSection);
router.get("/course/:courseId", getSections);

export default router;
