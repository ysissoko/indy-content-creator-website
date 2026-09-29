import type { CollabCategory, Collaboration, Site } from "@/config/site";
import { getSiteContent } from "@/lib/content";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import Carousel from "./Carousel";
import PhoneFrame from "./PhoneFrame";

/** Section metadata for each collaboration category, in display order. */
const CATEGORIES: {
  key: CollabCategory;
  id: string;
  bg: string;
  texts: (site: Site) => { eyebrow: string; title: string };
}[] = [
  {
    key: "food",
    id: "collaborations",
    bg: "bg-[#f6efe4]",
    texts: (site) => site.texts.collabFood,
  },
  {
    key: "restaurant",
    id: "avis-restaurants",
    bg: "bg-[#efe6d8]",
    texts: (site) => site.texts.collabRestaurant,
  },
];

function PhoneCard({
  item,
  reelCaption,
}: {
  item: Collaboration;
  reelCaption: string;
}) {
  const frame = (
    <PhoneFrame src={item.image || undefined} alt={item.title} caption={reelCaption} />
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

export default async function Collaborations({ locale }: { locale: Locale }) {
  const [site, t] = await Promise.all([
    getSiteContent(locale),
    getDictionary(locale),
  ]);

  return (
    <>
      {CATEGORIES.map((cat) => {
        const items = site.collaborations.filter((c) => c.category === cat.key);
        if (items.length === 0) return null;
        const { eyebrow, title } = cat.texts(site);

        return (
          <section key={cat.key} id={cat.id} className={cat.bg}>
            <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-10 md:py-20">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="font-serif font-medium uppercase text-[#37302a] text-[clamp(32px,5vw,46px)]">
                    {eyebrow}
                  </h2>
                  <span className="mt-2 block text-[13px] uppercase tracking-[0.28em] text-[#c98b7e]">
                    {title}
                  </span>
                </div>
                <a
                  href={site.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-[14px] uppercase tracking-[0.06em] text-[#c98b7e] transition-opacity hover:opacity-70"
                >
                  {t.collaborations.seeAll}
                </a>
              </div>

              <Carousel>
                {items.map((item, i) => (
                  <PhoneCard
                    key={`${item.link ?? item.title}-${i}`}
                    item={item}
                    reelCaption={t.collaborations.reelCaption}
                  />
                ))}
              </Carousel>
            </div>
          </section>
        );
      })}
    </>
  );
}
