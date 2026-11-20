import api from "./api";

// Fetch all published courses
export const getPublishedCourses = async () => {
  const response = await api.get("/courses/published");
  return response.data;
};

// Fetch courses enrolled by the current student
export const getMyEnrollments = async () => {
  const response = await api.get("/enrollments/my-courses");
  return response.data;
};

// Enroll the student in a course
export const enrollInCourse = async (courseId) => {
  const response = await api.post(`/enrollments/${courseId}`);
  return response.data;
};
