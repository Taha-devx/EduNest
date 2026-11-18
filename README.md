# EduNest – Learning Management System

A full-stack Learning Management System built using the MERN stack.

## Technology Stack

### Frontend
- React
- Vite
- Tailwind CSS
- shadcn/ui

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

### Authentication & Security
- Google OAuth (Students)
- Email/Password Authentication (Educators)
- JWT (JSON Web Tokens)
- bcrypt (Password Hashing)
- Zod (Input Validation)
- Role-Based Access Control (RBAC)

## Project Structure

```text
LMS/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── tests/
│   │   └── server.js
│   └── package.json
├── .gitignore
└── README.md
```

## Implemented Features

### Backend
- Express server setup
- MongoDB Atlas connection
- User and Course models
- Educator registration API
- Password hashing using bcrypt
- Request validation using Zod
- Basic authentication routing

## Implemented Features

### Authentication & Authorization
- Educator registration using username, email and password.
- Password hashing using bcrypt.
- Educator login with JWT generation.
- JWT-based authentication middleware.
- Role-Based Access Control (RBAC) for protected routes.
- User identification through verified JWT tokens.
- Password hashes excluded from authenticated user responses.
- Request validation using Zod.

### Course Management
- Educators can create courses.
- Educators can retrieve all their own courses.
- Educators can retrieve individual courses.
- Educators can update course details.
- Educators can save courses as drafts or publish them.
- Educators can delete their own courses.
- Course ownership verification prevents educators from modifying other educators' courses.
- Request validation for course creation and updates.

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register educator | Public |
| POST | `/api/auth/login` | Educator login | Public |
| GET | `/api/auth/profile` | Get authenticated user profile | Authenticated |
| GET | `/api/auth/educator-only` | Test educator authorization | Educator |

### Course Management

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/courses` | Create a course | Educator |
| GET | `/api/courses/my-courses` | Get educator's courses | Educator |
| GET | `/api/courses/:id` | Get a specific course | Educator |
| PUT | `/api/courses/:id` | Update a course | Course Owner |
| DELETE | `/api/courses/:id` | Delete a course | Course Owner |

**Note:** Course endpoints require a valid JWT and educator role. Operations on individual courses additionally verify course ownership.

## Backend Technologies

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- Zod
- Postman

## Security Measures

- Passwords are hashed before storage using bcrypt.
- JWT tokens are verified through authentication middleware.
- Role-based middleware restricts access to authorized users.
- Course ownership is verified before individual course operations.
- Request bodies are validated using Zod.
- Sensitive password fields are excluded from authenticated user responses.

## Project Status

Backend development is in progress.

Completed milestones:
- Project initialization and database connection.
- User and course database models.
- Educator registration and login.
- JWT authentication and RBAC middleware.
- Course CRUD controller implementation.

Upcoming milestones:
- Course API testing with Postman.
- Student Google OAuth authentication.
- Student enrollment functionality.
- Sections, lessons and quizzes.
- Student progress tracking.
- Frontend integration.
- Deployment and documentation.
