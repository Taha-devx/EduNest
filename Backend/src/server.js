
import "./config/dns.js";

import connectDB from "./config/db.js";
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import sectionRoutes from "./routes/section.routes.js"
import lessonRoutes from "./routes/lesson.routes.js"
import enrollmentRoutes from "./routes/enrollment.routes.js"
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors"

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// Resolve the public directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "../public");

// Middleware
app.use(express.json());
app.use(express.static(publicPath));

// Serve Google OAuth test page
app.get("/google-test.html", (req, res) => {
  res.sendFile(path.join(publicPath, "google-test.html"));
});


app.use(cors({
  origin: "http://localhost:5173",
}));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/enrollments", enrollmentRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LMS API is running",
  });
});

// Start Server
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
