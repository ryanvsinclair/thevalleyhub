import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LivingPlaceRow } from "@/components/living/LivingPlaceRow";
import { JsonLd } from "@/components/seo/JsonLd";
import { LIVING_LIST_DISPLAY } from "@/lib/places/living-display";
import {
  listMediaForSubjects,
  type LinkedMedia,
} from "@/lib/queries/clusters";
import {
  isLivingCategory,
  LIVING_CATEGORIES,
  listPlacesByLivingCategory,
  type LivingCategory,
} from "@/lib/queries/places";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ category: string }>;
};

const CATEGORY_LABELS: Record<LivingCategory, string> = {
  schools: "Schools",
  healthcare: "Healthcare",
  groceries: "Groceries",
  services: "Services",
  "getting-around": "Getting around",
};

const CATEGORY_DESCRIPTIONS: Record<LivingCategory, string> = {
  schools: "Schools and nurseries serving The Valley.",
  healthcare: "Hospitals, clinics, pharmacies, dental, optical, and vet care.",
  groceries: "Grocery options in and near the community.",
  services: "Salon, spa, gym, and mosque.",
  "getting-around":
    "Fuel and malls with published drive context where verified.",
};

export function generateStaticParams() {
  return LIVING_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (!isLivingCategory(category)) return { title: "Living" };
  return buildPageMetadata({
    title: CATEGORY_LABELS[category],
    description: CATEGORY_DESCRIPTIONS[category],
    path: `/living/${category}`,
  });
}

export default async function LivingCategoryPage({ params }: Props) {
  const { category } = await params;
  if (!isLivingCategory(category)) notFound();

  const places = await listPlacesByLivingCategory(category);

  const thumbByPlaceId = new Map<string, LinkedMedia>();
  if (LIVING_LIST_DISPLAY.thumb && places.length > 0) {
    const mediaRows = await listMediaForSubjects(
      "place",
      places.map((place) => place.id),
    );
    for (const row of mediaRows) {
      const existing = thumbByPlaceId.get(row.subject_id);
      if (!existing || (row.is_primary && !existing.is_primary)) {
        thumbByPlaceId.set(row.subject_id, row);
      }
    }
  }

  const label = CATEGORY_LABELS[category];

  return (
    <div>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Living", path: "/living" },
          { name: label, path: `/living/${category}` },
        ])}
      />
      <p className="text-sm text-neutral-500">
        <Link href="/living" className="hover:text-neutral-800">
          Living
        </Link>
        <span className="mx-2">/</span>
        <span>{label}</span>
      </p>
      <h1 className="mt-2 font-serif text-3xl tracking-tight text-neutral-900">
        {label}
      </h1>

      {places.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">
          No published places in this category yet.
        </p>
      ) : (
        <ul className="mt-10 divide-y divide-neutral-200 border-t border-neutral-200">
          {places.map((place) => (
            <LivingPlaceRow
              key={place.id}
              place={place}
              thumb={thumbByPlaceId.get(place.id) ?? null}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
