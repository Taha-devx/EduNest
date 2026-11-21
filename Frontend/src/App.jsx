import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoutes";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";


/**Students imports */
import StudentLayout from "./layouts/StudentLayout";
import Dashboard from "./pages/student/Dashboard";
import CourseCatalog from "./pages/student/CourseCatalog";
import LearningPage from "./pages/student/LearningPage";
import MyLearning from "./pages/student/MyLearning";

/**Educator imports */
import EducatorLayout from "./layouts/EducatorLayout";
import DashboardEducator from "./pages/educator/Dashboard-edu";
import Courses from "./pages/educator/Courses";
import CourseEditor from "./pages/educator/CourseEditor";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student routes */}
          <Route element={<ProtectedRoute allowedRole="student" />}>
            <Route path="/student" element={<StudentLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />

              <Route path="dashboard" element={<Dashboard />} />

              <Route path="courses" element={<CourseCatalog />} />

              <Route path="learning/:courseId" element={<LearningPage />} />

              <Route path="my-learning" element={<MyLearning />} />
            </Route>
          </Route>

          {/* Educator routes */}

          <Route element={<ProtectedRoute allowedRole="educator" />}>
            <Route path="/educator" element={<EducatorLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardEducator />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/new" element={<CourseEditor />} />
              <Route path="courses/:courseId/edit" element={<CourseEditor />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
