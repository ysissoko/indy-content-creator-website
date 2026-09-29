import { getSiteContent } from "@/lib/content";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import Photo from "./Photo";

export default async function About({ locale }: { locale: Locale }) {
  const [site, t] = await Promise.all([
    getSiteContent(locale),
    getDictionary(locale),
  ]);

  return (
    <section id="apropos" className="bg-[#f6efe4]">
      <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-5 py-16 sm:px-10 md:grid-cols-[0.9fr_1.1fr] md:py-20 lg:gap-14">
        <Photo
          src={site.aboutImage || undefined}
          alt={t.about.photoAlt}
          caption={t.about.photoCaption}
          className="min-h-[320px] md:min-h-[420px]"
        />
        <div>
          <span className="text-[20px] uppercase tracking-[0.28em] text-[#c98b7e]">
            {site.texts.about.eyebrow}
          </span>
          <p className="mb-5 max-w-[520px] text-[17px] font-light leading-[1.75] text-[#5b5044]">
            {site.texts.about.paragraph1}
          </p>
          <p className="max-w-[520px] text-[17px] font-light leading-[1.75] text-[#5b5044]">
            {site.texts.about.paragraph2}
          </p>
        </div>
      </div>
    </section>
  );
}
