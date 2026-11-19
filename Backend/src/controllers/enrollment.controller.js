import mongoose from "mongoose";
import Course from "../models/course.model.js";
import Enrollment from "../models/enrollment.model.js";
import Section from "../models/section.model.js";
import Lesson from "../models/lesson.model.js";
import QuizAttempt from "../models/quizAttempt.model.js";


// Enroll student in a course
export const enrollCourse = async (req, res) => {
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
      status: "published",
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Published course not found",
      });
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: course._id,
    });

    return res.status(201).json({
      success: true,
      message: "Enrolled successfully",
      enrollment,
    });
  } catch (error) {
    // MongoDB duplicate-key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    console.error("Enroll course error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get courses enrolled by the student
export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user._id,
    }).populate("course");

    return res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    console.error("Get enrollments error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getEnrolledCourseContent = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    const course = await Course.findOne({
      _id: courseId,
      status: "published",
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const sections = await Section.find({ course: courseId })
      .sort({ order: 1 });

    const sectionIds = sections.map((section) => section._id);

    const lessons = await Lesson.find({
      section: { $in: sectionIds },
    })
      .select("-questions.correctAnswer")
      .sort({ order: 1 });

    const sectionsWithLessons = sections.map((section) => ({
      ...section.toObject(),
      lessons: lessons.filter(
        (lesson) => lesson.section.toString() === section._id.toString()
      ),
    }));

    return res.status(200).json({
      success: true,
      course,
      sections: sectionsWithLessons,
      completedLessons: enrollment.completedLessons,
    });
  } catch (error) {
    console.error("Get course content error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const completeLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    if (
      !mongoose.isValidObjectId(courseId) ||
      !mongoose.isValidObjectId(lessonId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid course or lesson ID",
      });
    }

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    const course = await Course.findOne({
      _id: courseId,
      status: "published",
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const sections = await Section.find({ course: courseId })
      .select("_id");

    const sectionIds = sections.map((section) => section._id);

    const lesson = await Lesson.findOne({
      _id: lessonId,
      section: { $in: sectionIds },
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found in this course",
      });
    }

    // $addToSet avoids adding the same lesson twice
    await Enrollment.updateOne(
      { _id: enrollment._id },
      { $addToSet: { completedLessons: lesson._id } }
    );

    const updatedEnrollment = await Enrollment.findById(enrollment._id);

    const totalLessons = await Lesson.countDocuments({
      section: { $in: sectionIds },
    });

    const completedCount = updatedEnrollment.completedLessons.length;

    const progress = totalLessons === 0
      ? 0
      : Math.round((completedCount / totalLessons) * 100);

    return res.status(200).json({
      success: true,
      message: "Lesson marked as completed",
      completedLessons: completedCount,
      totalLessons,
      progress: `${progress}%`,
    });
  } catch (error) {
    console.error("Complete lesson error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const submitQuizAttempt = async (req, res) => {
  try {
    const { courseId, quizId } = req.params;
    const { answers } = req.body;

    if (
      !mongoose.isValidObjectId(courseId) ||
      !mongoose.isValidObjectId(quizId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid course or quiz ID",
      });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers must be an array",
      });
    }

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    const course = await Course.findOne({
      _id: courseId,
      status: "published",
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Published course not found",
      });
    }

    const sections = await Section.find({ course: courseId }).select("_id");
    const sectionIds = sections.map((section) => section._id);

    const quiz = await Lesson.findOne({
      _id: quizId,
      type: "quiz",
      section: { $in: sectionIds },
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found in this course",
      });
    }

    if (answers.length !== quiz.questions.length) {
      return res.status(400).json({
        success: false,
        message: "Answer every question before submitting",
      });
    }

    const questionIds = quiz.questions.map((q) => q._id.toString());
    const submittedIds = answers.map((a) => a.questionId);

    if (
      submittedIds.some((id) => !mongoose.isValidObjectId(id)) ||
      new Set(submittedIds).size !== submittedIds.length ||
      questionIds.some((id) => !submittedIds.includes(id))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or duplicate question answers",
      });
    }

    const results = quiz.questions.map((question) => {
      const submitted = answers.find(
        (answer) => answer.questionId === question._id.toString()
      );

      const selectedOption = submitted.selectedOption;

      if (
        !Number.isInteger(selectedOption) ||
        selectedOption < 0 ||
        selectedOption > 3
      ) {
        throw new Error("Invalid selected option");
      }

      return {
        questionId: question._id,
        selectedOption,
        correctOption: question.correctAnswer,
        isCorrect: selectedOption === question.correctAnswer,
        explanation: question.explanation,
      };
    });

    const correctCount = results.filter((a) => a.isCorrect).length;
    const totalQuestions = quiz.questions.length;
    const incorrectCount = totalQuestions - correctCount;
    const score = Math.round((correctCount / totalQuestions) * 100);

    const attempt = await QuizAttempt.create({
      student: req.user._id,
      course: courseId,
      quiz: quizId,
      answers: results,
      correctCount,
      incorrectCount,
      totalQuestions,
      score,
    });

    return res.status(201).json({
      success: true,
      message: "Quiz submitted successfully",
      result: attempt,
    });
  } catch (error) {
    console.error("Submit quiz error:", error);

    if (error.message === "Invalid selected option") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};