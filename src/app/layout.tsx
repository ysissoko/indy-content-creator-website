import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { getSiteContent } from "@/lib/content";
import "./globals.css";

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

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();
  return {
    title: `${site.name} — ${site.tagline}`,
    description: site.seoDescription,
    openGraph: {
      title: `${site.name} — ${site.tagline}`,
      description: site.seoDescription,
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={`${cormorant.variable} ${jost.variable}`}>
        {children}
      </body>
    </html>
  );
}
