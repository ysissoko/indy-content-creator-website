import Photo from "./Photo";

/**
 * A phone-shaped outline frame (no realistic device body): a thin rounded border
 * with a vertical (9:19.5) screen inside. The screen reuses <Photo>, so a missing
 * `src` falls back to the striped placeholder — the frame still looks intentional
 * before real thumbnails exist.
 */
export default function PhoneFrame({
  src,
  alt,
  caption,
}: {
  src?: string;
  alt: string;
  caption?: string;
}) {
  return (
    <div className="w-[190px] shrink-0 rounded-[2.4rem] border-2 border-[#37302a] sm:w-[218px]">
      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.1rem]">
        <Photo
          src={src}
          alt={alt}
          caption={caption}
          rounded="rounded-none"
          className="h-full w-full"
        />
        {/* Play button — revealed on hover of the surrounding group (the link). */}
        <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/25 group-hover:opacity-100">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="ml-[3px] h-6 w-6 fill-[#37302a]"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </div>
    </div>
  );
}
