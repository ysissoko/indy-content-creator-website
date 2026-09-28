import { getSiteContent } from "@/lib/content";

export default async function Tarifs() {
  const site = await getSiteContent();

  return (
    <section id="tarifs" className="bg-white">
      <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-10 md:py-20">
        <span className="mb-4 block text-[13px] uppercase tracking-[0.28em] text-[#c98b7e]">
          Tarifs
        </span>
        <h2 className="mb-12 font-serif font-medium text-[#37302a] text-[clamp(30px,5vw,46px)]">
          Des formats pour chaque besoin
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {site.tarifs.map((t) => (
            <div
              key={t.title}
              className="flex flex-col rounded-[18px] bg-[#f6efe4] p-6 shadow-[0_2px_10px_rgba(55,48,42,0.06)]"
            >
              <h3 className="font-serif text-[19px] font-medium text-[#37302a]">
                {t.title}
              </h3>
              <p className="mt-2 text-[24px] font-medium text-[#c98b7e]">
                {t.price}
              </p>
              <p className="mt-1 text-[13px] uppercase tracking-[0.08em] text-[#9a8a74]">
                {t.unit}
              </p>
              <ul className="mt-4 flex flex-1 flex-col gap-2 text-[15px] leading-[1.5] text-[#5b5044]">
                {t.features.map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#c98b7e]">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-[640px] text-[14px] italic leading-[1.6] text-[#9a8a74]">
          {site.tarifsPriceNote}
        </p>

        <div className="mt-6 max-w-[640px] rounded-[14px] border border-[#e0d3bd] bg-[#f6efe4] px-5 py-4">
          <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#37302a]">
            Révisions
          </p>
          <p className="mt-1 text-[14px] leading-[1.6] text-[#5b5044]">
            {site.tarifsRevisionsNote}
          </p>
        </div>
      </div>
    </section>
  );
}
