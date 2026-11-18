import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { success, z } from "zod";
import jwt from "jsonwebtoken";

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
      educator: {
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
