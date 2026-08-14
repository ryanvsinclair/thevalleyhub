import Link from "next/link";

import { linkPlacesInText } from "@/lib/compare/link-places";
import type { Comparison } from "@/lib/queries/communities";
import type { Place } from "@/lib/queries/places";

type LinkablePlace = { name: string; slug: string };

const LIVING_BY_DIMENSION: Record<
  string,
  { href: string; label: string }[]
> = {
  schools: [{ href: "/living/schools", label: "Schools in Living" }],
  amenities: [
    { href: "/living/healthcare", label: "Healthcare" },
    { href: "/living/groceries", label: "Groceries" },
    { href: "/living/services", label: "Services" },
    { href: "/living/getting-around", label: "Getting around" },
  ],
};

type Props = {
  row: Comparison;
  communityName: string;
  places: LinkablePlace[];
};

export function ComparisonDimension({ row, communityName, places }: Props) {
  const livingLinks = LIVING_BY_DIMENSION[row.dimension] ?? [];

  return (
    <section className="border-t border-neutral-200 pt-8 first:border-t-0 first:pt-0">
      <h2 className="text-lg font-semibold tracking-tight capitalize">
        {row.dimension.replaceAll("_", " ")}
      </h2>
      <div className="mt-4 grid gap-6 text-sm sm:grid-cols-2">
        {row.valley_advantage ? (
          <div>
            <h3 className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
              The Valley
            </h3>
            <p className="mt-2 leading-relaxed text-neutral-800">
              {linkPlacesInText(row.valley_advantage, places)}
            </p>
          </div>
        ) : null}
        {row.other_advantage ? (
          <div>
            <h3 className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
              {communityName}
            </h3>
            <p className="mt-2 leading-relaxed text-neutral-800">
              {linkPlacesInText(row.other_advantage, places)}
            </p>
          </div>
        ) : null}
      </div>
      {row.honest_read ? (
        <div className="mt-4 max-w-2xl border-l border-neutral-300 pl-4">
          <h3 className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
            Honest read
          </h3>
          <p className="mt-2 leading-relaxed text-neutral-800">
            {linkPlacesInText(row.honest_read, places)}
          </p>
        </div>
      ) : null}
      {livingLinks.length > 0 ? (
        <p className="mt-4 text-sm text-neutral-600">
          <span className="text-neutral-500">Living · </span>
          {livingLinks.map((link, index) => (
            <span key={link.href}>
              {index > 0 ? <span className="text-neutral-400"> · </span> : null}
              <Link
                href={link.href}
                className="text-neutral-800 underline-offset-4 hover:underline"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </p>
      ) : null}
    </section>
  );
}

type NearbyProps = {
  places: Place[];
};

export function NearbyInTheValley({ places }: NearbyProps) {
  if (places.length === 0) return null;

  return (
    <aside className="mt-12 border-t border-neutral-200 pt-8">
      <h2 className="text-lg font-semibold tracking-tight">
        Nearby in The Valley
      </h2>
      <p className="mt-1 text-sm text-neutral-600">
        In-community places from Living — names only, no live listings feed.
      </p>
      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {places.map((place) => (
          <li key={place.id}>
            <Link
              href={`/places/${place.slug}`}
              className="text-neutral-900 underline-offset-4 hover:underline"
            >
              {place.name}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm">
        <Link
          href="/living"
          className="text-neutral-600 underline-offset-4 hover:underline"
        >
          All Living categories
        </Link>
      </p>
    </aside>
  );
}
