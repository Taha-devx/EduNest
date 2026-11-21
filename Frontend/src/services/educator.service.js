
import api from "./api";

export const getMyCourses = async () => {
  const response = await api.get("/courses/my-courses");
  return response.data;
};

export const getCourseById = async (courseId) => {
  const response = await api.get(`/courses/${courseId}`);
  return response.data;
};

export const createCourse = async (courseData) => {
  const response = await api.post("/courses", courseData);
  return response.data;
};

export const updateCourse = async (courseId, courseData) => {
  const response = await api.put(`/courses/${courseId}`, courseData);
  return response.data;
};

export const deleteCourse = async (courseId) => {
  const response = await api.delete(`/courses/${courseId}`);
  return response.data;
};

export const createSection = async (sectionData) => {
  const response = await api.post("/sections", sectionData);
  return response.data;
};

export const getCourseSections = async (courseId) => {
  const response = await api.get(`/sections/course/${courseId}`);
  return response.data;
};

export const createLesson = async (lessonData) => {
  const response = await api.post("/lessons", lessonData);
  return response.data;
};

export const getSectionLessons = async (sectionId) => {
  const response = await api.get(`/lessons/section/${sectionId}`);
  return response.data;
};
