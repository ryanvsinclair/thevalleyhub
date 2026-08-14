import Image from "next/image";
import Link from "next/link";

import { StatusPill } from "@/components/content/StatusPill";
import { VerifiedBadge } from "@/components/content/VerifiedBadge";
import { isOpenNow } from "@/lib/places/open-now";
import {
  mediaPublicUrl,
  type LinkedMedia,
} from "@/lib/queries/clusters";
import type { Place } from "@/lib/queries/places";

type ParentPlace = { id: string; slug: string; name: string };

type Props = {
  place: Place;
  media: LinkedMedia[];
  parent: ParentPlace | null;
  operationalStatus?: string | null;
  operationalNote?: string | null;
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

  const record = hours as Record<
    string,
    { open?: string; close?: string } | null
  >;
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

function osmEmbedSrc(lat: number, lng: number) {
  const delta = 0.012;
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join(",");
  const params = new URLSearchParams({
    bbox,
    layer: "mapnik",
    marker: `${lat},${lng}`,
  });
  return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`;
}

function websiteLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * Single public template for every `/places/[slug]` page.
 * Omit sections when data is missing — never render empty frames.
 */
export function PlaceDetail({
  place,
  media,
  parent,
  operationalStatus = null,
  operationalNote = null,
}: Props) {
  const closed = operationalStatus === "closed";
  const openNow = !closed && isOpenNow(place.hours);
  const hasCoords = place.lat != null && place.lng != null;
  const hasContact =
    Boolean(place.address) ||
    Boolean(place.phone) ||
    Boolean(place.website) ||
    (place.drive_verified && place.drive_minutes != null);

  const sortedMedia = [...media].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return a.link_sort_order - b.link_sort_order;
  });

  return (
    <article>
      <header className="border-b border-neutral-200 pb-8">
        <h1 className="font-serif text-3xl tracking-tight text-neutral-900">
          {place.name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
          <span className="capitalize">{place.category}</span>
          {place.subcategory ? (
            <span className="text-neutral-500">{place.subcategory}</span>
          ) : null}
          {place.operator ? <span>{place.operator}</span> : null}
          {place.in_community ? (
            <span className="text-neutral-800">In community</span>
          ) : null}
          {operationalStatus ? (
            <StatusPill status={operationalStatus} />
          ) : null}
          {openNow ? (
            <span className="text-xs font-medium tracking-wide text-emerald-800 uppercase">
              Open now
            </span>
          ) : null}
          <VerifiedBadge verifiedAt={place.verified_at} />
        </div>
        {place.summary ? (
          <p className="mt-4 max-w-2xl text-neutral-700">{place.summary}</p>
        ) : null}
        {closed && operationalNote ? (
          <p className="mt-3 max-w-2xl text-sm text-neutral-600">
            {operationalNote}
          </p>
        ) : null}
      </header>

      {hasContact ? (
        <section className="mt-8 space-y-4 text-sm">
          <h2 className="text-sm font-medium tracking-wide text-neutral-500 uppercase">
            Contact
          </h2>
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
                {websiteLabel(place.website)}
              </a>
            </p>
          ) : null}
          {place.drive_verified && place.drive_minutes != null ? (
            <p>
              <span className="text-neutral-500">Drive </span>
              <span className="text-neutral-900">
                About {place.drive_minutes} minutes from The Valley
              </span>
            </p>
          ) : null}
        </section>
      ) : null}

      {place.hours ? (
        <section className="mt-8">
          <h2 className="text-sm font-medium tracking-wide text-neutral-500 uppercase">
            Hours
          </h2>
          <p className="mt-1 text-xs text-neutral-500">Dubai time</p>
          <HoursBlock hours={place.hours} />
        </section>
      ) : null}

      {hasCoords ? (
        <section className="mt-8">
          <h2 className="text-sm font-medium tracking-wide text-neutral-500 uppercase">
            Map
          </h2>
          <div className="mt-3 overflow-hidden border border-neutral-200">
            <iframe
              title={`Map of ${place.name}`}
              src={osmEmbedSrc(Number(place.lat), Number(place.lng))}
              className="h-72 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            <a
              href={`https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lng}#map=16/${place.lat}/${place.lng}`}
              className="underline-offset-4 hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              Open larger map
            </a>
          </p>
        </section>
      ) : null}

      {sortedMedia.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-sm font-medium tracking-wide text-neutral-500 uppercase">
            Photos
          </h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {sortedMedia.map((item) => (
              <figure key={item.id}>
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                  <Image
                    src={mediaPublicUrl(item.storage_path)}
                    alt={item.alt_text ?? item.caption ?? place.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 480px"
                  />
                </div>
                {item.caption ? (
                  <figcaption className="mt-2 text-sm text-neutral-600">
                    {item.caption}
                  </figcaption>
                ) : null}
                {item.credit ? (
                  <p className="mt-1 text-xs text-neutral-500">{item.credit}</p>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {place.notes ? (
        <section className="mt-8">
          <h2 className="text-sm font-medium tracking-wide text-neutral-500 uppercase">
            Good to know
          </h2>
          <p className="mt-2 max-w-2xl leading-relaxed text-neutral-700">
            {place.notes}
          </p>
        </section>
      ) : null}

      {parent ? (
        <section className="mt-8 border-t border-neutral-200 pt-6 text-sm">
          <span className="text-neutral-500">Part of </span>
          <Link
            href={`/places/${parent.slug}`}
            className="text-neutral-900 underline-offset-4 hover:underline"
          >
            {parent.name}
          </Link>
        </section>
      ) : null}
    </article>
  );
}
