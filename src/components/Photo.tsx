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
}: {
  src?: string;
  alt: string;
  caption?: string;
  className?: string;
  rounded?: string;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${rounded} ${className}`}>
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 640px" />
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
