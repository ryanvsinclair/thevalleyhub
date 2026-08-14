import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  ComparisonDimension,
  NearbyInTheValley,
} from "@/components/compare/ComparisonDimension";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getPublishedCommunityBySlug,
  listComparisonsForCommunity,
  listPublishedCommunitySlugs,
} from "@/lib/queries/communities";
import {
  listInCommunityPlaces,
  listPublishedPlaces,
} from "@/lib/queries/places";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await listPublishedCommunitySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const community = await getPublishedCommunityBySlug(slug);
  if (!community) return { title: "Compare" };
  return buildPageMetadata({
    title: `${community.name} vs The Valley`,
    description: community.summary,
    path: `/compare/${community.slug}`,
  });
}

export default async function CompareDetailPage({ params }: Props) {
  const { slug } = await params;
  const community = await getPublishedCommunityBySlug(slug);
  if (!community) notFound();

  const [comparisons, publishedPlaces, inCommunity] = await Promise.all([
    listComparisonsForCommunity(community.id),
    listPublishedPlaces(),
    listInCommunityPlaces(),
  ]);

  const linkablePlaces = publishedPlaces.map((place) => ({
    name: place.name,
    slug: place.slug,
  }));

  // Prefer hub places over Golden Beach sub-pins for the strip.
  const nearby = inCommunity
    .filter((place) => !place.slug.startsWith("golden-beach-"))
    .slice(0, 5);

  return (
    <article>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
          { name: community.name, path: `/compare/${community.slug}` },
        ])}
      />
      <header className="border-b border-neutral-200 pb-8">
        <h1 className="font-serif text-3xl tracking-tight text-neutral-900">
          {community.name}
        </h1>
        {community.developer ? (
          <p className="mt-2 text-sm text-neutral-600">{community.developer}</p>
        ) : null}
        {community.summary ? (
          <p className="mt-4 max-w-2xl text-neutral-700">{community.summary}</p>
        ) : null}
      </header>

      {comparisons.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">
          No comparison dimensions published for this community.
        </p>
      ) : (
        <div className="mt-10 space-y-10">
          {comparisons.map((row) => (
            <ComparisonDimension
              key={row.id}
              row={row}
              communityName={community.name}
              places={linkablePlaces}
            />
          ))}
        </div>
      )}

      <NearbyInTheValley places={nearby} />
    </article>
  );
}
