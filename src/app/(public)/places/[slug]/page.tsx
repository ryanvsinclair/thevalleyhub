import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PlaceDetail } from "@/components/places/PlaceDetail";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getPublishedPlaceById,
  getPublishedPlaceBySlug,
  listMediaForPlace,
  listPublishedPlaceSlugs,
} from "@/lib/queries/places";
import { breadcrumbJsonLd, placeJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await listPublishedPlaceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPublishedPlaceBySlug(slug);
  if (!place) return { title: "Place" };
  return buildPageMetadata({
    title: place.meta_title ?? place.name,
    description: place.meta_description ?? place.summary,
    path: `/places/${place.slug}`,
  });
}

export default async function PlaceDetailPage({ params }: Props) {
  const { slug } = await params;
  const place = await getPublishedPlaceBySlug(slug);
  if (!place) notFound();

  const [media, parent] = await Promise.all([
    listMediaForPlace(place.id),
    place.parent_place_id
      ? getPublishedPlaceById(place.parent_place_id)
      : Promise.resolve(null),
  ]);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Living", path: "/living" },
            { name: place.name, path: `/places/${place.slug}` },
          ]),
          placeJsonLd(place),
        ]}
      />
      <PlaceDetail place={place} media={media} parent={parent} />
    </>
  );
}
