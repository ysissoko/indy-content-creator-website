import type { SocialKey } from "@/config/site";
import { InstagramIcon, TikTokIcon, SnapchatIcon } from "./icons";

const entries = [
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "tiktok", label: "TikTok", Icon: TikTokIcon },
  { key: "snapchat", label: "Snapchat", Icon: SnapchatIcon },
] as const;

/**
 * Round social buttons that open each network in a new tab.
 * `variant="light"` for use on the dark contact section.
 */
export default function SocialLinks({
  socials,
  variant = "dark",
}: {
  socials: Record<SocialKey, string>;
  variant?: "dark" | "light";
}) {
  const cls =
    variant === "light"
      ? "bg-[#f6efe4] text-[#37302a] hover:bg-white"
      : "bg-[#37302a] text-[#f6efe4] hover:bg-[#c98b7e]";

  return (
    <div className="flex gap-4">
      {entries.map(({ key, label, Icon }) => (
        <a
          key={key}
          href={socials[key]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${cls}`}
        >
          <Icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}
