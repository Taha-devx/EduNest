import dotenv from "dotenv";
import mongoose from "mongoose";

import "../config/dns.js";
import connectDB from "../config/db.js";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";

dotenv.config();

async function testCourse() {
  try {
    await connectDB();

    const educator = await User.findOne({
      role: "educator",
    });

    if (!educator) {
      throw new Error("No educator is found. Create a test educator first");
    }

    console.log("Educator found: ", educator.username);

    const course = await Course.create({
      title: "Introduction to JavaScript",
      description: "Learn JavaScript fundamentals from scratch.",
      educator: educator._id,
    });

    console.log("Course created successfully", course);
  } catch (error) {
    console.error("Course test failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

testCourse();
