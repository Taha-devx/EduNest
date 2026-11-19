# EduNest – Learning Management System

A full-stack Learning Management System built using the MERN stack, designed to help educators manage courses and students access learning content.

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, shadcn/ui

**Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose

**Authentication & Security:** Google OAuth, JWT, bcrypt, Zod, RBAC

## Features

### Implemented
- Educator registration and login using email and password.
- Student authentication using Google OAuth.
- JWT-based authentication and role-based authorization.
- Password hashing using bcrypt.
- Request validation using Zod.
- Educators can create, view, update, publish, and delete their courses.
- Course ownership verification to protect educator resources.

### Upcoming
- Course sections and lessons management.
- Student course enrollment.
- Text and video lessons.
- MCQ quizzes with scoring and unlimited attempts.
- Student progress tracking.
- Frontend integration and deployment.

## Project Structure

```text
LMS/
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
├── .gitignore
├── README.md
└── NOTES.md
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Educator registration |
| POST | `/api/auth/login` | Educator login |
| POST | `/api/auth/google` | Student Google sign-in |
| GET | `/api/auth/profile` | Get authenticated user |

### Course Management

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/courses` | Create a course |
| GET | `/api/courses/my-courses` | Get educator's courses |
| GET | `/api/courses/:id` | Get a specific course |
| PUT | `/api/courses/:id` | Update a course |
| DELETE | `/api/courses/:id` | Delete a course |

**Note:** Course management endpoints require educator authentication and enforce course ownership.

## Getting Started

### Prerequisites
- Node.js and npm
- MongoDB Atlas account
- Google Cloud OAuth Web application credentials

### Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/Taha-devx/EduNest.git
```

2. Navigate to the backend:

```bash
cd EduNest/Backend
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file using `.env.example` as a reference:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
```

5. Start the development server:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`.

## Project Status

**Currently under development.**

See [NOTES.md](./NOTES.md) for technical explanations, implementation decisions, debugging notes, and interview preparation.

---

Developed as a MERN Stack Developer technical assessment project.