import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  GraduationCap,
  LoaderCircle,
  Library,
} from "lucide-react";

import { getMyEnrollments } from "../../services/course.service";

const MyLearning = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEnrollments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyEnrollments();
      setEnrollments(response.enrollments || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your enrolled courses. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  const validEnrollments = enrollments.filter(
    (enrollment) => enrollment.course,
  );

  const totalCompletedLessons = validEnrollments.reduce(
    (total, enrollment) => total + (enrollment.completedLessons?.length || 0),
    0,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section>
        <p className="text-sm font-medium text-indigo-600">
          Your learning journey
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          My Learning
        </h1>

        <p className="mt-2 text-slate-500">
          Access your enrolled courses and continue where you left off.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Enrolled courses</p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {loading ? "—" : validEnrollments.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
              <BookOpen size={24} className="text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Lessons completed</p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {loading ? "—" : totalCompletedLessons}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
              <GraduationCap size={24} className="text-green-600" />
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0 text-red-500" />

            <p className="text-sm text-red-700">{error}</p>
          </div>

          <button
            onClick={fetchEnrollments}
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
              size={34}
              className="mx-auto animate-spin text-indigo-600"
            />

            <p className="mt-3 text-sm text-slate-500">
              Loading your courses...
            </p>
          </div>
        </div>
      ) : !error && validEnrollments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
            <Library size={28} className="text-indigo-600" />
          </div>

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            No enrolled courses yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Explore the course catalog and enroll in a course to start your
            learning journey.
          </p>

          <Link
            to="/student/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Explore Courses
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        !error && (
          <section>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-900">
                Your enrolled courses
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                You have {validEnrollments.length} enrolled{" "}
                {validEnrollments.length === 1 ? "course" : "courses"}.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {validEnrollments.map((enrollment) => {
                const course = enrollment.course;
                const completedCount = enrollment.completedLessons?.length || 0;

                const hasStarted = completedCount > 0;

                return (
                  <article
                    key={enrollment._id}
                    className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                        <GraduationCap size={25} className="text-indigo-600" />
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          hasStarted
                            ? "bg-indigo-50 text-indigo-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {hasStarted ? "In progress" : "Not started"}
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-slate-900">
                      {course.title}
                    </h3>

                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-500">
                      {course.description}
                    </p>

                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold text-slate-900">
                          {completedCount}
                        </span>{" "}
                        {completedCount === 1
                          ? "lesson completed"
                          : "lessons completed"}
                      </p>

                      {enrollment.createdAt && (
                        <p className="mt-1 text-xs text-slate-400">
                          Enrolled on{" "}
                          {new Date(enrollment.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <Link
                      to={`/student/learning/${course._id}`}
                      className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                      Continue Learning
                      <ArrowRight size={16} />
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        )
      )}
    </div>
  );
};

export default MyLearning;
