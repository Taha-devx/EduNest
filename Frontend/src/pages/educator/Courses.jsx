
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  PlusCircle,
  Globe,
  FileEdit,
  Trash2,
  LoaderCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import {
  getMyCourses,
  updateCourse,
  deleteCourse,
} from "../../services/educator.service";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const fetchCourses = useCallback(async () => {
    try {
      const data = await getMyCourses();
      setCourses(data.course || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your courses. Please try again."
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

  const handleStatusChange = async (course) => {
    const nextStatus =
      course.status === "published" ? "draft" : "published";

    setActionLoading(course._id);
    setError("");

    try {
      await updateCourse(course._id, { status: nextStatus });

      setCourses((currentCourses) =>
        currentCourses.map((item) =>
          item._id === course._id
            ? { ...item, status: nextStatus }
            : item
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update the course status."
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleDelete = async (course) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setActionLoading(course._id);
    setError("");

    try {
      await deleteCourse(course._id);

      setCourses((currentCourses) =>
        currentCourses.filter((item) => item._id !== course._id)
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete the course. Please try again."
      );
    } finally {
      setActionLoading("");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My Courses
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create and manage your courses from one place.
          </p>
        </div>

        <Link
          to="/educator/courses/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <PlusCircle size={18} />
          Create Course
        </Link>
      </div>

      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="shrink-0 text-red-500" size={20} />
            <p className="text-sm text-red-700">{error}</p>
          </div>

          <button
            onClick={handleRetry}
            className="text-sm font-semibold text-red-700 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-64 items-center justify-center rounded-xl border border-slate-200 bg-white">
          <div className="text-center">
            <LoaderCircle
              className="mx-auto animate-spin text-indigo-600"
              size={32}
            />
            <p className="mt-3 text-sm text-slate-500">
              Loading your courses...
            </p>
          </div>
        </div>
      ) : !error && courses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
            <BookOpen className="text-indigo-600" size={28} />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No courses yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Create your first course to start organizing lessons and
            sharing knowledge with students.
          </p>

          <Link
            to="/educator/courses/new"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <PlusCircle size={16} />
            Create Your First Course
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const busy = actionLoading === course._id;

            return (
              <article
                key={course._id}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                    <BookOpen className="text-indigo-600" size={24} />
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      course.status === "published"
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {course.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>

                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                  {course.title}
                </h2>

                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-500">
                  {course.description}
                </p>

                <p className="mt-4 text-xs text-slate-400">
                  Created{" "}
                  {course.createdAt
                    ? new Date(course.createdAt).toLocaleDateString()
                    : "recently"}
                </p>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  <Link
                    to={`/educator/courses/${course._id}/edit`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <FileEdit size={16} />
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(course)}
                    disabled={busy}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busy ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : course.status === "published" ? (
                      <FileEdit size={16} />
                    ) : (
                      <Globe size={16} />
                    )}
                    {course.status === "published" ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(course)}
                    disabled={busy}
                    title="Delete course"
                    className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busy ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {!loading && courses.length > 0 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <p className="text-sm text-slate-500">
            {courses.length} {courses.length === 1 ? "course" : "courses"} total
          </p>

          <button
            type="button"
            onClick={handleRetry}
            disabled={loading || Boolean(actionLoading)}
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>
      )}
    </div>
  );
};

export default Courses;
