import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const educatorRegisterSchema = z.object({
  username: z.string().trim().min(3),
  email: z.string().trim().email(),
  password: z.string().min(8),
});

export const registerEducator = async (req, res) => {
  try {
    const validation = educatorRegisterSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "validation failed",
        errors: validation.error.issues,
      });
    }

    const { username, email, password } = validation.data;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const educator = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "educator",
    });

    res.status(201).json({
      success: true,
      message: "Educator registered successfully",
      educator: {
        id: educator._id,
        username: educator.username,
        email: educator.email,
        role: educator.role,
      },
    });
  } catch (error) {
    console.error("Educator registration error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const educatorLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const loginEducator = async (req, res) => {
  try {
    const validation = educatorLoginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "validation failed",
        errors: validation.error.issues,
      });
    }

    const { email, password } = validation.data;

    const educator = await User.findOne({
      email,
      role: "educator",
    });

    if (!educator) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, educator.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: educator._id,
        role: educator.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: educator._id,
        username: educator.username,
        email: educator.email,
        role: educator.role,
      },
    });
  } catch (error) {
    console.error("Educator login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const googleClient = new OAuth2Client();

const googleLoginSchema = z.object({
  idToken: z.string().min(1, "Google ID token is required"),
});

export const googleLogin = async (req, res) => {
  try {
    // 1. Validate request body
    const validation = googleLoginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Google ID token is required",
        errors: validation.error.issues,
      });
    }

    const { idToken } = validation.data;

    // 2. Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (
      !payload ||
      !payload.sub ||
      !payload.email ||
      payload.email_verified !== true
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google account information",
      });
    }

    // 3. Extract verified Google information
    const googleId = payload.sub;
    const email = payload.email.toLowerCase();
    const username =
      payload.name || email.split("@")[0];

    // 4. Check whether this Google account already exists
    let student = await User.findOne({ googleId });

    // 5. If Google account doesn't exist, check email
    if (!student) {
      student = await User.findOne({ email });

      if (student) {
        // Never convert an educator into a student
        if (student.role !== "student") {
          return res.status(409).json({
            success: false,
            message: "This email is registered as an educator",
          });
        }

        // Don't link a different Google account
        if (student.googleId && student.googleId !== googleId) {
          return res.status(409).json({
            success: false,
            message: "This email is linked to another Google account",
          });
        }

        // Link Google account to existing student
        student.googleId = googleId;
        await student.save();
      } else {
        // 6. Create a new student
        student = await User.create({
          username,
          email,
          googleId,
          role: "student",
        });
      }
    }

    // 7. Generate EduNest JWT
    const token = jwt.sign(
      {
        userId: student._id,
        role: student.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // 8. Return successful response
    return res.status(200).json({
      success: true,
      message: "Student authenticated successfully",
      token,
      user: {
        id: student._id,
        username: student.username,
        email: student.email,
        role: student.role,
      },
    });

  } catch (error) {
    console.error("Google authentication error:", error);

    // Invalid or expired Google token
    if (
      error.name === "GoogleAuthError" ||
      error.message?.includes("Wrong recipient")
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired Google token",
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Account already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
