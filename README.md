# EduNest – Learning Management System

A full-stack Learning Management System built with the MERN stack. Educators can create and manage courses, while students can enroll, access lessons, attempt quizzes, and track their progress.

**Live Demo:** [EduNest](https://edunest-frontend-2q069jhy7-taha-devx.vercel.app/)  
**GitHub:** [Taha-devx/EduNest](https://github.com/Taha-devx/EduNest)

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose
- **Authentication:** Google OAuth, JWT, bcrypt
- **Validation & Authorization:** Zod, Role-Based Access Control

## Features

**Student**
- Google authentication
- Browse published courses and enroll
- Access text and video lessons
- Complete lessons and track progress
- Attempt MCQ quizzes with instant feedback and unlimited attempts

**Educator**
- Register and sign in with email and password
- Create, edit, publish, and delete courses
- Save courses as drafts
- Organize courses into sections and lessons
- Create text, video, and MCQ quiz lessons

**Security**
- JWT-based authentication
- bcrypt password hashing
- Role-based route protection
- Course ownership verification
- Server-side validation using Zod

## Project Structure

```text
EduNest/
├── Backend/
│   ├── public/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
├── Frontend/
│   ├── public/
│   ├── src/
│   └── package.json
└── README.md
```

## Getting Started

**Prerequisites:** Node.js, npm, MongoDB Atlas, and Google OAuth credentials.

### 1. Clone the repository

```bash
git clone https://github.com/Taha-devx/EduNest.git
cd EduNest
```

### 2. Backend setup

```bash
cd Backend
npm install
```

Create a `.env` file using `.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend setup

Open another terminal:

```bash
cd Frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Start the frontend:

```bash
npm run dev
```

## Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

## API

All endpoints are prefixed with `/api`.

- `/auth` – Authentication
- `/courses` – Course management
- `/sections` – Course sections
- `/lessons` – Lessons and quizzes
- `/enrollments` – Enrollment and student progress

Health check: `/api/health`

---

Developed as a MERN Stack Developer technical assessment.
