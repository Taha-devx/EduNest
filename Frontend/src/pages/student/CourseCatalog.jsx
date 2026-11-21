import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BookOpen,
  GraduationCap,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import {
  getPublishedCourses,
  getMyEnrollments,
  enrollInCourse,
} from "../../services/course.service";

const CourseCatalog = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrollingId, setEnrollingId] = useState(null);
  const [enrollmentError, setEnrollmentError] = useState("");

  // Fetch courses and existing enrollments
  const fetchCourses = useCallback(async () => {
    try {
      const [courseResult, enrollmentResult] = await Promise.allSettled([
        getPublishedCourses(),
        getMyEnrollments(),
      ]);

      if (courseResult.status === "rejected") {
        throw courseResult.reason;
      }

      setCourses(courseResult.value.courses || []);

      if (enrollmentResult.status === "fulfilled") {
        const enrollments = enrollmentResult.value.enrollments || [];

        const ids = enrollments
          .filter((item) => item.course)
          .map((item) => item.course._id);

        setEnrolledCourseIds(ids);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load courses. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError("");
    fetchCourses();
  };

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Enroll in a course
  const handleEnroll = async (courseId) => {
    setEnrollingId(courseId);
    setEnrollmentError("");

    try {
      await enrollInCourse(courseId);

      setEnrolledCourseIds((previous) =>
        previous.includes(courseId) ? previous : [...previous, courseId],
      );
    } catch (err) {
      // Handle duplicate enrollment safely
      if (err.response?.status === 409) {
        setEnrolledCourseIds((previous) =>
          previous.includes(courseId) ? previous : [...previous, courseId],
        );
      } else {
        setEnrollmentError(
          err.response?.data?.message || "Enrollment failed. Please try again.",
        );
      }
    } finally {
      setEnrollingId(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle
            className="mx-auto animate-spin text-indigo-600"
            size={36}
          />
          <p className="mt-3 text-sm text-slate-500">Loading courses...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <AlertCircle size={40} className="text-red-500" />

        <h2 className="mt-4 text-lg font-semibold text-slate-900">
          Something went wrong
        </h2>

        <p className="mt-2 text-sm text-slate-500">{error}</p>

        <button
          onClick={handleRetry}
          className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page heading */}
      <div>
        <p className="text-sm font-medium text-indigo-600">
          Discover something new
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Explore Courses
        </h1>

        <p className="mt-2 text-slate-500">
          Find courses that match your interests and start learning.
        </p>
      </div>

      {/* Catalog summary */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5">
        <div>
          <p className="text-sm text-slate-500">Available courses</p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {courses.length}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
          <BookOpen className="text-indigo-600" size={24} />
        </div>
      </div>


      {enrollmentError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {enrollmentError}
        </div>
      )}


      {courses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <BookOpen size={42} className="mx-auto text-slate-400" />

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No courses available yet
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Published courses will appear here. Please check back later.
          </p>
        </div>
      ) : (
        /* Course cards */
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course._id);

            const isEnrolling = enrollingId === course._id;

            return (
              <article
                key={course._id}
                className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md"
              >
                {/* Card header */}
                <div className="flex h-36 items-center justify-center bg-indigo-50">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <GraduationCap size={34} className="text-indigo-600" />
                  </div>
                </div>

                {/* Card content */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                      Free Course
                    </span>

                    {isEnrolled && (
                      <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                        <CheckCircle2 size={14} />
                        Enrolled
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-semibold text-slate-900">
                    {course.title}
                  </h2>

                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-500">
                    {course.description}
                  </p>

                  {/* Educator information */}
                  <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                      <GraduationCap size={18} className="text-slate-600" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {course.educator?.username || "Educator"}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {course.educator?.bio || "Course educator"}
                      </p>
                    </div>
                  </div>

                  {/* Action */}
                  {isEnrolled ? (
                    <button
                      onClick={() =>
                        navigate(`/student/learning/${course._id}`)
                      }
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                    >
                      Continue Learning
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course._id)}
                      disabled={isEnrolling}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isEnrolling ? (
                        <>
                          <LoaderCircle size={16} className="animate-spin" />
                          Enrolling...
                        </>
                      ) : (
                        "Enroll Now"
                      )}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseCatalog;
