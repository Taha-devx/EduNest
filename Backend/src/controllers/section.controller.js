import Section from "../models/section.model.js";
import Course from "../models/course.model.js";
import mongoose from "mongoose";

export const createSection = async (req, res) => {
  try {
    const { title, courseId } = req.body;

    if (!title || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Title and courseId are required",
      });
    }

    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findOne({
      _id: courseId,
      educator: req.user._id,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or access denied",
      });
    }

    const lastSection = await Section.findOne({ course: courseId }).sort({
      order: -1,
    });

    const section = await Section.create({
      title,
      course: courseId,
      order: lastSection ? lastSection.order + 1 : 1,
    });

    res.status(201).json({
      success: true,
      message: "Section created successfully",
      section,
    });
  } catch (error) {
    console.error("Create section error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getSections = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findOne({
      _id: courseId,
      educator: req.user._id,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or access denied",
      });
    }

    const sections = await Section.find({ course: courseId })
      .sort({ order: 1 });

    return res.status(200).json({
      success: true,
      count: sections.length,
      sections,
    });
  } catch (error) {
    console.error("Get sections error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
