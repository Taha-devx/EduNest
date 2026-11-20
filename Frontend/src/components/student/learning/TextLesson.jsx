const TextLesson = ({ lesson }) => (
  <article className="prose prose-slate max-w-none whitespace-pre-wrap text-sm leading-7">
    {lesson.content || "No lesson content is available."}
  </article>
);

export default TextLesson;
