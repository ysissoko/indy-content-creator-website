import type { CollabCategory, Collaboration } from "@/config/site";
import { getSiteContent } from "@/lib/content";
import PhoneFrame from "./PhoneFrame";

/** Section metadata for each collaboration category, in display order. */
const CATEGORIES: {
  key: CollabCategory;
  id: string;
  eyebrow: string;
  title: string;
  bg: string;
}[] = [
  {
    key: "food",
    id: "collaborations",
    eyebrow: "mes collaborations",
    title: "Recettes",
    bg: "bg-[#f6efe4]",
  },
  {
    key: "restaurant",
    id: "avis-restaurants",
    eyebrow: "Revue de restaurants",
    title: "Dégustation et avis",
    bg: "bg-[#efe6d8]",
  },
];

function PhoneCard({ item }: { item: Collaboration }) {
  const frame = (
    <PhoneFrame src={item.image || undefined} alt={item.title} caption="reel" />
  );
  return (
    <li className="snap-start">
      {item.link ? (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
        >
          {frame}
          <Caption item={item} />
        </a>
      ) : (
        <div>
          {frame}
          <Caption item={item} />
        </div>
      )}
    </li>
  );
}

function Caption({ item }: { item: Collaboration }) {
  return (
    <div className="mt-4 w-[190px] sm:w-[218px]">
      <h3 className="font-serif text-[20px] font-semibold leading-tight text-[#37302a]">
        {item.title}
      </h3>
      <span className="text-[13px] tracking-[0.05em] text-[#9a8a74]">
        {item.meta}
      </span>
    </div>
  );
}

export default async function Collaborations() {
  const site = await getSiteContent();

  return (
    <>
      {CATEGORIES.map((cat) => {
        const items = site.collaborations.filter((c) => c.category === cat.key);
        if (items.length === 0) return null;

        return (
          <section key={cat.key} id={cat.id} className={cat.bg}>
            <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-10 md:py-20">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="font-serif font-medium uppercase text-[#37302a] text-[clamp(32px,5vw,46px)]">
                    {cat.eyebrow}
                  </h2>
                  <span className="mt-2 block text-[13px] uppercase tracking-[0.28em] text-[#c98b7e]">
                    {cat.title}
                  </span>
                </div>
                <a
                  href={site.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-[14px] uppercase tracking-[0.06em] text-[#c98b7e] transition-opacity hover:opacity-70"
                >
                  Tout voir →
                </a>
              </div>

              <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 sm:mx-0 sm:px-0">
                {items.map((item) => (
                  <PhoneCard key={item.title} item={item} />
                ))}
              </ul>
            </div>
          </section>
        );
      })}
    </>
  );
}
