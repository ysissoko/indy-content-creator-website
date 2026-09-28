import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import About from "@/components/About";
import Collaborations from "@/components/Collaborations";
import Feed from "@/components/Feed";
import Testimonials from "@/components/Testimonials";
import Tarifs from "@/components/Tarifs";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getSiteContent } from "@/lib/content";

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
        <Contact contactEmail={site.contactEmail} socials={site.socials} />
      </main>
      <Footer />
    </>
  );
}
