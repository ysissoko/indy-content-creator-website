import type { MetadataRoute } from "next";
import { locales, pathFor } from "@/i18n/config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://indyslife.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    locales.map((l) => [l, `${SITE_URL}${pathFor(l)}`]),
  );

  return locales.map((locale) => ({
    url: `${SITE_URL}${pathFor(locale)}`,
    lastModified: new Date(),
    alternates: { languages },
  }));
}
