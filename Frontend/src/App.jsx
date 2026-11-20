import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoutes";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import StudentLayout from "./layouts/StudentLayout";
import Dashboard from "./pages/student/Dashboard";
import CourseCatalog from "./pages/student/CourseCatalog";
import LearningPage from "./pages/student/LearningPage";

// Temporary placeholders

function StudentDashboard() {
  return <h1>Student Dashboard</h1>;
}

function EducatorDashboard() {
  return <h1>Educator Dashboard</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute allowedRole="student" />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRole="educator" />}>
            <Route path="/educator/dashboard" element={<EducatorDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRole="student" />}>
            <Route path="/student" element={<StudentLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="courses" element={<CourseCatalog />} />
              <Route path="learning/:courseId" element={<LearningPage />} />
            </Route>
          </Route>
          
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
