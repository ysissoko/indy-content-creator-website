import { config, fields, singleton } from "@keystatic/core";

/**
 * Keystatic CMS schema — mirrors the shape of src/config/site.ts.
 *
 * Storage:
 *  - dev  → "local": the editor at /keystatic writes files directly on disk.
 *  - prod → "github": edits are committed to the repo (Vercel then redeploys).
 *           Set NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO="owner/name" and complete the
 *           one-time GitHub App setup at /keystatic (see README).
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

export default config({
  storage:
    process.env.NODE_ENV === "production" && githubRepo
      ? { kind: "github", repo: githubRepo as `${string}/${string}` }
      : { kind: "local" },

  ui: {
    brand: { name: "Indy — Contenu" },
    navigation: {
      Général: ["settings"],
      Contenu: ["collaborations", "feed", "partners", "testimonials"],
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
        tagline: fields.text({ label: "Sous-titre / métier" }),
        domainLabel: fields.text({ label: "Domaine affiché (ex: indy.food)" }),
        seoDescription: fields.text({
          label: "Description SEO",
          multiline: true,
        }),
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
            title: fields.text({ label: "Titre" }),
            meta: fields.text({
              label: "Détail (ex: Dessert · 45 min, ou ville / restaurant)",
            }),
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
            alt: fields.text({ label: "Texte alternatif (accessibilité)" }),
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
  },
});
