import About from "@/components/About";
import Collaborations from "@/components/Collaborations";
import Contact from "@/components/Contact";
import Feed from "@/components/Feed";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import StatsBar from "@/components/StatsBar";
import Tarifs from "@/components/Tarifs";
import Testimonials from "@/components/Testimonials";
import { getSiteContent } from "@/lib/content";
import { getDictionary } from "@/i18n/dictionaries";
import { hasLocale, type Locale } from "@/i18n/config";
import { Analytics } from "@vercel/analytics/next";
import { notFound } from "next/navigation";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;

  const [site, dict] = await Promise.all([
    getSiteContent(locale),
    getDictionary(locale),
  ]);

  return (
    <>
      <Nav locale={locale} />
      <main>
        <Hero locale={locale} />
        <StatsBar locale={locale} />
        <About locale={locale} />
        <Collaborations locale={locale} />
        <Feed locale={locale} />
        <Testimonials locale={locale} />
        <Tarifs locale={locale} />
        <Analytics />
        <Contact
          contactEmail={site.contactEmail}
          socials={site.socials}
          locale={locale}
          t={dict.contactForm}
          texts={site.texts.contact}
        />
      </main>
      <Footer locale={locale} />
    </>
  );
}
