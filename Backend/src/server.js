import './config/dns.js';

import connectDB from "./config/db.js";
import express from "express";
import dotenv from "dotenv";
import authRoutes from './routes/auth.routes.js'
import courseRoutes from "./routes/course.routes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LMS API is running",
  });
});

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error.message);
  }
}

startServer();

const PORT = process.env.PORT || 5000;
