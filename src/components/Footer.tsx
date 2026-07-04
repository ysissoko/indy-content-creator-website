import { getSiteContent } from "@/lib/content";

export default async function Footer() {
  const site = await getSiteContent();
  return (
    <footer className="bg-[#2e2822]">
      <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-3 px-5 py-8 sm:flex-row sm:px-10">
        <span className="font-serif text-[22px] text-[#f6efe4]">
          {site.name}
        </span>
        <span className="text-[12px] tracking-[0.06em] text-[#8a7a66]">
          © {new Date().getFullYear()} {site.name} — {site.tagline}
        </span>
      </div>
    </footer>
  );
}
