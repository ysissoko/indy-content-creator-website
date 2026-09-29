/**
 * Formats a follower/view count the French way, e.g.
 *   248000  → "248 K"
 *   5200000 → "5,2 M"
 *   380000  → "380 K"
 *   950     → "950"
 * Uses a narrow no-break space before the unit and a comma decimal separator.
 */
export function formatCount(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    // one decimal, but drop it when it's a whole number (5,0 M → 5 M)
    const str = m.toFixed(1).replace(/\.0$/, "").replace(".", ",");
    return `${str} M`;
  }
  if (n >= 1_000) {
    return `${Math.round(n / 1_000)} K`;
  }
  return String(n);
}

/**
 * Renders a string containing "{accent}" markup, styling the enclosed text
 * in italic + the accent color — used for editorial copy (e.g. the hero
 * headline) that's editable in both languages via Keystatic, where the
 * emphasized word/phrase differs per language.
 */
export function renderAccent(text: string): React.ReactNode[] {
  const parts = text.split(/\{([^}]+)\}/);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="italic text-[#c98b7e]">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
