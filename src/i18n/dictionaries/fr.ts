/**
 * French dictionary — the typed source of truth for all UI micro-copy that
 * does not come from Keystatic (nav labels, buttons, form placeholders,
 * status messages, cookie banner, image alt/caption fallbacks, API errors).
 * Editorial copy (hero headline, about paragraphs, section titles) lives in
 * the Keystatic "texts" singleton instead — see src/lib/content.ts.
 */
const fr = {
  nav: {
    links: [
      { href: "#apropos", label: "À propos" },
      { href: "#collaborations", label: "Collaborations" },
      { href: "#avis-restaurants", label: "Restaurants" },
      { href: "#avis", label: "Avis" },
      { href: "#tarifs", label: "Tarifs" },
      { href: "#contact", label: "Contact" },
    ],
    cta: "Collaborer",
  },

  hero: {
    primaryCta: "Voir les recettes",
    secondaryCta: "Me suivre",
    photoAlt: "Portrait d'Indy, créatrice de contenu food",
    photoCaption: "portrait / photo hero",
  },

  about: {
    photoAlt: "Indy dans son atelier de cuisine",
    photoCaption: "photo atelier / cuisine",
  },

  collaborations: {
    seeAll: "Tout voir →",
    reelCaption: "reel",
  },

  feed: {
    followMe: "Me suivre",
    postCaption: "post",
  },

  contactForm: {
    namePlaceholder: "Votre nom",
    emailPlaceholder: "Email professionnel",
    messagePlaceholder: "Votre projet",
    submit: "Envoyer ma demande",
    sending: "Envoi…",
    sent: "Merci ! Votre message a bien été envoyé, je vous réponds vite.",
    writeInstead: "Vous pouvez aussi m'écrire à",
    genericError: "Une erreur est survenue.",
  },

  cookieConsent: {
    ariaLabel: "Consentement aux cookies",
    body: "Ce site utilise des cookies pour améliorer votre expérience de navigation. En cliquant sur « Accepter », vous consentez à leur utilisation.",
    reject: "Refuser",
    accept: "Accepter",
  },

  localeSwitcher: {
    ariaLabel: "Choisir la langue",
  },

  contactApi: {
    invalidRequest: "Requête invalide.",
    spamCheckFailed:
      "Vérification anti-spam échouée. Rechargez la page et réessayez.",
    requiredFields: "Tous les champs sont requis.",
    invalidEmail: "Email invalide.",
    messageTooLong: "Message trop long.",
    notConfigured:
      "Le formulaire n'est pas encore connecté. Merci de m'écrire directement par email.",
    sendFailed: "L'envoi a échoué. Réessayez plus tard.",
  },
};

export default fr;
export type Dictionary = typeof fr;
