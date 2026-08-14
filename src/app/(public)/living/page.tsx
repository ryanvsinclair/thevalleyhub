import Link from "next/link";
import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/JsonLd";
import {
  LIVING_CATEGORIES,
  listLivingCategoryStats,
  type LivingCategory,
} from "@/lib/queries/places";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Living",
  description:
    "Places around daily life at The Valley — schools, care, food, services, and getting around.",
  path: "/living",
});

const CATEGORY_LABELS: Record<LivingCategory, string> = {
  schools: "Schools",
  healthcare: "Healthcare",
  groceries: "Groceries",
  services: "Services",
  "getting-around": "Getting around",
};

const CATEGORY_BLURBS: Record<LivingCategory, string> = {
  schools: "Schools and nurseries serving The Valley.",
  healthcare: "Hospitals, clinics, pharmacies, dental, optical, and vet care.",
  groceries: "Grocery options in and near the community.",
  services: "Salon, spa, gym, and mosque.",
  "getting-around": "Fuel and malls with published drive context where verified.",
};

export default async function LivingIndexPage() {
  const stats = await listLivingCategoryStats();
  const byCategory = Object.fromEntries(
    stats.map((row) => [row.category, row]),
  ) as Record<LivingCategory, (typeof stats)[number]>;

  return (
    <div>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Living", path: "/living" },
        ])}
      />
      <h1 className="font-serif text-3xl tracking-tight text-neutral-900">
        Living
      </h1>
      <p className="mt-2 max-w-2xl text-neutral-600">
        Places around daily life at The Valley — schools, care, food, services,
        and getting around.
      </p>

      <ul className="mt-10 divide-y divide-neutral-200 border-t border-neutral-200">
        {LIVING_CATEGORIES.map((category) => {
          const { count, openNow } = byCategory[category];
          return (
            <li key={category} className="py-5">
              <Link
                href={`/living/${category}`}
                className="text-lg font-medium text-neutral-900 underline-offset-4 hover:underline"
              >
                {CATEGORY_LABELS[category]}
              </Link>
              <p className="mt-1 text-sm text-neutral-600">
                {CATEGORY_BLURBS[category]}
              </p>
              <p className="mt-2 text-xs tracking-wide text-neutral-500 uppercase">
                {count} {count === 1 ? "place" : "places"}
                {openNow > 0 ? ` · ${openNow} open now` : null}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
