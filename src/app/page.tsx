import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import About from "@/components/About";
import Recipes from "@/components/Recipes";
import Feed from "@/components/Feed";
import Partners from "@/components/Partners";
import Testimonials from "@/components/Testimonials";
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
        <Recipes />
        <Feed />
        <Partners />
        <Testimonials />
        <Contact contactEmail={site.contactEmail} socials={site.socials} />
      </main>
      <Footer />
    </>
  );
}
