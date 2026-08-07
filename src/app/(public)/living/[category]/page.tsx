import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { VerifiedBadge } from "@/components/content/VerifiedBadge";
import {
  isLivingCategory,
  LIVING_CATEGORIES,
  listPlacesByLivingCategory,
  type LivingCategory,
} from "@/lib/queries/places";

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

export function generateStaticParams() {
  return LIVING_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (!isLivingCategory(category)) return { title: "Living" };
  return { title: CATEGORY_LABELS[category] };
}

export default async function LivingCategoryPage({ params }: Props) {
  const { category } = await params;
  if (!isLivingCategory(category)) notFound();

  const places = await listPlacesByLivingCategory(category);

  return (
    <div>
      <p className="text-sm text-neutral-500">
        <Link href="/living" className="hover:text-neutral-800">
          Living
        </Link>
        <span className="mx-2">/</span>
        <span>{CATEGORY_LABELS[category]}</span>
      </p>
      <h1 className="mt-2 font-serif text-3xl tracking-tight text-neutral-900">
        {CATEGORY_LABELS[category]}
      </h1>

      {places.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">
          No published places in this category yet.
        </p>
      ) : (
        <ul className="mt-10 divide-y divide-neutral-200 border-t border-neutral-200">
          {places.map((place) => (
            <li key={place.id} className="py-4">
              <Link
                href={`/places/${place.slug}`}
                className="text-lg font-medium text-neutral-900 underline-offset-4 hover:underline"
              >
                {place.name}
              </Link>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
                <span className="capitalize">{place.category}</span>
                {place.in_community ? <span>In community</span> : null}
                <VerifiedBadge verifiedAt={place.verified_at} />
              </div>
              {place.summary ? (
                <p className="mt-2 max-w-2xl text-sm text-neutral-600">
                  {place.summary}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
