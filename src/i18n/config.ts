/**
 * Core locale configuration shared by the proxy, layouts, content reader and
 * dictionaries. Single source of truth for which locales exist and how their
 * URLs are built.
 *
 * URL strategy: French is unprefixed ("/"), English lives under "/en". This
 * keeps existing French URLs and SEO signals unchanged.
 */

export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export const LOCALE_COOKIE = "NEXT_LOCALE";

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Builds the public path for a locale, optionally preserving a "#hash".
 * French has no prefix; other locales are prefixed with "/xx".
 */
export function pathFor(locale: Locale, hash?: string): string {
  const base = locale === defaultLocale ? "/" : `/${locale}`;
  return hash ? `${base}${hash}` : base;
}
