import Link from "next/link";
import type { ReactNode } from "react";

export type LinkablePlace = {
  name: string;
  slug: string;
};

/**
 * Short forms that already appear in published comparison copy and map to
 * seeded places. Do not invent competitor facts — only link named places.
 */
const COMPARISON_ALIASES: { label: string; slug: string }[] = [
  { label: "Ranches Primary", slug: "ranches-primary-school" },
  { label: "Golden Beach", slug: "golden-beach" },
  { label: "JESS", slug: "jess-arabian-ranches" },
];

type Pattern = { label: string; slug: string; index: number };

function collectPatterns(places: LinkablePlace[]): Pattern[] {
  const bySlug = new Map(places.map((place) => [place.slug, place]));
  const patterns: Pattern[] = places.map((place, index) => ({
    label: place.name,
    slug: place.slug,
    index,
  }));

  for (const alias of COMPARISON_ALIASES) {
    if (!bySlug.has(alias.slug)) continue;
    patterns.push({
      label: alias.label,
      slug: alias.slug,
      index: places.length + patterns.length,
    });
  }

  return patterns.sort((a, b) => b.label.length - a.label.length);
}

/** Turn published place names (and known aliases) into `/places/[slug]` links. */
export function linkPlacesInText(
  text: string,
  places: LinkablePlace[],
): ReactNode {
  if (!text || places.length === 0) return text;

  const patterns = collectPatterns(places);
  if (patterns.length === 0) return text;

  const escaped = patterns.map((pattern) =>
    pattern.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) => {
    const match = patterns.find(
      (pattern) => pattern.label.toLowerCase() === part.toLowerCase(),
    );
    if (!match) return part;
    return (
      <Link
        key={`${match.slug}-${i}`}
        href={`/places/${match.slug}`}
        className="underline-offset-2 hover:underline"
      >
        {part}
      </Link>
    );
  });
}
