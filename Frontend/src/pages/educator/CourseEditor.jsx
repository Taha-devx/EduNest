import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  LoaderCircle,
  Save,
  Globe,
  AlertCircle,
} from "lucide-react";

import {
  createCourse,
  getCourseById,
  updateCourse,
} from "../../services/educator.service";
import CourseContentBuilder from "../../components/educator/CourseContentBuilder";

const CourseEditor = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const isEditing = Boolean(courseId);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isEditing) return;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCourseById(courseId);

        setFormData({
          title: data.course.title || "",
          description: data.course.description || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load this course.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, isEditing]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (status) => {
    setError("");
    setSuccess("");

    const title = formData.title.trim();
    const description = formData.description.trim();

    if (title.length < 3) {
      setError("Course title must contain at least 3 characters.");
      return;
    }

    if (description.length < 10) {
      setError("Course description must contain at least 10 characters.");
      return;
    }

    setSaving(true);

    try {
      let savedCourseId = courseId;

      if (isEditing) {
        await updateCourse(courseId, {
          title,
          description,
          status,
        });
      } else {
        const data = await createCourse({
          title,
          description,
        });

        savedCourseId = data.course._id;

        if (status === "published") {
          await updateCourse(savedCourseId, {
            status: "published",
          });
        }
      }

      setSuccess(
        status === "published"
          ? "Course published successfully!"
          : "Course saved as draft successfully!",
      );

      navigate(`/educator/courses/${savedCourseId}/edit`, {
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save your course. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <LoaderCircle
            className="mx-auto animate-spin text-indigo-600"
            size={34}
          />
          <p className="mt-3 text-sm text-slate-500">Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <div>
        <Link
          to="/educator/courses"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
          Back to My Courses
        </Link>

        <div className="mt-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
            <BookOpen className="text-indigo-600" size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isEditing ? "Edit Course" : "Create a Course"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {isEditing
                ? "Update your course information."
                : "Start by adding the basic information about your course."}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 shrink-0 text-red-500" size={19} />
          <p className="text-sm leading-6 text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <form
        onSubmit={(event) => event.preventDefault()}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Course Title
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Complete React Development"
            maxLength={120}
            disabled={saving}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
          />

          <p className="mt-2 text-xs text-slate-400">Minimum 3 characters.</p>
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Course Description
          </label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Explain what students will learn in this course..."
            rows={7}
            maxLength={2000}
            disabled={saving}
            className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
          />

          <div className="mt-2 flex justify-between text-xs text-slate-400">
            <span>Minimum 10 characters.</span>
            <span>{formData.description.length}/2000</span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-800">
            Course publishing
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Draft courses remain unpublished. Published courses become available
            in the student course catalog.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <Link
            to="/educator/courses"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="button"
            onClick={() => handleSubmit("draft")}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-indigo-200 px-5 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Save size={17} />
            )}
            Save as Draft
          </button>

          <button
            type="button"
            onClick={() => handleSubmit("published")}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Globe size={17} />
            )}
            {isEditing ? "Save & Publish" : "Create & Publish"}
          </button>
        </div>
      </form>
      {isEditing && <CourseContentBuilder courseId={courseId} />}
    </div>
  );
};

export default CourseEditor;
