import "server-only";
import { cache } from "react";
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";
import { defaults, type Site } from "@/config/site";

const reader = createReader(process.cwd(), keystaticConfig);

/** Turn a Keystatic image field (path string | null) into "" for <Photo>. */
const img = (v: string | null | undefined) => v ?? "";

/**
 * Reads all editable content from the Keystatic CMS (content/**) and returns it
 * in the shape the components expect (`Site`). Any field the CMS hasn't set
 * falls back to the built-in defaults, so the page never renders empty.
 *
 * Wrapped in React `cache()` so multiple server components in one request share
 * a single read.
 */
export const getSiteContent = cache(async (): Promise<Site> => {
  const [settings, recipes, feed, partners, testimonials] = await Promise.all([
    reader.singletons.settings.read(),
    reader.singletons.recipes.read(),
    reader.singletons.feed.read(),
    reader.singletons.partners.read(),
    reader.singletons.testimonials.read(),
  ]);

  return {
    name: settings?.name || defaults.name,
    tagline: settings?.tagline || defaults.tagline,
    domainLabel: settings?.domainLabel || defaults.domainLabel,
    seoDescription: settings?.seoDescription || defaults.seoDescription,
    contactEmail: settings?.contactEmail || defaults.contactEmail,

    socials: settings?.socials
      ? {
          instagram: settings.socials.instagram || defaults.socials.instagram,
          tiktok: settings.socials.tiktok || defaults.socials.tiktok,
          snapchat: settings.socials.snapchat || defaults.socials.snapchat,
        }
      : defaults.socials,

    heroImage: img(settings?.heroImage) || defaults.heroImage,
    aboutImage: img(settings?.aboutImage) || defaults.aboutImage,

    heroBadge: settings?.heroBadge
      ? {
          value: settings.heroBadge.value ?? defaults.heroBadge.value,
          label: settings.heroBadge.label || defaults.heroBadge.label,
        }
      : defaults.heroBadge,

    stats:
      settings?.stats && settings.stats.length > 0
        ? settings.stats.map((s) => ({
            value: s.value ?? 0,
            label: s.label,
            suffix: s.suffix || undefined,
          }))
        : defaults.stats,

    recipes:
      recipes?.items && recipes.items.length > 0
        ? recipes.items.map((r) => ({
            image: img(r.image),
            title: r.title,
            meta: r.meta,
            link: r.link || undefined,
          }))
        : defaults.recipes,

    feed:
      feed?.items && feed.items.length > 0
        ? feed.items.map((f) => ({
            image: img(f.image),
            link: f.link || "",
            alt: f.alt,
          }))
        : defaults.feed,

    partners:
      partners?.items && partners.items.length > 0
        ? partners.items.map((p) => ({ name: p.name, logo: img(p.logo) }))
        : defaults.partners,

    testimonials:
      testimonials?.items && testimonials.items.length > 0
        ? testimonials.items.map((t) => ({
            quote: t.quote,
            name: t.name,
            role: t.role,
            avatar: img(t.avatar) || undefined,
          }))
        : defaults.testimonials,
  };
});
