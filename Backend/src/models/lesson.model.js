
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (options) => options.length === 4,
      message: "Each question must have exactly four options",
    },
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
  explanation: {
    type: String,
    trim: true,
  },
});

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "video", "quiz"],
      required: true,
    },
    content: {
      type: String,
      required: function () {
        return this.type === "text";
      },
    },
    videoUrl: {
      type: String,
      required: function () {
        return this.type === "video";
      },
    },
    questions: {
      type: [questionSchema],
      required: function () {
        return this.type === "quiz";
      },
      validate: {
        validator: function (questions) {
          return this.type !== "quiz" || questions.length > 0;
        },
        message: "A quiz must contain at least one question",
      },
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;
