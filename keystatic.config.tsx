import { config, fields, singleton } from "@keystatic/core";

/**
 * Keystatic CMS schema — mirrors the shape of src/config/site.ts.
 *
 * Storage:
 *  - dev  → "local": the editor at /keystatic writes files directly on disk.
 *  - prod → "github": edits are committed to the repo (Vercel then redeploys).
 *           Set NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO="owner/name" and complete the
 *           one-time GitHub App setup at /keystatic (see README).
 *
 * i18n:
 *  - The site is bilingual (FR/EN). FR fields are required; their `*En`
 *    siblings are optional — when left empty the site falls back to the FR
 *    value, so English never renders empty.
 *  - `bilingual()` below generates a `{ key, keyEn }` field pair to keep this
 *    consistent everywhere.
 */
const githubRepo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO;

const image = (dir: string) =>
  fields.image({
    label: "Photo",
    directory: `public/images/${dir}`,
    publicPath: `/images/${dir}`,
  });

const optionalUrl = fields.url({
  label: "Lien (optionnel)",
  validation: { isRequired: false },
});

/**
 * Generates `{ [key]: fields.text(fr), [key+"En"]: fields.text(en, optional) }`.
 * Generic over the literal key so downstream field access (itemLabel, the
 * Keystatic reader in src/lib/content.ts) stays fully typed instead of
 * collapsing to `Record<string, ...>`.
 */
function bilingual<K extends string>(
  key: K,
  labelFr: string,
  opts: { multiline?: boolean } = {},
): Record<K, ReturnType<typeof fields.text>> &
  Record<`${K}En`, ReturnType<typeof fields.text>> {
  return {
    [key]: fields.text({ label: labelFr, multiline: opts.multiline }),
    [`${key}En`]: fields.text({
      label: `${labelFr} (EN)`,
      multiline: opts.multiline,
      validation: { isRequired: false },
    }),
  } as Record<K, ReturnType<typeof fields.text>> &
    Record<`${K}En`, ReturnType<typeof fields.text>>;
}

export default config({
  storage:
    process.env.NODE_ENV === "production" && githubRepo
      ? { kind: "github", repo: githubRepo as `${string}/${string}` }
      : { kind: "local" },

  ui: {
    brand: { name: "Indy — Contenu" },
    navigation: {
      Général: ["settings", "texts"],
      Contenu: ["collaborations", "feed", "partners", "testimonials", "tarifs"],
    },
  },

  singletons: {
    // ── Réglages généraux : identité, réseaux, contact, hero, chiffres ──────
    settings: singleton({
      label: "Réglages généraux",
      path: "content/settings/index",
      format: { data: "json" },
      schema: {
        name: fields.text({ label: "Nom" }),
        ...bilingual("tagline", "Sous-titre / métier"),
        domainLabel: fields.text({ label: "Domaine affiché (ex: indy.food)" }),
        ...bilingual("seoDescription", "Description SEO", { multiline: true }),
        contactEmail: fields.text({ label: "Email de contact" }),
        socials: fields.object(
          {
            instagram: fields.url({ label: "Instagram" }),
            tiktok: fields.url({ label: "TikTok" }),
            snapchat: fields.url({ label: "Snapchat" }),
          },
          { label: "Réseaux sociaux" },
        ),
        heroImage: image("hero"),
        aboutImage: image("about"),
        stats: fields.array(
          fields.object({
            value: fields.integer({ label: "Nombre" }),
            label: fields.text({ label: "Libellé (ex: Instagram)" }),
            labelEn: fields.text({
              label: "Libellé (EN)",
              validation: { isRequired: false },
            }),
            // Stable link target, independent of the translated label text.
            key: fields.select({
              label: "Lien associé",
              defaultValue: "",
              options: [
                { label: "Aucun", value: "" },
                { label: "Instagram", value: "instagram" },
                { label: "TikTok", value: "tiktok" },
                { label: "Snapchat", value: "snapchat" },
              ],
            }),
            suffix: fields.text({
              label: "Suffixe (optionnel)",
              validation: { isRequired: false },
            }),
          }),
          {
            label: "Statistiques (réseaux / vues)",
            itemLabel: (p) => p.fields.label.value || "Statistique",
          },
        ),
      },
    }),

    // ── Textes du site (copy éditoriale bilingue hors CMS structuré) ────────
    texts: singleton({
      label: "Textes du site",
      path: "content/texts/index",
      format: { data: "json" },
      schema: {
        hero: fields.object(
          {
            ...bilingual("headline", "Titre principal (accent entre { })", {
              multiline: true,
            }),
            ...bilingual("intro", "Paragraphe d'introduction", {
              multiline: true,
            }),
          },
          { label: "Hero" },
        ),
        about: fields.object(
          {
            ...bilingual("eyebrow", "Sur-titre"),
            ...bilingual("paragraph1", "Paragraphe 1", { multiline: true }),
            ...bilingual("paragraph2", "Paragraphe 2", { multiline: true }),
          },
          { label: "À propos" },
        ),
        collabFood: fields.object(
          {
            ...bilingual("eyebrow", "Sur-titre"),
            ...bilingual("title", "Titre"),
          },
          { label: "Section Collaborations (food)" },
        ),
        collabRestaurant: fields.object(
          {
            ...bilingual("eyebrow", "Sur-titre"),
            ...bilingual("title", "Titre"),
          },
          { label: "Section Restaurants" },
        ),
        feed: fields.object(
          {
            ...bilingual("eyebrow", "Sur-titre"),
            ...bilingual("title", "Titre"),
          },
          { label: "Section Feed Instagram" },
        ),
        testimonials: fields.object(
          {
            ...bilingual("heading", "Titre de section"),
            ...bilingual("partnersLabel", "Libellé « Marques partenaires »"),
            ...bilingual(
              "testimonialsLabel",
              "Libellé « Ce qu'ils disent... »",
            ),
          },
          { label: "Section Avis" },
        ),
        tarifs: fields.object(
          {
            ...bilingual("eyebrow", "Sur-titre"),
            ...bilingual("title", "Titre"),
            ...bilingual("revisionsLabel", "Libellé « Révisions »"),
          },
          { label: "Section Tarifs" },
        ),
        contact: fields.object(
          {
            ...bilingual("eyebrow", "Sur-titre"),
            ...bilingual("title", "Titre (accepte les retours à la ligne)", {
              multiline: true,
            }),
            ...bilingual("intro", "Paragraphe d'introduction", {
              multiline: true,
            }),
          },
          { label: "Section Contact" },
        ),
      },
    }),

    // ── Collaborations (Food / Avis restaurant) ──────────────────────────────
    collaborations: singleton({
      label: "Collaborations",
      path: "content/collaborations/index",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            category: fields.select({
              label: "Catégorie",
              defaultValue: "food",
              options: [
                { label: "Food", value: "food" },
                { label: "Avis restaurant", value: "restaurant" },
              ],
            }),
            ...bilingual("title", "Titre"),
            ...bilingual(
              "meta",
              "Détail (ex: Dessert · 45 min, ou ville / restaurant)",
            ),
            image: image("collaborations"),
            link: optionalUrl,
          }),
          {
            label: "Collaborations",
            itemLabel: (p) => p.fields.title.value || "Collaboration",
          },
        ),
      },
    }),

    // ── Feed Instagram ───────────────────────────────────────────────────────
    feed: singleton({
      label: "Feed Instagram",
      path: "content/feed/index",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            image: image("feed"),
            link: fields.url({ label: "Lien vers la publication" }),
            ...bilingual("alt", "Texte alternatif (accessibilité)"),
          }),
          {
            label: "Publications",
            itemLabel: (p) => p.fields.alt.value || "Publication",
          },
        ),
      },
    }),

    // ── Marques partenaires ───────────────────────────────────────────────────
    partners: singleton({
      label: "Marques partenaires",
      path: "content/partners/index",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            name: fields.text({ label: "Nom de la marque" }),
            logo: image("partners"),
          }),
          {
            label: "Marques",
            itemLabel: (p) => p.fields.name.value || "Marque",
          },
        ),
      },
    }),

    // ── Témoignages ────────────────────────────────────────────────────────────
    // Volontairement non traduits : ce sont des messages réels de marques.
    testimonials: singleton({
      label: "Témoignages",
      path: "content/testimonials/index",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            quote: fields.text({ label: "Témoignage", multiline: true }),
            name: fields.text({ label: "Nom" }),
            role: fields.text({ label: "Rôle / marque" }),
            avatar: image("testimonials"),
          }),
          {
            label: "Témoignages",
            itemLabel: (p) => p.fields.name.value || "Témoignage",
          },
        ),
      },
    }),

    // ── Tarifs ─────────────────────────────────────────────────────────────────
    tarifs: singleton({
      label: "Tarifs",
      path: "content/tarifs/index",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            ...bilingual("title", "Titre (ex: Création de contenu)"),
            ...bilingual("price", "Prix (ex: à partir de 350 €)"),
            ...bilingual("unit", "Unité (ex: 1 vidéo)"),
            features: fields.array(
              fields.object({
                ...bilingual("text", "Prestation"),
              }),
              {
                label: "Prestations incluses",
                itemLabel: (p) => p.fields.text.value || "Prestation",
              },
            ),
          }),
          {
            label: "Offres",
            itemLabel: (p) => p.fields.title.value || "Offre",
          },
        ),
        ...bilingual("priceNote", "Note sur les tarifs", { multiline: true }),
        ...bilingual("revisionsNote", "Note sur les révisions", {
          multiline: true,
        }),
      },
    }),
  },
});
