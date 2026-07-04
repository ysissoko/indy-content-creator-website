import Image from "next/image";
import { getSiteContent } from "@/lib/content";

export default async function Partners() {
  const site = await getSiteContent();
  return (
    <section id="marques" className="bg-[#f6efe4]">
      <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-10 md:py-[70px]">
        <div className="mb-11 text-center">
          <span className="text-[13px] uppercase tracking-[0.28em] text-[#c98b7e]">
            Ils m&apos;ont fait confiance
          </span>
          <h2 className="mt-4 font-serif font-medium text-[#37302a] text-[clamp(32px,5vw,46px)]">
            Marques partenaires
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {site.partners.map((p) => (
            <div
              key={p.name}
              className="flex h-20 items-center justify-center rounded-[10px] border border-[#d8c7ae] px-4"
            >
              {p.logo ? (
                <Image
                  src={p.logo}
                  alt={p.name}
                  width={120}
                  height={48}
                  className="max-h-12 w-auto object-contain"
                />
              ) : (
                <span className="font-mono text-[11px] uppercase text-[#9a8a74]">
                  {p.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
