import { absoluteUrl } from "@/lib/seo/site";
import type { Json } from "@/types/database";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

type DayHours = { open?: string; close?: string } | null;

const DAY_TO_SCHEMA: Record<string, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

function openingHoursFromJson(hours: Json | null) {
  if (!hours || typeof hours !== "object" || Array.isArray(hours)) return undefined;

  const record = hours as Record<string, DayHours>;
  const specs = DAY_ORDER.flatMap((day) => {
    const value = record[day];
    if (!value || typeof value !== "object") return [];
    if (!value.open || !value.close) return [];
    return [
      {
        "@type": "OpeningHoursSpecification" as const,
        dayOfWeek: DAY_TO_SCHEMA[day],
        opens: value.open,
        closes: value.close,
      },
    ];
  });

  return specs.length > 0 ? specs : undefined;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqPageJsonLd(question: string, answer: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
        },
      },
    ],
  };
}

export function placeJsonLd(place: {
  name: string;
  slug: string;
  summary: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  lat: number | null;
  lng: number | null;
  hours: Json | null;
}) {
  const openingHoursSpecification = openingHoursFromJson(place.hours);

  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: place.name,
    description: place.summary ?? undefined,
    url: absoluteUrl(`/places/${place.slug}`),
    telephone: place.phone ?? undefined,
    sameAs: place.website ?? undefined,
    address: place.address
      ? {
          "@type": "PostalAddress",
          streetAddress: place.address,
        }
      : undefined,
    geo:
      place.lat != null && place.lng != null
        ? {
            "@type": "GeoCoordinates",
            latitude: place.lat,
            longitude: place.lng,
          }
        : undefined,
    openingHoursSpecification,
  };
}

export function residenceJsonLd(cluster: {
  name: string;
  slug: string;
  summary: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: cluster.name,
    description: cluster.summary ?? undefined,
    url: absoluteUrl(`/clusters/${cluster.slug}`),
  };
}

export function articleJsonLd(post: {
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string | null;
  updated_at: string;
}) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    url,
    mainEntityOfPage: url,
  };
}
