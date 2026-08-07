import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { VerifiedBadge } from "@/components/content/VerifiedBadge";
import {
  getPublishedPlaceBySlug,
  listPublishedPlaceSlugs,
  type Place,
} from "@/lib/queries/places";

type Props = {
  params: Promise<{ slug: string }>;
};

const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
const DAY_LABELS: Record<(typeof DAY_ORDER)[number], string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

function HoursBlock({ hours }: { hours: Place["hours"] }) {
  if (!hours || typeof hours !== "object" || Array.isArray(hours)) return null;

  const record = hours as Record<string, { open?: string; close?: string } | null>;
  const rows = DAY_ORDER.flatMap((day) => {
    if (!(day in record)) return [];
    const value = record[day];
    if (value == null) {
      return [{ day, label: "Closed" }];
    }
    if (value.open && value.close) {
      return [{ day, label: `${value.open} – ${value.close}` }];
    }
    return [{ day, label: "Hours incomplete" }];
  });

  if (rows.length === 0) return null;

  return (
    <dl className="mt-2 grid gap-1 text-sm">
      {rows.map((row) => (
        <div key={row.day} className="flex gap-4">
          <dt className="w-28 text-neutral-500">{DAY_LABELS[row.day]}</dt>
          <dd className="text-neutral-800">{row.label}</dd>
        </div>
      ))}
    </dl>
  );
}

export async function generateStaticParams() {
  const slugs = await listPublishedPlaceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPublishedPlaceBySlug(slug);
  if (!place) return { title: "Place" };
  return {
    title: place.meta_title ?? place.name,
    description: place.meta_description ?? place.summary ?? undefined,
  };
}

export default async function PlaceDetailPage({ params }: Props) {
  const { slug } = await params;
  const place = await getPublishedPlaceBySlug(slug);
  if (!place) notFound();

  return (
    <article>
      <header className="border-b border-neutral-200 pb-8">
        <h1 className="font-serif text-3xl tracking-tight text-neutral-900">
          {place.name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
          <span className="capitalize">{place.category}</span>
          {place.operator ? <span>{place.operator}</span> : null}
          {place.in_community ? <span>In community</span> : null}
          <VerifiedBadge verifiedAt={place.verified_at} />
        </div>
        {place.summary ? (
          <p className="mt-4 max-w-2xl text-neutral-700">{place.summary}</p>
        ) : null}
      </header>

      <section className="mt-8 space-y-4 text-sm">
        {place.address ? (
          <p>
            <span className="text-neutral-500">Address </span>
            <span className="text-neutral-900">{place.address}</span>
          </p>
        ) : null}
        {place.phone ? (
          <p>
            <span className="text-neutral-500">Phone </span>
            <a
              href={`tel:${place.phone}`}
              className="text-neutral-900 underline-offset-4 hover:underline"
            >
              {place.phone}
            </a>
          </p>
        ) : null}
        {place.website ? (
          <p>
            <span className="text-neutral-500">Website </span>
            <a
              href={place.website}
              className="text-neutral-900 underline-offset-4 hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              {place.website}
            </a>
          </p>
        ) : null}
        {place.drive_verified && place.drive_minutes != null ? (
          <p>
            <span className="text-neutral-500">Drive </span>
            <span className="text-neutral-900">
              About {place.drive_minutes} minutes
            </span>
          </p>
        ) : null}
      </section>

      {place.hours ? (
        <section className="mt-8">
          <h2 className="text-sm font-medium tracking-wide text-neutral-500 uppercase">
            Hours
          </h2>
          <HoursBlock hours={place.hours} />
        </section>
      ) : null}

      {place.notes ? (
        <section className="mt-8">
          <h2 className="text-sm font-medium tracking-wide text-neutral-500 uppercase">
            Notes
          </h2>
          <p className="mt-2 max-w-2xl leading-relaxed text-neutral-700">
            {place.notes}
          </p>
        </section>
      ) : null}
    </article>
  );
}
