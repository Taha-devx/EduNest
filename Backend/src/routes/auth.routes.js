import express from "express";
import {
  registerEducator,
  loginEducator,
  googleLogin,
} from "../controllers/auth.controller.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerEducator);
router.post("/login", loginEducator);
router.post("/google", googleLogin);


router.get(
  "/profile",
  authenticateUser,
  (req, res) => {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  }
);

router.get(
  "/educator-only",
  authenticateUser,
  authorizeRoles("educator"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome, educator!",
    });
  }
);

export default router;
