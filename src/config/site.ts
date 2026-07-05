/**
 * ────────────────────────────────────────────────────────────────────────────
 *  DEFAULT CONTENT + TYPES.
 *
 *  Editable content is now managed through the Keystatic CMS at /keystatic and
 *  stored under content/ — see src/lib/content.ts. The values below are the
 *  TYPES (used across the app) plus fallback defaults used when a CMS field is
 *  missing, so the site never renders empty. To change what visitors see, use
 *  the CMS; edit here only to change the built-in defaults.
 * ────────────────────────────────────────────────────────────────────────────
 */

export type SocialKey = "instagram" | "tiktok" | "snapchat";

export interface Stat {
  /** Raw number of followers/views. Use a plain integer (e.g. 248000). */
  value: number;
  /** Label shown under the number. */
  label: string;
  /** Suffix appended after the formatted number, e.g. "" or " / mois". */
  suffix?: string;
}

export interface FeedItem {
  /** Path under /public (e.g. "/feed/post-1.jpg") or a full https URL. */
  image: string;
  /** Where clicking the post sends the visitor (your IG post URL). */
  link: string;
  /** Short alt text for accessibility. */
  alt: string;
}

export type CollabCategory = "food" | "restaurant";

export interface Collaboration {
  /** Which categorized section the post appears in. */
  category: CollabCategory;
  image: string; // path under /public or full URL; leave "" for placeholder
  title: string;
  meta: string; // e.g. "Dessert · 45 min" (food) or "Paris 11e" (restaurant)
  link?: string; // optional link to the Instagram reel
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar?: string; // optional path under /public
}

export const defaults = {
  /** Brand + SEO */
  name: "Indy",
  tagline: "Créatrice de contenu food",
  domainLabel: "indy.food",
  seoDescription:
    "Indy — créatrice de contenu food depuis 2020. Recettes, mises en scène et vidéos qui donnent faim, et créations pour les marques.",

  /** Contact */
  contactEmail: "ysissoko78@gmail.com",

  /** Social links — used by the buttons, the footer icons and the feed. */
  socials: {
    instagram: "https://instagram.com/", // ← replace with your handle URL
    tiktok: "https://tiktok.com/", // ← replace with your handle URL
    snapchat: "https://snapchat.com/", // ← replace with your handle URL
  } satisfies Record<SocialKey, string>,

  /** Main photos — drop files in /public and set the path (e.g. "/hero.jpg"). Leave "" for a placeholder. */
  heroImage: "",
  aboutImage: "",

  /**
   * Social stats bar. Edit the numbers whenever they grow — they animate
   * with a count-up on load. `value` is a plain integer; it's formatted
   * automatically (248000 → "248 K", 5200000 → "5,2 M").
   */
  stats: [
    { value: 248000, label: "Instagram" },
    { value: 92000, label: "TikTok" },
    { value: 40000, label: "Snapchat" },
    { value: 5200000, label: "Vues / mois" },
  ] as Stat[],

  /**
   * Instagram feed. Drop images in /public/feed and point `image` at them,
   * set `link` to the post URL. Shown as a responsive grid. Leave the array
   * empty to hide the whole section.
   */
  feed: [
    { image: "", link: "https://instagram.com/", alt: "Publication Instagram 1" },
    { image: "", link: "https://instagram.com/", alt: "Publication Instagram 2" },
    { image: "", link: "https://instagram.com/", alt: "Publication Instagram 3" },
    { image: "", link: "https://instagram.com/", alt: "Publication Instagram 4" },
    { image: "", link: "https://instagram.com/", alt: "Publication Instagram 5" },
    { image: "", link: "https://instagram.com/", alt: "Publication Instagram 6" },
  ] as FeedItem[],

  /**
   * Collaborations, grouped into two categorized sections by `category`:
   *  - "food"       → recettes & créations food pour les marques
   *  - "restaurant" → avis / mises en avant de restaurants
   * Each post is shown as a thumbnail inside an iPhone frame and links to the reel.
   */
  collaborations: [
    { category: "food", image: "", title: "Tarte rustique aux figues", meta: "Dessert · 45 min" },
    { category: "food", image: "", title: "Bowl crémeux au sésame", meta: "Végé · 25 min" },
    { category: "food", image: "", title: "Pancakes moelleux vanille", meta: "Brunch · 20 min" },
    { category: "restaurant", image: "", title: "Bistrot du Marché", meta: "Paris 11e" },
    { category: "restaurant", image: "", title: "Chez Malia", meta: "Cuisine sénégalaise" },
  ] as Collaboration[],

  /** Partner brands — put logo files in /public/partners, or leave "" for a placeholder box. */
  partners: [
    { name: "Marque 1", logo: "" },
    { name: "Marque 2", logo: "" },
    { name: "Marque 3", logo: "" },
    { name: "Marque 4", logo: "" },
    { name: "Marque 5", logo: "" },
  ] as { name: string; logo: string }[],

  testimonials: [
    {
      quote:
        "Indy a compris notre univers en un brief. Les contenus ont dépassé nos objectifs d'engagement.",
      name: "Camille R.",
      role: "Marque d'épicerie fine",
    },
    {
      quote:
        "Professionnelle, créative et rapide. Nos ventes ont grimpé la semaine de la campagne.",
      name: "Julien M.",
      role: "Ustensiles de cuisine",
    },
    {
      quote:
        "Un vrai regard d'artiste sur la food. On retravaille ensemble chaque trimestre depuis.",
      name: "Sofia L.",
      role: "Marque de boissons",
    },
  ] as Testimonial[],
};

export type Site = typeof defaults;
