"use client";

import { useEffect, useRef, useState } from "react";

const AUTOPLAY_MS = 3500;
/** How long autoplay stays paused after the visitor swipes or clicks an arrow. */
const RESUME_AFTER_MS = 8000;

/**
 * Horizontal scroll-snap carousel with prev/next arrows and a gentle autoplay.
 * Autoplay pauses on hover, keyboard focus, touch, while off-screen or in a
 * background tab, and is disabled entirely with prefers-reduced-motion.
 * Arrows only appear when there is something to scroll to.
 */
/** Scrolls the track by one card: its width plus the gap between cards. */
function scrollByCard(track: HTMLElement | null, dir: 1 | -1) {
  const first = track?.firstElementChild as HTMLElement | null;
  if (!track || !first) return;
  const gap = parseFloat(getComputedStyle(track).columnGap || "0");
  track.scrollBy({ left: dir * (first.offsetWidth + gap), behavior: "smooth" });
}

export default function Carousel({ children }: { children: React.ReactNode }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const pausedUntil = useRef(0);
  const hovered = useRef(false);
  const visible = useRef(false);

  const onArrow = (dir: 1 | -1) => {
    pausedUntil.current = Date.now() + RESUME_AFTER_MS;
    scrollByCard(trackRef.current, dir);
  };

  // Keep arrow visibility in sync with the scroll position and track size.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      setCanPrev(track.scrollLeft > 4);
      setCanNext(track.scrollLeft < max - 4);
    };
    const ro = new ResizeObserver(update); // also fires once on observe
    ro.observe(track);
    track.addEventListener("scroll", update, { passive: true });
    return () => {
      ro.disconnect();
      track.removeEventListener("scroll", update);
    };
  }, []);

  // Autoplay: advance one card at a time, loop back to the start at the end.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => (visible.current = entry.isIntersecting),
      { threshold: 0.4 },
    );
    io.observe(track);

    const pause = () => (pausedUntil.current = Date.now() + RESUME_AFTER_MS);
    track.addEventListener("touchstart", pause, { passive: true });
    track.addEventListener("wheel", pause, { passive: true });

    const id = window.setInterval(() => {
      const idle =
        visible.current &&
        !hovered.current &&
        !document.hidden &&
        !track.contains(document.activeElement) &&
        Date.now() > pausedUntil.current;
      if (!idle) return;

      const max = track.scrollWidth - track.clientWidth;
      if (max <= 4) return; // everything fits — nothing to animate
      if (track.scrollLeft >= max - 4) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollByCard(track, 1);
      }
    }, AUTOPLAY_MS);

    return () => {
      window.clearInterval(id);
      io.disconnect();
      track.removeEventListener("touchstart", pause);
      track.removeEventListener("wheel", pause);
    };
  }, []);

  const arrowCls =
    "absolute top-[40%] z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#f6efe4]/95 text-[#37302a] shadow-[0_2px_10px_rgba(55,48,42,0.18)] transition-colors hover:bg-[#37302a] hover:text-[#f6efe4] sm:flex";

  return (
    <div
      className="relative"
      onMouseEnter={() => (hovered.current = true)}
      onMouseLeave={() => (hovered.current = false)}
    >
      <ul
        ref={trackRef}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 sm:mx-0 sm:px-0"
      >
        {children}
      </ul>

      {canPrev && (
        <button
          type="button"
          aria-label="Précédent"
          onClick={() => onArrow(-1)}
          className={`${arrowCls} -left-3 lg:-left-5`}
        >
          <Chevron className="rotate-180" />
        </button>
      )}
      {canNext && (
        <button
          type="button"
          aria-label="Suivant"
          onClick={() => onArrow(1)}
          className={`${arrowCls} -right-3 lg:-right-5`}
        >
          <Chevron />
        </button>
      )}
    </div>
  );
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`h-5 w-5 fill-none stroke-current stroke-2 ${className}`}
    >
      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
