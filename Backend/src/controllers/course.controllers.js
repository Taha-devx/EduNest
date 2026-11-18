import Course from "../models/course.model.js";
import { z } from "zod";
import mongoose from "mongoose";

const createCourseSchema = z.object({
  title: z.string().trim().min(3),
  description: z.string().trim().min(10),
});

export const createCourse = async (req, res) => {
  try {
    const validation = createCourseSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "validation failed",
        errors: validation.error.issues,
      });
    }
    const { title, description } = validation.data;

    const course = await Course.create({
      title,
      description,
      educator: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Course is successfully created",
      course,
    });
  } catch (error) {
    console.error("Course creation error: ", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getMyCourse = async (req, res) => {
  try {
    const course = await Course.find({
      educator: req.user._id,
    });

    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      course,
    });
  } catch (error) {
    console.error("Couldn't get courses:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findOne({
      _id: req.params.id,
      educator: req.user._id,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course fetched successfully",
      course,
    });
  } catch (error) {
    console.error("Couldn't get courses:", error);

    return res.status(500).json({
      success: false,
      message: "No course is found",
    });
  }
};

const updateCourseSchema = z
  .object({
    title: z.string().trim().min(3).optional(),
    description: z.string().trim().min(10).optional(),
    status: z.enum(["draft", "published"]).optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const updateCourse = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const validation = updateCourseSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues,
      });
    }

    const course = await Course.findOne({
      _id: req.params.id,
      educator: req.user._id,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    Object.assign(course, validation.data);

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Course update error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    // 1. Validate course ID
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    // 2. Find and delete only the educator's own course
    const course = await Course.findOneAndDelete({
      _id: req.params.id,
      educator: req.user._id,
    });

    // 3. Check whether course exists
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Course deletion error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
