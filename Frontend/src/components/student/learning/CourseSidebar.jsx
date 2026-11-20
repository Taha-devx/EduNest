import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  FileText,
  Trophy,
  Video,
} from "lucide-react";

const CourseSidebar = ({
  sections,
  expandedSections,
  selectedLesson,
  completedLessons,
  totalLessons,
  onToggleSection,
  onSelectLesson,
}) => (
  <aside className="overflow-hidden rounded-xl border border-slate-200 bg-white">
    <div className="border-b border-slate-200 p-5">
      <h2 className="font-bold text-slate-900">Course content</h2>

      <p className="mt-1 text-sm text-slate-500">
        {sections.length} sections · {totalLessons} lessons
      </p>
    </div>

    {sections.length === 0 ? (
      <div className="p-6 text-center">
        <BookOpen size={30} className="mx-auto text-slate-300" />
        <p className="mt-3 text-sm text-slate-500">
          No course content is available yet.
        </p>
      </div>
    ) : (
      <div className="divide-y divide-slate-100">
        {sections.map((section, sectionIndex) => {
          const isExpanded = expandedSections[section._id];
          const sectionLessons = section.lessons || [];
          const sectionCompleted = sectionLessons.filter((lesson) =>
            completedLessons.includes(lesson._id),
          ).length;

          return (
            <div key={section._id}>
              <button
                onClick={() => onToggleSection(section._id)}
                className="flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium text-indigo-600">
                    Section {sectionIndex + 1}
                  </p>

                  <h3 className="mt-1 font-semibold text-slate-900">
                    {section.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {sectionCompleted}/{sectionLessons.length} completed
                  </p>
                </div>

                {isExpanded ? (
                  <ChevronDown
                    size={18}
                    className="shrink-0 text-slate-400"
                  />
                ) : (
                  <ChevronRight
                    size={18}
                    className="shrink-0 text-slate-400"
                  />
                )}
              </button>

              {isExpanded && (
                <div className="space-y-1 bg-slate-50 p-2">
                  {sectionLessons.map((lesson) => {
                    const isSelected = selectedLesson?._id === lesson._id;
                    const isCompleted = completedLessons.includes(lesson._id);
                    const LessonIcon =
                      lesson.type === "video"
                        ? Video
                        : lesson.type === "quiz"
                          ? Trophy
                          : FileText;

                    return (
                      <button
                        key={lesson._id}
                        onClick={() => onSelectLesson(lesson)}
                        className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition ${
                          isSelected
                            ? "bg-indigo-100 text-indigo-800"
                            : "text-slate-600 hover:bg-white"
                        }`}
                      >
                        <div className="shrink-0">
                          {isCompleted ? (
                            <CheckCircle2
                              size={19}
                              className="text-green-600"
                            />
                          ) : (
                            <LessonIcon
                              size={19}
                              className={
                                isSelected
                                  ? "text-indigo-600"
                                  : "text-slate-400"
                              }
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {lesson.title}
                          </p>

                          <p className="mt-0.5 text-xs capitalize opacity-70">
                            {lesson.type} lesson
                          </p>
                        </div>

                        {isSelected && (
                          <Circle
                            size={9}
                            className="shrink-0 fill-indigo-600 text-indigo-600"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    )}
  </aside>
);

export default CourseSidebar;
