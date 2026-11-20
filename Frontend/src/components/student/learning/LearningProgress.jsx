import { GraduationCap } from "lucide-react";

const LearningProgress = ({
  course,
  progress,
  completedCount,
  totalLessons,
}) => (
  <section className="rounded-2xl bg-indigo-600 p-6 text-white sm:p-8">
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-sm text-indigo-100">
          <GraduationCap size={18} />
          Your learning space
        </div>

        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{course?.title}</h1>

        <p className="mt-2 text-sm leading-6 text-indigo-100">
          {course?.description}
        </p>
      </div>

      <div className="shrink-0 rounded-xl bg-white/10 p-5 sm:min-w-44">
        <p className="text-sm text-indigo-100">Course progress</p>

        <p className="mt-1 text-3xl font-bold">{progress}%</p>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-2 text-xs text-indigo-100">
          {completedCount} of {totalLessons} lessons completed
        </p>
      </div>
    </div>
  </section>
);

export default LearningProgress;
