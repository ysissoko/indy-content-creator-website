import { getSiteContent } from "@/lib/content";
import Photo from "./Photo";

export default async function Recipes() {
  const site = await getSiteContent();
  return (
    <section id="recettes" className="bg-[#f6efe4]">
      <div className="mx-auto max-w-[1180px] px-5 pb-16 sm:px-10 md:pb-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-serif font-medium text-[#37302a] text-[clamp(32px,5vw,46px)]">
            Les dernières recettes
          </h2>
          <a
            href={site.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-[14px] uppercase tracking-[0.06em] text-[#c98b7e] transition-opacity hover:opacity-70"
          >
            Tout voir →
          </a>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {site.recipes.map((r) => {
            const card = (
              <>
                <Photo
                  src={r.image || undefined}
                  alt={r.title}
                  caption="recette"
                  className="h-[280px]"
                />
                <h3 className="mb-1 mt-4 font-serif text-[24px] font-semibold text-[#37302a]">
                  {r.title}
                </h3>
                <span className="text-[13px] tracking-[0.05em] text-[#9a8a74]">
                  {r.meta}
                </span>
              </>
            );
            return r.link ? (
              <a
                key={r.title}
                href={r.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block transition-transform hover:-translate-y-1"
              >
                {card}
              </a>
            ) : (
              <div key={r.title}>{card}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
