import { type SocialKey } from "@/config/site";
import { getSiteContent } from "@/lib/content";
import CountUp from "./CountUp";

export default async function StatsBar() {
  const site = await getSiteContent();

  /** Maps a stat label to a social link when one exists, so the tile is clickable. */
  const linkFor = (label: string): string | undefined => {
    const key = label.toLowerCase() as SocialKey;
    return (site.socials as Record<string, string>)[key];
  };

  return (
    <section className="bg-[#37302a]">
      <div className="mx-auto grid max-w-[1180px] grid-cols-2 gap-6 px-5 py-11 sm:px-10 md:grid-cols-4">
        {site.stats.map((s) => {
          const href = linkFor(s.label);
          const inner = (
            <>
              <div className="font-serif text-[clamp(36px,6vw,44px)] leading-none text-[#f6efe4]">
                <CountUp value={s.value} />
                {s.suffix}
              </div>
              <div className="mt-2 text-[13px] uppercase tracking-[0.1em] text-[#c98b7e]">
                {s.label}
              </div>
            </>
          );
          return href ? (
            <a
              key={s.label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group transition-opacity hover:opacity-80"
            >
              {inner}
            </a>
          ) : (
            <div key={s.label}>{inner}</div>
          );
        })}
      </div>
    </section>
  );
}
