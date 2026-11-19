import mongoose from "mongoose";
import Lesson from "../models/lesson.model.js";
import Section from "../models/section.model.js";
import Course from "../models/course.model.js";

// Create a lesson
export const createLesson = async (req, res) => {
  try {
    const { title, type, content, videoUrl, sectionId, questions } = req.body;

    if (!title || !type || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Title, type and sectionId are required",
      });
    }

    if (!mongoose.isValidObjectId(sectionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid section ID",
      });
    }

    if (!["text", "video", "quiz"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Lesson type must be text or video",
      });
    }

    if (type === "text" && !content) {
      return res.status(400).json({
        success: false,
        message: "Content is required for text lessons",
      });
    }

    if (type === "video" && !videoUrl) {
      return res.status(400).json({
        success: false,
        message: "Video URL is required for video lessons",
      });
    }

    if (type === "quiz") {
      if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({
          success: false,
          message: "A quiz must contain at least one question",
        });
      }

      const invalidQuestion = questions.some(
        (q) =>
          !q.question ||
          !Array.isArray(q.options) ||
          q.options.length !== 4 ||
          q.options.some((option) => !option?.trim()) ||
          !Number.isInteger(q.correctAnswer) ||
          q.correctAnswer < 0 ||
          q.correctAnswer > 3,
      );

      if (invalidQuestion) {
        return res.status(400).json({
          success: false,
          message:
            "Each question needs four options and a valid correct answer (0-3)",
        });
      }
    }

    const section = await Section.findById(sectionId);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    const course = await Course.findOne({
      _id: section.course,
      educator: req.user._id,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or access denied",
      });
    }

    const lastLesson = await Lesson.findOne({ section: sectionId }).sort({
      order: -1,
    });

    const lesson = await Lesson.create({
      title,
      section: sectionId,
      type,
      content: type === "text" ? content : undefined,
      videoUrl: type === "video" ? videoUrl : undefined,
      questions: type === "quiz" ? questions : undefined,
      order: lastLesson ? lastLesson.order + 1 : 1,
    });

    return res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      lesson,
    });
  } catch (error) {
    console.error("Create lesson error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all lessons in a section
export const getLessons = async (req, res) => {
  try {
    const { sectionId } = req.params;

    if (!mongoose.isValidObjectId(sectionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid section ID",
      });
    }

    const section = await Section.findById(sectionId);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    const course = await Course.findOne({
      _id: section.course,
      educator: req.user._id,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or access denied",
      });
    }

    const lessons = await Lesson.find({ section: sectionId }).sort({
      order: 1,
    });

    return res.status(200).json({
      success: true,
      count: lessons.length,
      lessons,
    });
  } catch (error) {
    console.error("Get lessons error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
