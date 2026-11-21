
import { useEffect, useState } from "react";
import {
  BookOpen,
  Plus,
  FileText,
  Video,
  ClipboardList,
  LoaderCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from "lucide-react";

import {
  createSection,
  getCourseSections,
  createLesson,
  getSectionLessons,
} from "../../services/educator.service";

const createQuestion = () => ({
  question: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
  explanation: "",
});

const CourseContentBuilder = ({ courseId }) => {
  const [sections, setSections] = useState([]);
  const [lessons, setLessons] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [loadedCourseId, setLoadedCourseId] = useState(null);
  const loading = loadedCourseId !== courseId;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [sectionTitle, setSectionTitle] = useState("");
  const [activeSectionId, setActiveSectionId] = useState("");
  const [lessonType, setLessonType] = useState("text");

  const [lessonForm, setLessonForm] = useState({
    title: "",
    content: "",
    videoUrl: "",
    questions: [createQuestion()],
  });

  useEffect(() => {
    let active = true;

    const fetchContent = async () => {
      try {
        const data = await getCourseSections(courseId);
        const fetchedSections = data.sections || [];

        const lessonResults = await Promise.all(
          fetchedSections.map(async (section) => {
            const response = await getSectionLessons(section._id);
            return [section._id, response.lessons || []];
          })
        );

        if (!active) return;

        setSections(fetchedSections);
        setLessons(Object.fromEntries(lessonResults));
        setExpandedSections(
          Object.fromEntries(fetchedSections.map((section) => [section._id, true]))
        );
        setError("");
      } catch (err) {
        if (!active) return;

        setSections([]);
        setLessons({});
        setError(
          err.response?.data?.message ||
            "Unable to load course content."
        );
      } finally {
        if (active) {
          setLoadedCourseId(courseId);
        }
      }
    };

    fetchContent();

    return () => {
      active = false;
    };
  }, [courseId]);

  const handleCreateSection = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const title = sectionTitle.trim();

    if (!title) {
      setError("Please enter a section title.");
      return;
    }

    setSaving(true);

    try {
      const data = await createSection({
        title,
        courseId,
      });

      const section = data.section;

      setSections((current) => [...current, section]);
      setLessons((current) => ({
        ...current,
        [section._id]: [],
      }));
      setExpandedSections((current) => ({
        ...current,
        [section._id]: true,
      }));

      setSectionTitle("");
      setSuccess("Section created successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create section."
      );
    } finally {
      setSaving(false);
    }
  };

  const resetLessonForm = () => {
    setLessonForm({
      title: "",
      content: "",
      videoUrl: "",
      questions: [createQuestion()],
    });
  };

  const handleAddQuestion = () => {
    setLessonForm((current) => ({
      ...current,
      questions: [...current.questions, createQuestion()],
    }));
  };

  const handleRemoveQuestion = (index) => {
    setLessonForm((current) => ({
      ...current,
      questions: current.questions.filter(
        (_, questionIndex) => questionIndex !== index
      ),
    }));
  };

  const handleQuestionChange = (questionIndex, field, value) => {
    setLessonForm((current) => ({
      ...current,
      questions: current.questions.map((question, index) =>
        index === questionIndex
          ? { ...question, [field]: value }
          : question
      ),
    }));
  };

  const handleOptionChange = (
    questionIndex,
    optionIndex,
    value
  ) => {
    setLessonForm((current) => ({
      ...current,
      questions: current.questions.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              options: question.options.map((option, currentIndex) =>
                currentIndex === optionIndex ? value : option
              ),
            }
          : question
      ),
    }));
  };

  const handleCreateLesson = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const title = lessonForm.title.trim();

    if (!activeSectionId) {
      setError("Please select a section.");
      return;
    }

    if (!title) {
      setError("Please enter a lesson title.");
      return;
    }

    let payload = {
      title,
      type: lessonType,
      sectionId: activeSectionId,
    };

    if (lessonType === "text") {
      if (!lessonForm.content.trim()) {
        setError("Please enter the text lesson content.");
        return;
      }

      payload.content = lessonForm.content.trim();
    }

    if (lessonType === "video") {
      const videoUrl = lessonForm.videoUrl.trim();

      if (!videoUrl) {
        setError("Please enter a video URL.");
        return;
      }

      try {
        const url = new URL(videoUrl);

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid URL");
        }
      } catch {
        setError("Please enter a valid HTTP or HTTPS video URL.");
        return;
      }

      payload.videoUrl = videoUrl;
    }

    if (lessonType === "quiz") {
      const invalidQuestion = lessonForm.questions.some(
        (question) =>
          !question.question.trim() ||
          question.options.length !== 4 ||
          question.options.some((option) => !option.trim()) ||
          !Number.isInteger(question.correctAnswer) ||
          question.correctAnswer < 0 ||
          question.correctAnswer > 3
      );

      if (invalidQuestion) {
        setError(
          "Every quiz question needs a question, four options, and a correct answer."
        );
        return;
      }

      payload.questions = lessonForm.questions.map((question) => ({
        question: question.question.trim(),
        options: question.options.map((option) => option.trim()),
        correctAnswer: question.correctAnswer,
        explanation: question.explanation.trim(),
      }));
    }

    setSaving(true);

    try {
      const data = await createLesson(payload);

      setLessons((current) => ({
        ...current,
        [activeSectionId]: [
          ...(current[activeSectionId] || []),
          data.lesson,
        ],
      }));

      resetLessonForm();
      setSuccess("Lesson created successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create lesson."
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((current) => ({
      ...current,
      [sectionId]: !current[sectionId],
    }));
  };

  const getLessonIcon = (type) => {
    if (type === "video") return Video;
    if (type === "quiz") return ClipboardList;
    return FileText;
  };

  if (loading) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-xl border border-slate-200 bg-white">
        <LoaderCircle
          className="animate-spin text-indigo-600"
          size={30}
        />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Course Content
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Organize your course into sections and lessons.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0 text-red-500"
          />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-4">
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0 text-green-600"
          />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="font-semibold text-slate-900">
          Add a section
        </h3>

        <form
          onSubmit={handleCreateSection}
          className="mt-4 flex flex-col gap-3 sm:flex-row"
        >
          <input
            value={sectionTitle}
            onChange={(event) => setSectionTitle(event.target.value)}
            placeholder="e.g. Introduction to React"
            disabled={saving}
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Plus size={17} />
            )}
            Add Section
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {sections.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
            <BookOpen
              className="mx-auto text-slate-400"
              size={30}
            />
            <p className="mt-3 font-semibold text-slate-800">
              No sections yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Add your first section to start building the course.
            </p>
          </div>
        ) : (
          sections.map((section, index) => (
            <article
              key={section._id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <button
                type="button"
                onClick={() => toggleSection(section._id)}
                className="flex w-full items-center justify-between gap-3 p-5 text-left hover:bg-slate-50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-bold text-indigo-700">
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-slate-900">
                      {section.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {(lessons[section._id] || []).length} lessons
                    </p>
                  </div>
                </div>

                {expandedSections[section._id] ? (
                  <ChevronUp size={20} className="shrink-0 text-slate-400" />
                ) : (
                  <ChevronDown size={20} className="shrink-0 text-slate-400" />
                )}
              </button>

              {expandedSections[section._id] && (
                <div className="space-y-4 border-t border-slate-100 p-5">
                  {(lessons[section._id] || []).length === 0 ? (
                    <p className="py-3 text-center text-sm text-slate-400">
                      No lessons in this section yet.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {(lessons[section._id] || []).map((lesson, lessonIndex) => {
                        const Icon = getLessonIcon(lesson.type);

                        return (
                          <div
                            key={lesson._id}
                            className="flex items-center gap-3 rounded-lg bg-slate-50 p-3"
                          >
                            <Icon
                              size={18}
                              className="shrink-0 text-indigo-600"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-slate-800">
                                {lessonIndex + 1}. {lesson.title}
                              </p>
                              <p className="mt-0.5 text-xs capitalize text-slate-400">
                                {lesson.type} lesson
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setActiveSectionId(section._id);
                      setError("");
                      setSuccess("");
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                  >
                    <Plus size={16} />
                    Add Lesson
                  </button>

                  {activeSectionId === section._id && (
                    <form
                      onSubmit={handleCreateLesson}
                      className="space-y-5 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 sm:p-5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="font-semibold text-slate-900">
                          New lesson
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSectionId("");
                            resetLessonForm();
                          }}
                          className="text-sm font-medium text-slate-500 hover:text-slate-800"
                        >
                          Cancel
                        </button>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Lesson title
                        </label>
                        <input
                          value={lessonForm.title}
                          onChange={(event) =>
                            setLessonForm((current) => ({
                              ...current,
                              title: event.target.value,
                            }))
                          }
                          placeholder="Enter lesson title"
                          disabled={saving}
                          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Lesson type
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: "text", label: "Text", icon: FileText },
                            { value: "video", label: "Video", icon: Video },
                            { value: "quiz", label: "Quiz", icon: ClipboardList },
                          ].map((type) => {
                            const TypeIcon = type.icon;

                            return (
                              <button
                                key={type.value}
                                type="button"
                                onClick={() => setLessonType(type.value)}
                                className={`flex items-center justify-center gap-2 rounded-lg border px-2 py-3 text-sm font-medium transition ${
                                  lessonType === type.value
                                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200"
                                }`}
                              >
                                <TypeIcon size={17} />
                                {type.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {lessonType === "text" && (
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Lesson content
                          </label>
                          <textarea
                            rows={7}
                            value={lessonForm.content}
                            onChange={(event) =>
                              setLessonForm((current) => ({
                                ...current,
                                content: event.target.value,
                              }))
                            }
                            placeholder="Write your lesson content here..."
                            disabled={saving}
                            className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                          />
                        </div>
                      )}

                      {lessonType === "video" && (
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Video URL
                          </label>
                          <input
                            type="url"
                            value={lessonForm.videoUrl}
                            onChange={(event) =>
                              setLessonForm((current) => ({
                                ...current,
                                videoUrl: event.target.value,
                              }))
                            }
                            placeholder="https://www.youtube.com/watch?v=..."
                            disabled={saving}
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                          />
                          <p className="mt-2 text-xs text-slate-500">
                            YouTube links and direct MP4, WebM or OGG URLs are supported by the student player.
                          </p>
                        </div>
                      )}

                      {lessonType === "quiz" && (
                        <div className="space-y-5">
                          {lessonForm.questions.map((question, questionIndex) => (
                            <div
                              key={questionIndex}
                              className="space-y-4 rounded-lg border border-slate-200 bg-white p-4"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <h5 className="text-sm font-semibold text-slate-800">
                                  Question {questionIndex + 1}
                                </h5>

                                {lessonForm.questions.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveQuestion(questionIndex)}
                                    className="text-xs font-medium text-red-600 hover:underline"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>

                              <input
                                value={question.question}
                                onChange={(event) =>
                                  handleQuestionChange(
                                    questionIndex,
                                    "question",
                                    event.target.value
                                  )
                                }
                                placeholder="Enter your question"
                                disabled={saving}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                              />

                              <div className="space-y-3">
                                {question.options.map((option, optionIndex) => (
                                  <div
                                    key={optionIndex}
                                    className="flex items-center gap-3"
                                  >
                                    <input
                                      type="radio"
                                      name={`correct-${questionIndex}`}
                                      checked={question.correctAnswer === optionIndex}
                                      onChange={() =>
                                        handleQuestionChange(
                                          questionIndex,
                                          "correctAnswer",
                                          optionIndex
                                        )
                                      }
                                      className="h-4 w-4 accent-indigo-600"
                                    />

                                    <input
                                      value={option}
                                      onChange={(event) =>
                                        handleOptionChange(
                                          questionIndex,
                                          optionIndex,
                                          event.target.value
                                        )
                                      }
                                      placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                      disabled={saving}
                                      className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                                    />
                                  </div>
                                ))}
                              </div>

                              <p className="text-xs text-slate-500">
                                Select the radio button beside the correct answer.
                              </p>

                              <textarea
                                rows={2}
                                value={question.explanation}
                                onChange={(event) =>
                                  handleQuestionChange(
                                    questionIndex,
                                    "explanation",
                                    event.target.value
                                  )
                                }
                                placeholder="Optional explanation for the correct answer"
                                disabled={saving}
                                className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                              />
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={handleAddQuestion}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-800"
                          >
                            <Plus size={16} />
                            Add another question
                          </button>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                      >
                        {saving ? (
                          <LoaderCircle size={17} className="animate-spin" />
                        ) : (
                          <Plus size={17} />
                        )}
                        Save Lesson
                      </button>
                    </form>
                  )}
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default CourseContentBuilder;
