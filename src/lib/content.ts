import { defaults, defaultsEn, type Site, type SiteTexts } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { createReader } from "@keystatic/core/reader";
import { cache } from "react";
import "server-only";
import keystaticConfig from "../../keystatic.config";

const reader = createReader(process.cwd(), keystaticConfig);

/** Turn a Keystatic image field (path string | null) into "" for <Photo>. */
const img = (v: string | null | undefined) => v ?? "";

/**
 * Resolves a bilingual CMS field for one locale, following the fallback
 * chain: CMS current-locale → CMS French → built-in default. This means an
 * English field left empty in Keystatic silently falls back to French rather
 * than rendering blank.
 */
function pick(
  locale: Locale,
  fr: string | null | undefined,
  en: string | null | undefined,
  fallback: string,
): string {
  if (locale === "en") return en || fr || fallback;
  return fr || fallback;
}

/**
 * Reads all editable content from the Keystatic CMS (content/**) and returns
 * it in the shape the components expect (`Site`), fully resolved for one
 * locale. Any field the CMS hasn't set falls back to the built-in defaults,
 * so the page never renders empty in either language.
 *
 * Wrapped in React `cache()` so multiple server components in one request
 * (for the same locale) share a single read.
 */
export const getSiteContent = cache(async (locale: Locale): Promise<Site> => {
  const base = locale === "en" ? defaultsEn : defaults;

  const [settings, texts, collaborations, feed, partners, testimonials, tarifs] =
    await Promise.all([
      reader.singletons.settings.read(),
      reader.singletons.texts.read(),
      reader.singletons.collaborations.read(),
      reader.singletons.feed.read(),
      reader.singletons.partners.read(),
      reader.singletons.testimonials.read(),
      reader.singletons.tarifs.read(),
    ]);

  const p = (fr: string | null | undefined, en: string | null | undefined, fallback: string) =>
    pick(locale, fr, en, fallback);

  return {
    name: settings?.name || base.name,
    tagline: p(settings?.tagline, settings?.taglineEn, base.tagline),
    domainLabel: settings?.domainLabel || base.domainLabel,
    seoDescription: p(
      settings?.seoDescription,
      settings?.seoDescriptionEn,
      base.seoDescription,
    ),
    contactEmail: settings?.contactEmail || base.contactEmail,

    socials: settings?.socials
      ? {
          instagram: settings.socials.instagram || base.socials.instagram,
          tiktok: settings.socials.tiktok || base.socials.tiktok,
          snapchat: settings.socials.snapchat || base.socials.snapchat,
        }
      : base.socials,

    heroImage: img(settings?.heroImage) || base.heroImage,
    aboutImage: img(settings?.aboutImage) || base.aboutImage,

    stats:
      settings?.stats && settings.stats.length > 0
        ? settings.stats.map((s, i) => ({
            value: s.value ?? 0,
            label: p(s.label, s.labelEn, base.stats[i]?.label ?? s.label),
            key: (s.key || undefined) as Site["stats"][number]["key"],
            suffix: s.suffix || undefined,
          }))
        : base.stats,

    collaborations:
      collaborations?.items && collaborations.items.length > 0
        ? collaborations.items.map((c) => ({
            category: c.category,
            image: img(c.image),
            title: p(c.title, c.titleEn, c.title),
            meta: p(c.meta, c.metaEn, c.meta),
            link: c.link || undefined,
          }))
        : base.collaborations,

    feed:
      feed?.items && feed.items.length > 0
        ? feed.items.map((f) => ({
            image: img(f.image),
            link: f.link || "",
            alt: p(f.alt, f.altEn, f.alt),
          }))
        : base.feed,

    partners:
      partners?.items && partners.items.length > 0
        ? partners.items.map((p2) => ({ name: p2.name, logo: img(p2.logo) }))
        : base.partners,

    testimonials:
      testimonials?.items && testimonials.items.length > 0
        ? testimonials.items.map((t) => ({
            quote: t.quote,
            name: t.name,
            role: t.role,
            avatar: img(t.avatar) || undefined,
          }))
        : base.testimonials,

    tarifs:
      tarifs?.items && tarifs.items.length > 0
        ? tarifs.items.map((t) => ({
            title: p(t.title, t.titleEn, t.title),
            price: p(t.price, t.priceEn, t.price),
            unit: p(t.unit, t.unitEn, t.unit),
            features: t.features
              ? t.features.map((f) => p(f.text, f.textEn, f.text))
              : [],
          }))
        : base.tarifs,
    tarifsPriceNote: p(tarifs?.priceNote, tarifs?.priceNoteEn, base.tarifsPriceNote),
    tarifsRevisionsNote: p(
      tarifs?.revisionsNote,
      tarifs?.revisionsNoteEn,
      base.tarifsRevisionsNote,
    ),

    texts: resolveTexts(locale, texts, base.texts),
  };
});

/** Resolves the "texts" singleton (editorial copy) into one locale. */
function resolveTexts(
  locale: Locale,
  texts: Awaited<ReturnType<typeof reader.singletons.texts.read>>,
  base: SiteTexts,
): SiteTexts {
  const p = (fr: string | null | undefined, en: string | null | undefined, fallback: string) =>
    pick(locale, fr, en, fallback);

  return {
    hero: {
      headline: p(texts?.hero.headline, texts?.hero.headlineEn, base.hero.headline),
      intro: p(texts?.hero.intro, texts?.hero.introEn, base.hero.intro),
    },
    about: {
      eyebrow: p(texts?.about.eyebrow, texts?.about.eyebrowEn, base.about.eyebrow),
      paragraph1: p(
        texts?.about.paragraph1,
        texts?.about.paragraph1En,
        base.about.paragraph1,
      ),
      paragraph2: p(
        texts?.about.paragraph2,
        texts?.about.paragraph2En,
        base.about.paragraph2,
      ),
    },
    collabFood: {
      eyebrow: p(
        texts?.collabFood.eyebrow,
        texts?.collabFood.eyebrowEn,
        base.collabFood.eyebrow,
      ),
      title: p(texts?.collabFood.title, texts?.collabFood.titleEn, base.collabFood.title),
    },
    collabRestaurant: {
      eyebrow: p(
        texts?.collabRestaurant.eyebrow,
        texts?.collabRestaurant.eyebrowEn,
        base.collabRestaurant.eyebrow,
      ),
      title: p(
        texts?.collabRestaurant.title,
        texts?.collabRestaurant.titleEn,
        base.collabRestaurant.title,
      ),
    },
    feed: {
      eyebrow: p(texts?.feed.eyebrow, texts?.feed.eyebrowEn, base.feed.eyebrow),
      title: p(texts?.feed.title, texts?.feed.titleEn, base.feed.title),
    },
    testimonials: {
      heading: p(
        texts?.testimonials.heading,
        texts?.testimonials.headingEn,
        base.testimonials.heading,
      ),
      partnersLabel: p(
        texts?.testimonials.partnersLabel,
        texts?.testimonials.partnersLabelEn,
        base.testimonials.partnersLabel,
      ),
      testimonialsLabel: p(
        texts?.testimonials.testimonialsLabel,
        texts?.testimonials.testimonialsLabelEn,
        base.testimonials.testimonialsLabel,
      ),
    },
    tarifs: {
      eyebrow: p(texts?.tarifs.eyebrow, texts?.tarifs.eyebrowEn, base.tarifs.eyebrow),
      title: p(texts?.tarifs.title, texts?.tarifs.titleEn, base.tarifs.title),
      revisionsLabel: p(
        texts?.tarifs.revisionsLabel,
        texts?.tarifs.revisionsLabelEn,
        base.tarifs.revisionsLabel,
      ),
    },
    contact: {
      eyebrow: p(texts?.contact.eyebrow, texts?.contact.eyebrowEn, base.contact.eyebrow),
      title: p(texts?.contact.title, texts?.contact.titleEn, base.contact.title),
      intro: p(texts?.contact.intro, texts?.contact.introEn, base.contact.intro),
    },
  };
}
