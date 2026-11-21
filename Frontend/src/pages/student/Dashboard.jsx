
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  BookOpen,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  LoaderCircle,
  AlertCircle,
  Compass,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getMyEnrollments } from "../../services/course.service";

const Dashboard = () => {
  const { user } = useAuth();

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEnrollments = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getMyEnrollments();
      setEnrollments(data.enrollments || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your learning information. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const totalCompletedLessons = enrollments.reduce(
    (total, enrollment) =>
      total + (enrollment.completedLessons?.length || 0),
    0
  );

  const firstName = user?.username?.split(" ")[0] || "Student";

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* Welcome section */}
      <section className="rounded-2xl bg-indigo-600 px-6 py-8 text-white sm:px-10">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-indigo-100">
            Your learning journey starts here
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, {firstName}!
          </h1>

          <p className="mt-3 text-sm leading-6 text-indigo-100 sm:text-base">
            Keep learning, build new skills, and make progress
            toward your goals.
          </p>

          <Link
            to="/student/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
          >
            Explore Courses
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Error state */}
      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="shrink-0 text-red-500" size={20} />
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

      {/* Learning statistics */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            Your learning overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            A quick look at your learning activity.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Enrolled courses
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {loading ? "—" : enrollments.length}
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
                <p className="text-sm text-slate-500">
                  Lessons completed
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {loading ? "—" : totalCompletedLessons}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                <CheckCircle2 className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enrolled courses */}
      <section>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Continue learning
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Pick up where you left off.
            </p>
          </div>

          <Link
            to="/student/my-learning"
            className="hidden items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 sm:flex"
          >
            My Learning
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
        ) : !error && enrollments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
              <GraduationCap className="text-indigo-600" size={28} />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Your learning journey is waiting
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              You haven't enrolled in any courses yet.
              Explore the catalog and find something you'd like to learn.
            </p>

            <Link
              to="/student/courses"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Compass size={16} />
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {enrollments.slice(0, 3).map((enrollment) => {
              const course = enrollment.course;

              if (!course) return null;

              const completedCount =
                enrollment.completedLessons?.length || 0;

              return (
                <article
                  key={enrollment._id}
                  className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                    <GraduationCap
                      className="text-indigo-600"
                      size={25}
                    />
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    {course.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-slate-500">
                    {course.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-xs text-slate-500">
                      {completedCount} lessons completed
                    </span>

                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                      {completedCount > 0 ? "In progress" : "Not started"}
                    </span>
                  </div>

                  <Link
                    to={`/student/learning/${course._id}`}
                    className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Continue Learning
                    <ArrowRight size={16} />
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
