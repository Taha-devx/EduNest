import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  RotateCcw,
  Send,
  Trophy,
} from "lucide-react";

const QuizLesson = ({
  lesson,
  answers,
  result,
  submitting,
  error,
  getAnswer,
  onAnswer,
  onSubmit,
  onRetry,
}) => (
  <div className="space-y-6">
    <div className="flex flex-col gap-3 rounded-xl bg-indigo-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="font-semibold text-indigo-900">
          Test your understanding
        </h3>

        <p className="mt-1 text-sm text-indigo-700">
          Select one answer for each question.
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
        <Clock3 size={17} />
        {lesson.questions?.length || 0} questions
      </div>
    </div>

    {!result && (
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-600">Your progress</span>

        <span className="font-semibold text-indigo-600">
          {Object.keys(answers).length}/{lesson.questions?.length || 0}{" "}
          answered
        </span>
      </div>
    )}

    <div className="space-y-6">
      {(lesson.questions || []).map((question, questionIndex) => {
        const selectedOption = answers[question._id];
        const answer = getAnswer(question._id);

        return (
          <div
            key={question._id}
            className="rounded-xl border border-slate-200 p-4 sm:p-5"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-bold text-indigo-700">
                {questionIndex + 1}
              </span>

              <h4 className="pt-1 font-semibold leading-6 text-slate-900">
                {question.question}
              </h4>
            </div>

            <div className="mt-5 space-y-3">
              {(question.options || []).map((option, optionIndex) => {
                const isSelected = selectedOption === optionIndex;
                const isCorrect = answer?.correctOption === optionIndex;
                const isWrongSelection =
                  result && isSelected && !answer?.isCorrect;

                let optionStyle =
                  "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50";

                if (!result && isSelected) {
                  optionStyle =
                    "border-indigo-500 bg-indigo-50 text-indigo-800 ring-1 ring-indigo-500";
                }

                if (result && isCorrect) {
                  optionStyle = "border-green-300 bg-green-50 text-green-800";
                }

                if (isWrongSelection) {
                  optionStyle = "border-red-300 bg-red-50 text-red-800";
                }

                return (
                  <button
                    key={optionIndex}
                    type="button"
                    disabled={!!result}
                    onClick={() => onAnswer(question._id, optionIndex)}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition disabled:cursor-default ${optionStyle}`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current/20 text-xs font-semibold">
                      {String.fromCharCode(65 + optionIndex)}
                    </span>

                    <span className="flex-1">{option}</span>

                    {result && isCorrect && (
                      <CheckCircle2
                        size={19}
                        className="shrink-0 text-green-600"
                      />
                    )}

                    {isWrongSelection && (
                      <AlertCircle
                        size={19}
                        className="shrink-0 text-red-600"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {result && answer && (
              <div
                className={`mt-4 rounded-lg p-4 ${
                  answer.isCorrect ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  {answer.isCorrect ? (
                    <CheckCircle2 size={18} className="text-green-600" />
                  ) : (
                    <AlertCircle size={18} className="text-red-600" />
                  )}

                  <p
                    className={`text-sm font-semibold ${
                      answer.isCorrect ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {answer.isCorrect ? "Correct answer!" : "Incorrect answer"}
                  </p>
                </div>

                {!answer.isCorrect && (
                  <p className="mt-2 text-sm text-slate-700">
                    Correct answer:{" "}
                    <span className="font-semibold">
                      {question.options[answer.correctOption]}
                    </span>
                  </p>
                )}

                {answer.explanation && (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {answer.explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>

    {error && (
      <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
        <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />

        <p className="text-sm text-red-700">{error}</p>
      </div>
    )}

    {!result ? (
      <button
        onClick={onSubmit}
        disabled={
          submitting ||
          Object.keys(answers).length !== lesson.questions?.length
        }
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {submitting ? (
          <>
            <LoaderCircle size={18} className="animate-spin" />
            Submitting quiz...
          </>
        ) : (
          <>
            <Send size={17} />
            Submit Quiz
          </>
        )}
      </button>
    ) : (
      <div className="space-y-5 rounded-xl border border-slate-200 p-5">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
            <Trophy size={28} className="text-indigo-600" />
          </div>

          <h3 className="mt-3 text-xl font-bold text-slate-900">
            Quiz completed!
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Here's how you performed.
          </p>

          <p className="mt-4 text-4xl font-bold text-indigo-600">
            {result.score}%
          </p>

          <p className="mt-1 text-sm text-slate-500">Your score</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-slate-50 p-3 text-center">
            <p className="text-xl font-bold text-slate-900">
              {result.totalQuestions}
            </p>
            <p className="mt-1 text-xs text-slate-500">Total</p>
          </div>

          <div className="rounded-lg bg-green-50 p-3 text-center">
            <p className="text-xl font-bold text-green-700">
              {result.correctCount}
            </p>
            <p className="mt-1 text-xs text-green-700">Correct</p>
          </div>

          <div className="rounded-lg bg-red-50 p-3 text-center">
            <p className="text-xl font-bold text-red-700">
              {result.incorrectCount}
            </p>
            <p className="mt-1 text-xs text-red-700">Incorrect</p>
          </div>
        </div>

        <button
          onClick={onRetry}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-200 px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
        >
          <RotateCcw size={17} />
          Try Again
        </button>
      </div>
    )}
  </div>
);

export default QuizLesson;
