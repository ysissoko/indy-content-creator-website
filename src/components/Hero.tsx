import { getSiteContent } from "@/lib/content";
import { formatCount } from "@/lib/format";
import Photo from "./Photo";

export default async function Hero() {
  const site = await getSiteContent();
  return (
    <section id="top" className="bg-[#f6efe4]">
      <div className="mx-auto grid max-w-[1180px] items-stretch gap-0 md:grid-cols-[1.05fr_0.95fr]">
        {/* Text */}
        <div className="flex flex-col justify-center px-5 py-14 sm:px-10 md:py-20">
          <span className="mb-6 text-[13px] uppercase tracking-[0.28em] text-[#c98b7e]">
            {site.tagline}
          </span>
          <h1 className="font-serif font-medium leading-[0.98] tracking-[-0.01em] text-[#37302a] text-[clamp(48px,8vw,82px)]">
            La cuisine,
            <br />
            <span className="italic text-[#c98b7e]">racontée</span> avec
            <br />
            gourmandise.
          </h1>
          <p className="mt-8 mb-9 max-w-[400px] text-[17px] font-light leading-[1.7] text-[#5b5044]">
            Recettes, mises en scène et vidéos qui donnent faim. Suivie par une
            communauté fidèle sur Instagram, TikTok et Snapchat.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#recettes"
              className="rounded-full bg-[#37302a] px-[30px] py-[15px] text-[14px] uppercase tracking-[0.06em] text-[#f6efe4] transition-colors hover:bg-[#2e2822]"
            >
              Voir les recettes
            </a>
            <a
              href={site.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#c6b49a] px-[30px] py-[14px] text-[14px] uppercase tracking-[0.06em] text-[#37302a] transition-colors hover:border-[#c98b7e] hover:text-[#c98b7e]"
            >
              Me suivre
            </a>
          </div>
        </div>

        {/* Photo */}
        <div className="relative min-h-[360px] md:min-h-[560px]">
          <Photo
            src={site.heroImage || undefined}
            alt="Portrait d'Indy, créatrice de contenu food"
            caption="portrait / photo hero"
            rounded="rounded-none"
            className="absolute inset-0 h-full w-full"
          />
          <div className="absolute bottom-8 left-5 rounded-xl bg-[#f6efe4] px-6 py-5 shadow-[0_18px_40px_-20px_rgba(58,48,40,.5)] sm:left-8">
            <div className="font-serif text-[34px] font-semibold leading-none text-[#37302a]">
              {formatCount(site.heroBadge.value)}
            </div>
            <div className="mt-1 text-[12px] uppercase tracking-[0.1em] text-[#9a8a74]">
              {site.heroBadge.label}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
