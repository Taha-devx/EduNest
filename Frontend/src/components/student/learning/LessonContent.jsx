import { BookOpen, CheckCircle2, ChevronRight, LoaderCircle } from "lucide-react";
import QuizLesson from "./QuizLesson";
import TextLesson from "./TextLesson";
import VideoLesson from "./VideoLesson";

const LessonContent = ({
  selectedLesson,
  selectedLessonIndex,
  totalLessons,
  isLessonCompleted,
  completionLoading,
  onCompleteLesson,
  onNextLesson,
  quizProps,
}) => (
  <main className="min-w-0 space-y-5">
    {!selectedLesson ? (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
        <BookOpen size={40} className="mx-auto text-slate-300" />

        <h2 className="mt-4 text-lg font-bold text-slate-900">
          No lesson selected
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Select a lesson from the course content to get started.
        </p>
      </div>
    ) : (
      <>
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-5 sm:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold capitalize text-indigo-700">
                {selectedLesson.type} lesson
              </span>

              {isLessonCompleted(selectedLesson._id) && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  <CheckCircle2 size={13} />
                  Completed
                </span>
              )}
            </div>

            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              {selectedLesson.title}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Work through this lesson and mark it as completed when you're
              ready.
            </p>
          </div>

          <div className="p-5 sm:p-7">
            {selectedLesson.type === "text" && (
              <TextLesson lesson={selectedLesson} />
            )}

            {selectedLesson.type === "video" && (
              <VideoLesson lesson={selectedLesson} />
            )}

            {selectedLesson.type === "quiz" && (
              <QuizLesson {...quizProps} lesson={selectedLesson} />
            )}
          </div>

          {selectedLesson.type !== "quiz" && (
            <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div className="text-sm text-slate-500">
                {isLessonCompleted(selectedLesson._id)
                  ? "You've completed this lesson."
                  : "Finished this lesson? Mark it as completed."}
              </div>

              <button
                onClick={onCompleteLesson}
                disabled={
                  completionLoading ||
                  isLessonCompleted(selectedLesson._id)
                }
                className={`flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                  isLessonCompleted(selectedLesson._id)
                    ? "cursor-default bg-green-50 text-green-700"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
                }`}
              >
                {completionLoading ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={17} />
                )}

                {isLessonCompleted(selectedLesson._id)
                  ? "Completed"
                  : "Mark as Complete"}
              </button>
            </div>
          )}
        </section>

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Lesson {selectedLessonIndex + 1} of {totalLessons}
          </p>

          <button
            onClick={onNextLesson}
            disabled={
              selectedLessonIndex < 0 ||
              selectedLessonIndex >= totalLessons - 1
            }
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next lesson
            <ChevronRight size={17} />
          </button>
        </div>
      </>
    )}
  </main>
);

export default LessonContent;
