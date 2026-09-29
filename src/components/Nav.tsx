import { getSiteContent } from "@/lib/content";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import LocaleSwitcher from "./LocaleSwitcher";

export default async function Nav({ locale }: { locale: Locale }) {
  const [site, t] = await Promise.all([
    getSiteContent(locale),
    getDictionary(locale),
  ]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e0d3bd] bg-[#f6efe4]/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-4 sm:px-10 sm:py-5">
        <a
          href="#top"
          className="font-serif text-[26px] font-semibold tracking-[0.02em] text-[#37302a] sm:text-[30px]"
        >
          {site.name}
        </a>

        <div className="hidden gap-9 text-[13px] uppercase tracking-[0.06em] text-[#5b5044] lg:flex">
          {t.nav.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-[#c98b7e]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4 sm:gap-5">
          <LocaleSwitcher locale={locale} ariaLabel={t.localeSwitcher.ariaLabel} />
          <a
            href="#contact"
            className="rounded-full bg-[#37302a] px-5 py-2.5 text-[12px] uppercase tracking-[0.08em] text-[#f6efe4] transition-colors hover:bg-[#2e2822] sm:px-[22px] sm:py-[11px] sm:text-[13px]"
          >
            {t.nav.cta}
          </a>
        </div>
      </nav>
    </header>
  );
}
