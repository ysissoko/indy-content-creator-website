import { getSiteContent } from "@/lib/content";
import Image from "next/image";

export default async function Testimonials() {
  const site = await getSiteContent();

  return (
    <section id="avis" className="bg-[#f6efe4]">
      <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-10 md:py-20">
        <h2 className="mb-12 text-center font-serif font-medium text-[#37302a] text-[clamp(30px,5vw,46px)]">
          Ils m&apos;ont fait confiance
        </h2>
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="mb-6 flex min-h-[2.5em] items-end text-[13px] uppercase tracking-[0.28em] text-[#c98b7e]">
              Marques partenaires
            </span>
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {site.partners.map((p) => (
                <div
                  key={p.name}
                  className="flex h-36 items-center justify-center rounded-[14px] bg-white px-6 shadow-[0_1px_3px_rgba(55,48,42,0.06)] sm:h-40"
                >
                  {p.logo ? (
                    <Image
                      src={p.logo}
                      alt={p.name}
                      width={280}
                      height={160}
                      className="max-h-24 w-auto object-contain sm:max-h-28"
                    />
                  ) : (
                    <span className="text-center font-mono text-[13px] uppercase text-[#9a8a74]">
                      {p.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-6 flex min-h-[2.5em] items-end text-[13px] uppercase tracking-[0.28em] text-[#c98b7e]">
              Ce qu&apos;ils disent de nos collaborations
            </span>
            <div className="grid gap-6 sm:grid-cols-2">
              {site.testimonials.map((t, i) => {
                const messages = t.quote
                  .split("\n")
                  .map((m) => m.trim())
                  .filter(Boolean);
                return (
                  <figure
                    key={`${t.name}-${i}`}
                    className="flex flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_2px_10px_rgba(55,48,42,0.06)]"
                  >
                    {/* En-tête du DM */}
                    <figcaption className="flex items-center gap-3 border-b border-[#f0ece4] px-4 py-3">
                      {t.avatar ? (
                        <Image
                          src={t.avatar}
                          alt={t.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="placeholder h-10 w-10 rounded-full" />
                      )}
                      <span className="min-w-0">
                        <span className="block truncate text-[15px] font-medium text-[#1c1c1e]">
                          {t.name}
                        </span>
                        <span className="block truncate text-[12px] text-[#9a8a74]">
                          {t.role}
                        </span>
                      </span>
                    </figcaption>

                    {/* Fil de discussion */}
                    <blockquote className="flex flex-1 flex-col items-start gap-1.5 px-4 py-4">
                      {messages.map((m, j) => (
                        <span
                          key={j}
                          className="w-fit max-w-[85%] rounded-[20px] bg-[#efefef] px-4 py-2 text-left font-sans text-[15px] leading-[1.4] text-[#1c1c1e]"
                        >
                          {m}
                        </span>
                      ))}
                      <span className="mt-1 self-end text-[11px] text-[#b3a89a]">
                        il y a 2 j
                      </span>
                    </blockquote>
                  </figure>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
