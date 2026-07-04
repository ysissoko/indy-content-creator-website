import Image from "next/image";
import { getSiteContent } from "@/lib/content";

export default async function Testimonials() {
  const site = await getSiteContent();
  return (
    <section id="avis" className="bg-[#f6efe4]">
      <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-10 md:py-20">
        <h2 className="mb-10 text-center font-serif font-medium text-[#37302a] text-[clamp(30px,5vw,46px)]">
          Ce qu&apos;elles disent de nos collaborations
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {site.testimonials.map((t) => (
            <figure
              key={t.name}
              className="rounded-[14px] bg-[#efe6d8] px-[30px] py-[34px]"
            >
              <div className="font-serif text-[56px] leading-[0.4] text-[#c98b7e]">
                &ldquo;
              </div>
              <blockquote className="mb-6 mt-[14px] font-serif text-[22px] italic leading-[1.5] text-[#37302a]">
                {t.quote}
              </blockquote>
              <figcaption className="flex items-center gap-3">
                {t.avatar ? (
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <span className="placeholder h-11 w-11 rounded-full" />
                )}
                <span>
                  <span className="block text-[15px] font-medium text-[#37302a]">
                    {t.name}
                  </span>
                  <span className="block text-[13px] text-[#9a8a74]">
                    {t.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
