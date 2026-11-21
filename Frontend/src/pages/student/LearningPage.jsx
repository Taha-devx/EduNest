import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, LoaderCircle } from "lucide-react";

import CourseSidebar from "../../components/student/learning/CourseSidebar";
import LearningProgress from "../../components/student/learning/LearningProgress";
import LessonContent from "../../components/student/learning/LessonContent";
import {
  completeLesson,
  getEnrolledCourseContent,
  submitQuizAttempt,
} from "../../services/course.service";

const LearningPage = () => {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  const [loadedCourseId, setLoadedCourseId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const loading = refreshing || loadedCourseId !== courseId;
  const requestIdRef = useRef(0);
  const [error, setError] = useState("");
  const [completionLoading, setCompletionLoading] = useState(false);

  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizError, setQuizError] = useState("");

  const allLessons = useMemo(
    () => sections.flatMap((section) => section.lessons || []),
    [sections],
  );

  const totalLessons = allLessons.length;
  const progress =
    totalLessons > 0
      ? Math.round((completedLessons.length / totalLessons) * 100)
      : 0;

  const fetchCourseContent = useCallback(async ({ refresh = false } = {}) => {
    const requestId = ++requestIdRef.current;

    if (refresh) {
      setRefreshing(true);
      setError("");
    }

    try {
      const response = await getEnrolledCourseContent(courseId);

      if (requestId !== requestIdRef.current) return;

      setCourse(response.course);
      setSections(response.sections || []);
      setCompletedLessons(
        (response.completedLessons || []).map((lesson) =>
          typeof lesson === "string" ? lesson : lesson._id,
        ),
      );

      const firstSection = response.sections?.[0];
      const firstLesson = firstSection?.lessons?.[0];

      setSelectedLesson(firstLesson || null);
      setExpandedSections(firstSection ? { [firstSection._id]: true } : {});
      setQuizAnswers({});
      setQuizResult(null);
      setQuizError("");
      setError("");
    } catch (err) {
      if (requestId !== requestIdRef.current) return;

      setCourse(null);
      setSections([]);
      setCompletedLessons([]);
      setSelectedLesson(null);
      setExpandedSections({});
      setError(
        err.response?.data?.message ||
          "Unable to load course content. Please try again.",
      );
    } finally {
      if (requestId === requestIdRef.current) {
        setLoadedCourseId(courseId);
        setRefreshing(false);
      }
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseContent();
    return () => {
      requestIdRef.current += 1;
    };
  }, [fetchCourseContent]);

  const isLessonCompleted = (lessonId) => completedLessons.includes(lessonId);

  const handleToggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
    setQuizAnswers({});
    setQuizResult(null);
    setQuizError("");
  };

  const setProgressFromResponse = (updatedProgress) => {
    if (updatedProgress === 100) {
      setCompletedLessons((prev) => {
        const remaining = allLessons
          .filter((lesson) => !prev.includes(lesson._id))
          .map((lesson) => lesson._id);

        return [...prev, ...remaining];
      });
    }
  };

  const handleCompleteLesson = async () => {
    if (!selectedLesson || isLessonCompleted(selectedLesson._id)) {
      return;
    }

    try {
      setCompletionLoading(true);
      setError("");

      const response = await completeLesson(courseId, selectedLesson._id);

      setCompletedLessons((prev) =>
        prev.includes(selectedLesson._id)
          ? prev
          : [...prev, selectedLesson._id],
      );

      const updatedProgress = Number.parseInt(response.progress, 10);

      if (Number.isFinite(updatedProgress)) {
        setProgressFromResponse(updatedProgress);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to mark this lesson as completed.",
      );
    } finally {
      setCompletionLoading(false);
    }
  };

  const handleQuizAnswer = (questionId, optionIndex) => {
    if (quizResult) return;

    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));

    setQuizError("");
  };

  const handleSubmitQuiz = async () => {
    const questions = selectedLesson?.questions || [];

    if (questions.some((question) => quizAnswers[question._id] === undefined)) {
      setQuizError("Please answer every question before submitting.");
      return;
    }

    try {
      setQuizSubmitting(true);
      setQuizError("");

      const answers = questions.map((question) => ({
        questionId: question._id,
        selectedOption: quizAnswers[question._id],
      }));

      const response = await submitQuizAttempt(
        courseId,
        selectedLesson._id,
        answers,
      );

      setQuizResult(response.result);

      if (!isLessonCompleted(selectedLesson._id)) {
        try {
          const completionResponse = await completeLesson(
            courseId,
            selectedLesson._id,
          );

          setCompletedLessons((prev) =>
            prev.includes(selectedLesson._id)
              ? prev
              : [...prev, selectedLesson._id],
          );

          const updatedProgress = Number.parseInt(
            completionResponse.progress,
            10,
          );

          if (Number.isFinite(updatedProgress)) {
            setProgressFromResponse(updatedProgress);
          }
        } catch {
          setQuizError(
            "Your quiz was submitted, but lesson completion could not be saved.",
          );
        }
      }
    } catch (err) {
      setQuizError(err.response?.data?.message || "Failed to submit quiz.");
    } finally {
      setQuizSubmitting(false);
    }
  };

  const handleRetryQuiz = () => {
    setQuizAnswers({});
    setQuizResult(null);
    setQuizError("");
  };

  const getQuizAnswer = (questionId) =>
    quizResult?.answers?.find(
      (answer) => String(answer.questionId) === String(questionId),
    );

  const completedCount = completedLessons.length;

  const selectedLessonIndex = allLessons.findIndex(
    (lesson) => lesson._id === selectedLesson?._id,
  );

  const handleNextLesson = () => {
    if (
      selectedLessonIndex >= 0 &&
      selectedLessonIndex < allLessons.length - 1
    ) {
      handleSelectLesson(allLessons[selectedLessonIndex + 1]);

      const nextLesson = allLessons[selectedLessonIndex + 1];
      const parentSection = sections.find((section) =>
        section.lessons?.some((lesson) => lesson._id === nextLesson._id),
      );

      if (parentSection) {
        setExpandedSections((prev) => ({
          ...prev,
          [parentSection._id]: true,
        }));
      }
    }
  };

  const quizProps = {
    answers: quizAnswers,
    result: quizResult,
    submitting: quizSubmitting,
    error: quizError,
    getAnswer: getQuizAnswer,
    onAnswer: handleQuizAnswer,
    onSubmit: handleSubmitQuiz,
    onRetry: handleRetryQuiz,
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle
            size={36}
            className="mx-auto animate-spin text-indigo-600"
          />
          <p className="mt-4 text-sm text-slate-500">Loading your course...</p>
        </div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <AlertCircle size={42} className="mx-auto text-red-500" />

        <h2 className="mt-4 text-xl font-bold text-slate-900">
          Unable to open course
        </h2>

        <p className="mt-2 text-sm text-slate-500">{error}</p>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => fetchCourseContent({ refresh: true })}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Try again
          </button>

          <Link
            to="/student/my-learning"
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Go back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <Link
          to="/student/my-learning"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft size={16} />
          Back to My Learning
        </Link>
      </div>

      <LearningProgress
        course={course}
        progress={progress}
        completedCount={completedCount}
        totalLessons={totalLessons}
      />

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle size={20} className="mt-0.5 shrink-0 text-red-500" />

          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <CourseSidebar
          sections={sections}
          expandedSections={expandedSections}
          selectedLesson={selectedLesson}
          completedLessons={completedLessons}
          totalLessons={totalLessons}
          onToggleSection={handleToggleSection}
          onSelectLesson={handleSelectLesson}
        />

        <LessonContent
          selectedLesson={selectedLesson}
          selectedLessonIndex={selectedLessonIndex}
          totalLessons={totalLessons}
          isLessonCompleted={isLessonCompleted}
          completionLoading={completionLoading}
          onCompleteLesson={handleCompleteLesson}
          onNextLesson={handleNextLesson}
          quizProps={quizProps}
        />
      </div>
    </div>
  );
};

export default LearningPage;
