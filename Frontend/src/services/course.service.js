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


// Fetch content of an enrolled course
export const getEnrolledCourseContent = async (courseId) => {
  const response = await api.get(`/enrollments/${courseId}/content`);
  return response.data;
};

// Mark a lesson as completed
export const completeLesson = async (courseId, lessonId) => {
  const response = await api.patch(
    `/enrollments/${courseId}/lessons/${lessonId}/complete`
  );
  return response.data;
};

// Submit a quiz attempt
export const submitQuizAttempt = async (courseId, quizId, answers) => {
  const response = await api.post(
    `/enrollments/${courseId}/quizzes/${quizId}/attempts`,
    { answers }
  );
  return response.data;
};

