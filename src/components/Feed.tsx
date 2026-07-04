import { getSiteContent } from "@/lib/content";
import Photo from "./Photo";
import { InstagramIcon } from "./icons";

export default async function Feed() {
  const site = await getSiteContent();
  if (site.feed.length === 0) return null;

  return (
    <section id="feed" className="bg-[#efe6d8]">
      <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-10 md:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-[13px] uppercase tracking-[0.28em] text-[#c98b7e]">
              En ce moment
            </span>
            <h2 className="mt-4 font-serif font-medium text-[#37302a] text-[clamp(32px,5vw,46px)]">
              Sur Instagram
            </h2>
          </div>
          <a
            href={site.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-[#37302a] px-6 py-3 text-[13px] uppercase tracking-[0.06em] text-[#f6efe4] transition-colors hover:bg-[#c98b7e]"
          >
            <InstagramIcon className="h-4 w-4" />
            Me suivre
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {site.feed.map((post, i) => (
            <a
              key={i}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden rounded-lg"
            >
              <Photo
                src={post.image || undefined}
                alt={post.alt}
                caption="post"
                rounded="rounded-lg"
                className="h-full w-full transition-transform duration-500 group-hover:scale-105"
              />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#37302a]/0 text-[#f6efe4] opacity-0 transition-all duration-300 group-hover:bg-[#37302a]/35 group-hover:opacity-100">
                <InstagramIcon className="h-7 w-7" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
