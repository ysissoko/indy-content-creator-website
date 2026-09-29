"use client";

import { LOCALE_COOKIE, locales, pathFor, type Locale } from "@/i18n/config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LABELS: Record<Locale, string> = { fr: "FR", en: "EN" };

/**
 * FR | EN toggle. Sets the `NEXT_LOCALE` cookie (so a manual choice always
 * wins over Accept-Language detection) then navigates to the other locale's
 * URL, preserving the current #hash so the visitor stays on the same section.
 */
export default function LocaleSwitcher({
  locale,
  ariaLabel,
}: {
  locale: Locale;
  ariaLabel: string;
}) {
  const router = useRouter();
  const [pendingLocale, setPendingLocale] = useState<Locale | null>(null);

  // Writing to `document.cookie` is a side effect on a value owned outside
  // React, so it must happen in an effect rather than directly in the click
  // handler (which runs during render-adjacent event dispatch). The effect is
  // idempotent (same locale => same cookie/URL), so it's safe to skip
  // resetting `pendingLocale` back to null afterwards.
  useEffect(() => {
    if (!pendingLocale || pendingLocale === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${pendingLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.push(pathFor(pendingLocale, window.location.hash || undefined));
  }, [pendingLocale, locale, router]);

  function go(next: Locale) {
    if (next === locale) return;
    setPendingLocale(next);
  }

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex items-center gap-1 text-[12px] uppercase tracking-[0.08em] text-[#5b5044]"
    >
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden className="text-[#c6b49a]">|</span>}
          <button
            type="button"
            onClick={() => go(l)}
            aria-current={l === locale}
            className={
              l === locale
                ? "text-[#37302a]"
                : "text-[#9a8a74] transition-colors hover:text-[#c98b7e]"
            }
          >
            {LABELS[l]}
          </button>
        </span>
      ))}
    </div>
  );
}
