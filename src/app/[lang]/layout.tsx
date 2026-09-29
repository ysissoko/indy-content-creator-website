import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Caveat, Cormorant_Garamond, Jost } from "next/font/google";
import { getSiteContent } from "@/lib/content";
import { getDictionary } from "@/i18n/dictionaries";
import { hasLocale, locales, pathFor, type Locale } from "@/i18n/config";
import CookieConsent from "@/components/CookieConsent";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://indyslife.com";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  const site = await getSiteContent(lang);
  const title = `${site.name} — ${site.tagline}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: site.seoDescription,
    alternates: {
      canonical: pathFor(lang),
      languages: {
        fr: pathFor("fr"),
        en: pathFor("en"),
        "x-default": pathFor("fr"),
      },
    },
    openGraph: {
      title,
      description: site.seoDescription,
      type: "website",
      locale: lang === "en" ? "en_US" : "fr_FR",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  return (
    <html lang={lang}>
      <body className={`${cormorant.variable} ${jost.variable} ${caveat.variable}`}>
        {children}
        <CookieConsent t={dict.cookieConsent} />
      </body>
    </html>
  );
}
