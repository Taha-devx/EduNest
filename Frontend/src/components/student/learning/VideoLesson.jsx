import { AlertCircle, PlayCircle } from "lucide-react";

const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);
    let videoId = "";

    if (parsedUrl.hostname.includes("youtu.be")) {
      videoId = parsedUrl.pathname.slice(1);
    } else if (parsedUrl.hostname.includes("youtube.com")) {
      if (parsedUrl.pathname === "/watch") {
        videoId = parsedUrl.searchParams.get("v");
      } else if (parsedUrl.pathname.startsWith("/embed/")) {
        videoId = parsedUrl.pathname.split("/embed/")[1];
      } else if (parsedUrl.pathname.startsWith("/shorts/")) {
        videoId = parsedUrl.pathname.split("/shorts/")[1];
      }
    }

    return videoId
      ? `https://www.youtube.com/embed/${videoId.split("?")[0]}`
      : "";
  } catch {
    return "";
  }
};

const VideoLesson = ({ lesson }) => {
  const videoEmbedUrl = getYouTubeEmbedUrl(lesson.videoUrl);

  return (
    <div>
      {videoEmbedUrl ? (
        <div className="aspect-video overflow-hidden rounded-xl bg-slate-900">
          <iframe
            src={videoEmbedUrl}
            title={lesson.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertCircle size={19} />
            <p className="text-sm font-semibold">
              Invalid or unsupported video URL
            </p>
          </div>

          <p className="mt-2 text-sm text-amber-700">
            This lesson needs a valid YouTube video URL.
          </p>
        </div>
      )}

      {lesson.videoUrl && (
        <a
          href={lesson.videoUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          <PlayCircle size={17} />
          Open video in a new tab
        </a>
      )}
    </div>
  );
};

export default VideoLesson;
