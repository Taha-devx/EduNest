
import { AlertCircle, ExternalLink } from "lucide-react";

const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace(/^www\./, "");
    let videoId = "";

    if (hostname === "youtu.be") {
      videoId = parsedUrl.pathname.split("/").filter(Boolean)[0];
    } else if (
      ["youtube.com", "m.youtube.com", "music.youtube.com"].includes(hostname)
    ) {
      if (parsedUrl.pathname === "/watch") {
        videoId = parsedUrl.searchParams.get("v");
      } else {
        const match = parsedUrl.pathname.match(
          /^\/(?:embed|shorts|live)\/([^/?]+)/
        );
        videoId = match?.[1] || "";
      }
    }

    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId || "")) {
      return "";
    }

    return `https://www.youtube-nocookie.com/embed/${videoId}`;
  } catch {
    return "";
  }
};

const getDirectVideoUrl = (url) => {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return "";
    }

    return /\.(mp4|webm|ogg)$/i.test(parsedUrl.pathname) ? url : "";
  } catch {
    return "";
  }
};

const VideoLesson = ({ lesson }) => {
  const videoUrl = lesson.videoUrl?.trim();

  const videoEmbedUrl = getYouTubeEmbedUrl(videoUrl);
  const directVideoUrl = getDirectVideoUrl(videoUrl);

  return (
    <div>
      {videoEmbedUrl ? (
        <div className="aspect-video overflow-hidden rounded-xl bg-slate-950">
          <iframe
            src={videoEmbedUrl}
            title={lesson.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      ) : directVideoUrl ? (
        <div className="overflow-hidden rounded-xl bg-slate-950">
          <video
            key={directVideoUrl}
            src={directVideoUrl}
            controls
            playsInline
            preload="metadata"
            className="aspect-video w-full"
          >
            Your browser does not support HTML video.
          </video>
        </div>
      ) : (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertCircle size={19} />
            <p className="text-sm font-semibold">
              Unsupported video URL
            </p>
          </div>

          <p className="mt-2 text-sm text-amber-700">
            Use a YouTube video link or a direct MP4, WebM, or OGG video URL.
          </p>
        </div>
      )}

      {videoUrl && (
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          <ExternalLink size={16} />
          Open video in a new tab
        </a>
      )}
    </div>
  );
};

export default VideoLesson;
