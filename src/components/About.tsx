import { getSiteContent } from "@/lib/content";
import Photo from "./Photo";

export default async function About() {
  const site = await getSiteContent();
  return (
    <section id="apropos" className="bg-[#f6efe4]">
      <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-5 py-16 sm:px-10 md:grid-cols-[0.9fr_1.1fr] md:py-20 lg:gap-14">
        <Photo
          src={site.aboutImage || undefined}
          alt="Indy dans son atelier de cuisine"
          caption="photo atelier / cuisine"
          className="min-h-[320px] md:min-h-[420px]"
        />
        <div>
          <span className="text-[20px] uppercase tracking-[0.28em] text-[#c98b7e]">
            à propos de moi
          </span>
          <h2 className="mb-6 mt-4 font-serif font-small leading-[1.05] text-[#37302a] text-[clamp(26px,4vw,40px)]">
            Je m&apos;appelle Indy,
            <br />
            et je fais aimer
            <br />
            la cuisine.
          </h2>
          <p className="mb-5 max-w-[520px] text-[17px] font-light leading-[1.75] text-[#5b5044]">
            Depuis 2020, je partage des recettes accessibles et généreuses. Mon
            truc : rendre chaque plat désirable, du choix de la lumière au
            dernier plan sur la fourchette.
          </p>
          <p className="max-w-[520px] text-[17px] font-light leading-[1.75] text-[#5b5044]">
            Aujourd&apos;hui, j&apos;accompagne aussi les marques food dans la
            création de contenus qui donnent envie — shooting, vidéos courtes,
            recettes signées.
          </p>
        </div>
      </div>
    </section>
  );
}
