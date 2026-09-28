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
import { Analytics } from "@vercel/analytics/next";

export default async function Home() {
  const site = await getSiteContent();
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <StatsBar />
        <About />
        <Collaborations />
        <Feed />
        <Testimonials />
        <Tarifs />
        <Analytics />
        <Contact contactEmail={site.contactEmail} socials={site.socials} />
      </main>
      <Footer />
    </>
  );
}
