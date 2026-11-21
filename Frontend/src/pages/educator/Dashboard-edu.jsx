
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  PlusCircle,
  Globe,
  FileEdit,
  ArrowRight,
  LoaderCircle,
  AlertCircle,
  GraduationCap,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getMyCourses } from "../../services/educator.service";

const DashboardEducator = () => {
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const publishedCount = courses.filter(
    (course) => course.status === "published"
  ).length;

  const draftCount = courses.filter(
    (course) => course.status === "draft"
  ).length;

  const firstName = user?.username?.split(" ")[0] || "Educator";

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-2xl bg-indigo-600 px-6 py-8 text-white sm:px-10">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-indigo-100">
            Educator workspace
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, {firstName}!
          </h1>

          <p className="mt-3 text-sm leading-6 text-indigo-100 sm:text-base">
            Create courses, organize your lessons, and share your knowledge
            with students.
          </p>

          <Link
            to="/educator/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
          >
            Manage Courses
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

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

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            Course overview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Track the courses you have created.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total courses</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {loading ? "—" : courses.length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                <BookOpen className="text-indigo-600" size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Published</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {loading ? "—" : publishedCount}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                <Globe className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Drafts</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {loading ? "—" : draftCount}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
                <FileEdit className="text-amber-600" size={24} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Your courses
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              A quick look at your recently created courses.
            </p>
          </div>

          <Link
            to="/educator/courses"
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center rounded-xl border border-slate-200 bg-white">
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
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
              <GraduationCap className="text-indigo-600" size={28} />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Your first course starts here
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              You haven't created any courses yet. Start building your
              first course and prepare it for students.
            </p>

            <Link
              to="/educator/courses"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <PlusCircle size={16} />
              View My Courses
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {courses.slice(0, 4).map((course) => (
              <article
                key={course._id}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                    <BookOpen className="text-indigo-600" size={22} />
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

                <h3 className="mt-4 font-semibold text-slate-900">
                  {course.title}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                  {course.description}
                </p>

                <p className="mt-4 text-xs text-slate-400">
                  Created{" "}
                  {course.createdAt
                    ? new Date(course.createdAt).toLocaleDateString()
                    : "recently"}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardEducator;
