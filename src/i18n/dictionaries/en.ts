import type { Dictionary } from "./fr";

/**
 * English dictionary — `satisfies Dictionary` guarantees it stays in sync
 * with every key defined in fr.ts.
 */
const en = {
  nav: {
    links: [
      { href: "#apropos", label: "About" },
      { href: "#collaborations", label: "Collaborations" },
      { href: "#avis-restaurants", label: "Restaurants" },
      { href: "#avis", label: "Reviews" },
      { href: "#tarifs", label: "Rates" },
      { href: "#contact", label: "Contact" },
    ],
    cta: "Work with me",
  },

  hero: {
    primaryCta: "See the recipes",
    secondaryCta: "Follow me",
    photoAlt: "Portrait of Indy, food content creator",
    photoCaption: "portrait / hero photo",
  },

  about: {
    photoAlt: "Indy in her kitchen studio",
    photoCaption: "studio / kitchen photo",
  },

  collaborations: {
    seeAll: "See all →",
    reelCaption: "reel",
  },

  feed: {
    followMe: "Follow me",
    postCaption: "post",
  },

  contactForm: {
    namePlaceholder: "Your name",
    emailPlaceholder: "Professional email",
    messagePlaceholder: "Your project",
    submit: "Send my request",
    sending: "Sending…",
    sent: "Thank you! Your message was sent, I'll reply soon.",
    writeInstead: "You can also email me at",
    genericError: "Something went wrong.",
  },

  cookieConsent: {
    ariaLabel: "Cookie consent",
    body: "This site uses cookies to improve your browsing experience. By clicking “Accept”, you consent to their use.",
    reject: "Reject",
    accept: "Accept",
  },

  localeSwitcher: {
    ariaLabel: "Choose language",
  },

  contactApi: {
    invalidRequest: "Invalid request.",
    spamCheckFailed: "Anti-spam check failed. Reload the page and try again.",
    requiredFields: "All fields are required.",
    invalidEmail: "Invalid email.",
    messageTooLong: "Message too long.",
    notConfigured:
      "The form isn't connected yet. Please email me directly instead.",
    sendFailed: "Sending failed. Please try again later.",
  },
} satisfies Dictionary;

export default en;
