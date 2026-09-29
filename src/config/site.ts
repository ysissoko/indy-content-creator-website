/**
 * ────────────────────────────────────────────────────────────────────────────
 *  TYPES + PER-LOCALE DEFAULT CONTENT.
 *
 *  Editable content is managed through the Keystatic CMS at /keystatic and
 *  stored under content/ — see src/lib/content.ts, which resolves the raw
 *  bilingual CMS records into one `Site` (single language) using the
 *  fallback chain: CMS current-locale → CMS French → the defaults below.
 *
 *  `Site` describes content already resolved for one locale — components
 *  never see the FR/EN pair, only the string that applies to the current
 *  request. To change what visitors see, use the CMS; edit here only to
 *  change the built-in defaults (e.g. before any CMS entry exists).
 * ────────────────────────────────────────────────────────────────────────────
 */

export type SocialKey = "instagram" | "tiktok" | "snapchat";

export interface Stat {
  /** Raw number of followers/views. Use a plain integer (e.g. 248000). */
  value: number;
  /** Label shown under the number (already resolved for the current locale). */
  label: string;
  /**
   * Stable link target, independent of the (translatable) label text — so
   * StatsBar can still link to the right social network in any language.
   */
  key?: SocialKey;
  /** Suffix appended after the formatted number, e.g. "" or " / mois". */
  suffix?: string;
}

export interface FeedItem {
  /** Path under /public (e.g. "/feed/post-1.jpg") or a full https URL. */
  image: string;
  /** Where clicking the post sends the visitor (your IG post URL). */
  link: string;
  /** Short alt text for accessibility (already resolved for the current locale). */
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

export interface TarifFeature {
  text: string;
}

export interface TarifItem {
  title: string;
  price: string;
  unit: string;
  features: string[];
}

/** Bilingual editorial copy that isn't structured enough for its own CMS shape. */
export interface SiteTexts {
  hero: {
    /** May contain `{accent}` markup — the enclosed text is styled in italic. */
    headline: string;
    intro: string;
  };
  about: {
    eyebrow: string;
    paragraph1: string;
    paragraph2: string;
  };
  collabFood: { eyebrow: string; title: string };
  collabRestaurant: { eyebrow: string; title: string };
  feed: { eyebrow: string; title: string };
  testimonials: {
    heading: string;
    partnersLabel: string;
    testimonialsLabel: string;
  };
  tarifs: { eyebrow: string; title: string; revisionsLabel: string };
  contact: {
    eyebrow: string;
    /** May contain "\n" line breaks. */
    title: string;
    intro: string;
  };
}

/** Fully resolved, single-language site content — what components consume. */
export interface Site {
  name: string;
  tagline: string;
  domainLabel: string;
  seoDescription: string;
  contactEmail: string;
  socials: Record<SocialKey, string>;
  heroImage: string;
  aboutImage: string;
  stats: Stat[];
  feed: FeedItem[];
  collaborations: Collaboration[];
  partners: { name: string; logo: string }[];
  testimonials: Testimonial[];
  tarifs: TarifItem[];
  tarifsPriceNote: string;
  tarifsRevisionsNote: string;
  texts: SiteTexts;
}

const socials: Record<SocialKey, string> = {
  instagram: "https://instagram.com/", // ← replace with your handle URL
  tiktok: "https://tiktok.com/", // ← replace with your handle URL
  snapchat: "https://snapchat.com/", // ← replace with your handle URL
};

export const defaults: Site = {
  /** Brand + SEO */
  name: "Indy",
  tagline: "Créatrice de contenu food",
  domainLabel: "indy.food",
  seoDescription:
    "Indy — créatrice de contenu food depuis 2020. Recettes, mises en scène et vidéos qui donnent faim, et créations pour les marques.",

  /** Contact */
  contactEmail: "ysissoko78@gmail.com",

  /** Social links — used by the buttons, the footer icons and the feed. */
  socials,

  /** Main photos — drop files in /public and set the path (e.g. "/hero.jpg"). Leave "" for a placeholder. */
  heroImage: "",
  aboutImage: "",

  /**
   * Social stats bar. Edit the numbers whenever they grow — they animate
   * with a count-up on load. `value` is a plain integer; it's formatted
   * automatically (248000 → "248 K", 5200000 → "5,2 M").
   */
  stats: [
    { value: 248000, label: "Instagram", key: "instagram" },
    { value: 92000, label: "TikTok", key: "tiktok" },
    { value: 40000, label: "Snapchat", key: "snapchat" },
    { value: 5200000, label: "Vues / mois" },
  ],

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
  ],

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
  ],

  /** Partner brands — put logo files in /public/partners, or leave "" for a placeholder box. */
  partners: [
    { name: "Marque 1", logo: "" },
    { name: "Marque 2", logo: "" },
    { name: "Marque 3", logo: "" },
    { name: "Marque 4", logo: "" },
    { name: "Marque 5", logo: "" },
  ],

  /** Volontairement non traduits : ce sont des messages réels de marques. */
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
  ],

  /** Grille tarifaire. */
  tarifs: [
    {
      title: "Création de contenu",
      price: "à partir de 350 €",
      unit: "1 vidéo",
      features: [
        "Conception & réalisation",
        "Script si nécessaire",
        "Tournage",
        "Montage",
      ],
    },
    {
      title: "Story recette",
      price: "150 €",
      unit: "1 story recette",
      features: [
        "Création d'une recette courte en format Story",
        "Réalisation & tournage",
        "Intégration du produit dans la recette",
      ],
    },
    {
      title: "UGC",
      price: "à partir de 400 €",
      unit: "1 vidéo UGC",
      features: [
        "Conception du contenu",
        "Script si nécessaire",
        "Tournage",
        "Montage",
      ],
    },
    {
      title: "Droits publicitaires",
      price: "+50 %",
      unit: "Ads",
      features: [
        "Utilisation du contenu en publicité pendant 1 mois",
        "Renouvelable par période d'1 mois",
      ],
    },
  ],
  tarifsPriceNote:
    "Le tarif peut évoluer selon la complexité du brief, le nombre de contenus demandés et les usages prévus.",
  tarifsRevisionsNote:
    "Jusqu'à 3 révisions incluses. Toute demande supplémentaire fera l'objet d'une facturation additionnelle.",

  texts: {
    hero: {
      headline: "La cuisine, {racontée} avec gourmandise.",
      intro:
        "Recettes, mises en scène et vidéos qui donnent faim. Suivie par une communauté fidèle sur Instagram, TikTok et Snapchat.",
    },
    about: {
      eyebrow: "à propos de moi",
      paragraph1:
        "La cuisine fait partie de moi depuis toujours. J'aime autant revisiter des recettes traditionnelles que créer des recettes originales, avec l'envie de toujours apporter ma petite touche.",
      paragraph2:
        "À travers mes contenus, j'aime partager une cuisine gourmande, créative et accessible mais surtout créer des recettes qui donnent réellement envie de cuisiner.",
    },
    collabFood: { eyebrow: "mes collaborations", title: "Recettes" },
    collabRestaurant: {
      eyebrow: "Revue de restaurants",
      title: "Dégustation et avis",
    },
    feed: { eyebrow: "En ce moment", title: "Sur Instagram" },
    testimonials: {
      heading: "Ils m'ont fait confiance",
      partnersLabel: "Marques partenaires",
      testimonialsLabel: "Ce qu'ils disent de nos collaborations",
    },
    tarifs: {
      eyebrow: "Tarifs",
      title: "Des formats pour chaque besoin",
      revisionsLabel: "Révisions",
    },
    contact: {
      eyebrow: "Travaillons ensemble",
      title: "Un projet food\nen tête ?",
      intro:
        "Recettes, vidéos courtes, UGC ou campagne complète — dites-moi tout.",
    },
  },
};

export const defaultsEn: Site = {
  ...defaults,
  tagline: "Food content creator",
  seoDescription:
    "Indy — food content creator since 2020. Recipes, styling and videos that make you hungry, plus branded creations.",

  socials,

  stats: [
    { value: 248000, label: "Instagram", key: "instagram" },
    { value: 92000, label: "TikTok", key: "tiktok" },
    { value: 40000, label: "Snapchat", key: "snapchat" },
    { value: 5200000, label: "Views / month" },
  ],

  feed: [
    { image: "", link: "https://instagram.com/", alt: "Instagram post 1" },
    { image: "", link: "https://instagram.com/", alt: "Instagram post 2" },
    { image: "", link: "https://instagram.com/", alt: "Instagram post 3" },
    { image: "", link: "https://instagram.com/", alt: "Instagram post 4" },
    { image: "", link: "https://instagram.com/", alt: "Instagram post 5" },
    { image: "", link: "https://instagram.com/", alt: "Instagram post 6" },
  ],

  collaborations: [
    { category: "food", image: "", title: "Rustic fig tart", meta: "Dessert · 45 min" },
    { category: "food", image: "", title: "Creamy sesame bowl", meta: "Veggie · 25 min" },
    { category: "food", image: "", title: "Fluffy vanilla pancakes", meta: "Brunch · 20 min" },
    { category: "restaurant", image: "", title: "Bistrot du Marché", meta: "Paris 11th" },
    { category: "restaurant", image: "", title: "Chez Malia", meta: "Senegalese cuisine" },
  ],

  tarifs: [
    {
      title: "Content creation",
      price: "from €350",
      unit: "1 video",
      features: [
        "Concept & production",
        "Script if needed",
        "Filming",
        "Editing",
      ],
    },
    {
      title: "Recipe story",
      price: "€150",
      unit: "1 recipe story",
      features: [
        "Short recipe created as a Story",
        "Production & filming",
        "Product integrated into the recipe",
      ],
    },
    {
      title: "UGC",
      price: "from €400",
      unit: "1 UGC video",
      features: [
        "Content concept",
        "Script if needed",
        "Filming",
        "Editing",
      ],
    },
    {
      title: "Advertising rights",
      price: "+50%",
      unit: "Ads",
      features: [
        "Use of the content in ads for 1 month",
        "Renewable per 1-month period",
      ],
    },
  ],
  tarifsPriceNote:
    "The rate may vary depending on the brief's complexity, the number of pieces of content requested and the intended usage.",
  tarifsRevisionsNote:
    "Up to 3 revisions included. Any additional request will be billed separately.",

  texts: {
    hero: {
      headline: "Cooking, {told} with indulgence.",
      intro:
        "Recipes, styling and videos that make you hungry. Followed by a loyal community on Instagram, TikTok and Snapchat.",
    },
    about: {
      eyebrow: "about me",
      paragraph1:
        "Cooking has been part of me for as long as I can remember. I love revisiting traditional recipes just as much as creating original ones, always looking to add my own little touch.",
      paragraph2:
        "Through my content, I love sharing indulgent, creative and accessible cooking — and above all, creating recipes that genuinely make you want to cook.",
    },
    collabFood: { eyebrow: "my collaborations", title: "Recipes" },
    collabRestaurant: { eyebrow: "Restaurant reviews", title: "Tastings & reviews" },
    feed: { eyebrow: "Right now", title: "On Instagram" },
    testimonials: {
      heading: "They trusted me",
      partnersLabel: "Partner brands",
      testimonialsLabel: "What they say about our collaborations",
    },
    tarifs: {
      eyebrow: "Rates",
      title: "Formats for every need",
      revisionsLabel: "Revisions",
    },
    contact: {
      eyebrow: "Let's work together",
      title: "A food project\nin mind?",
      intro: "Recipes, short videos, UGC or a full campaign — tell me everything.",
    },
  },
};
