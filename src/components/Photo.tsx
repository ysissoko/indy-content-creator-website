import Image from "next/image";

/**
 * Shows a real photo when `src` is set, otherwise the design's diagonal-stripe
 * placeholder with a small caption — so the layout looks complete before real
 * images are added. `src` may be a /public path or a full https URL.
 */
export default function Photo({
  src,
  alt,
  caption,
  className = "",
  rounded = "rounded-xl",
  unoptimized = false,
}: {
  src?: string;
  alt: string;
  caption?: string;
  className?: string;
  rounded?: string;
  unoptimized?: boolean;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${rounded} ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized={unoptimized}
          className="object-cover"
          sizes="100vw"
        />
      </div>
    );
  }
  return (
    <div
      className={`placeholder flex items-center justify-center ${rounded} ${className}`}
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#7a6a55]">
        {caption ?? "photo"}
      </span>
    </div>
  );
}
