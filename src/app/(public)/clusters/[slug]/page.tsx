import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ConfidenceGate } from "@/components/content/ConfidenceGate";
import { MarkdownBody } from "@/components/content/MarkdownBody";
import { VerifiedBadge } from "@/components/content/VerifiedBadge";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getPublishedClusterBySlug,
  listFacadeStylesForCluster,
  listMediaForSubjects,
  listPublishedClusterPlaces,
  listPublishedClusterSlugs,
  listUnitTypesForCluster,
  mediaPublicUrl,
  type LinkedMedia,
  type UnitType,
} from "@/lib/queries/clusters";
import { breadcrumbJsonLd, residenceJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await listPublishedClusterSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cluster = await getPublishedClusterBySlug(slug);
  if (!cluster) return { title: "Cluster" };
  return buildPageMetadata({
    title: cluster.meta_title ?? cluster.name,
    description: cluster.meta_description ?? cluster.summary,
    path: `/clusters/${cluster.slug}`,
  });
}

function formatAed(value: number) {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatRange(min: number | null, max: number | null, unit: string) {
  if (min == null && max == null) return null;
  if (min != null && max != null && min !== max) {
    return `${min.toLocaleString()}–${max.toLocaleString()} ${unit}`;
  }
  const value = min ?? max;
  return value == null ? null : `${value.toLocaleString()} ${unit}`;
}

function formatSqFt(value: number | null) {
  if (value == null) return null;
  return `${value.toLocaleString()} sq ft`;
}

function unitHasBreakdown(unit: UnitType) {
  return (
    unit.suite_area != null ||
    unit.garage_area != null ||
    unit.balcony_area != null ||
    unit.roof_terrace_area != null
  );
}

function primaryMedia(items: LinkedMedia[]) {
  return items.find((m) => m.is_primary) ?? items[0] ?? null;
}

function MediaFigure({ media }: { media: LinkedMedia }) {
  return (
    <figure className="mt-3">
      {/* Storage paths are public-bucket URLs; next/image remotePatterns not configured. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={mediaPublicUrl(media.storage_path)}
        alt={media.alt_text ?? media.caption ?? ""}
        className="max-h-80 w-full object-contain object-left"
      />
      {media.caption ? (
        <figcaption className="mt-2 text-sm text-neutral-600">
          {media.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export default async function ClusterDetailPage({ params }: Props) {
  const { slug } = await params;
  const cluster = await getPublishedClusterBySlug(slug);
  if (!cluster) notFound();

  const [unitTypes, facades, amenities, clusterMedia] = await Promise.all([
    listUnitTypesForCluster(cluster.id),
    listFacadeStylesForCluster(cluster.id),
    listPublishedClusterPlaces(cluster.id),
    listMediaForSubjects("cluster", [cluster.id]),
  ]);

  const unitTypeIds = unitTypes.map((u) => u.id);
  const facadeIds = facades.map((f) => f.id);

  const [unitTypeMedia, facadeMedia] = await Promise.all([
    listMediaForSubjects("unit_type", unitTypeIds),
    listMediaForSubjects("facade_style_description", facadeIds),
  ]);

  const mediaBySubject = (items: LinkedMedia[], subjectId: string) =>
    items.filter((m) => m.subject_id === subjectId);

  const showBreakdownColumn = unitTypes.some(unitHasBreakdown);
  const showCountColumn = unitTypes.some((u) => u.unit_count != null);

  return (
    <article>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Clusters", path: "/clusters" },
            { name: cluster.name, path: `/clusters/${cluster.slug}` },
          ]),
          residenceJsonLd(cluster),
        ]}
      />
      <header className="border-b border-neutral-200 pb-8">
        <h1 className="font-serif text-3xl tracking-tight text-neutral-900">
          {cluster.name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
          {cluster.product_type ? (
            <span className="capitalize">
              {cluster.product_type.replaceAll("_", " ")}
            </span>
          ) : null}
          <VerifiedBadge verifiedAt={cluster.verified_at} />
        </div>
        {cluster.summary ? (
          <p className="mt-4 max-w-2xl text-neutral-700">{cluster.summary}</p>
        ) : null}
      </header>

      {cluster.positioning ? (
        <section className="mt-8">
          <h2 className="text-sm font-medium tracking-wide text-neutral-500 uppercase">
            Positioning
          </h2>
          <p className="mt-2 max-w-2xl leading-relaxed text-neutral-800">
            {cluster.positioning}
          </p>
        </section>
      ) : null}

      <section className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
        <ConfidenceGate confidence={cluster.confidence}>
          {cluster.unit_count != null ? (
            <p>
              <span className="text-neutral-500">Units </span>
              {cluster.unit_count.toLocaleString()}
            </p>
          ) : null}
        </ConfidenceGate>
        <ConfidenceGate confidence={cluster.confidence}>
          {cluster.price_from_aed != null ? (
            <p>
              <span className="text-neutral-500">From </span>
              {formatAed(cluster.price_from_aed)}
            </p>
          ) : null}
        </ConfidenceGate>
        <ConfidenceGate confidence={cluster.confidence}>
          {cluster.payment_plan ? (
            <p>
              <span className="text-neutral-500">Payment plan </span>
              {cluster.payment_plan}
            </p>
          ) : null}
        </ConfidenceGate>
        <ConfidenceGate confidence={cluster.confidence}>
          {cluster.handover_actual ? (
            <p>
              <span className="text-neutral-500">Handover </span>
              {cluster.handover_actual}
            </p>
          ) : null}
        </ConfidenceGate>
        <ConfidenceGate confidence={cluster.confidence}>
          {!cluster.handover_actual && cluster.handover_target ? (
            <p>
              <span className="text-neutral-500">Handover target </span>
              {cluster.handover_target}
            </p>
          ) : null}
        </ConfidenceGate>
      </section>

      {cluster.notes ? (
        <section className="mt-8">
          <h2 className="text-sm font-medium tracking-wide text-neutral-500 uppercase">
            Notes
          </h2>
          <p className="mt-2 max-w-2xl leading-relaxed text-neutral-700">
            {cluster.notes}
          </p>
        </section>
      ) : null}

      {cluster.body ? (
        <section className="mt-8">
          <MarkdownBody content={cluster.body} />
        </section>
      ) : null}

      {clusterMedia.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold tracking-tight">Plans</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {clusterMedia.map((media) => (
              <MediaFigure key={media.id} media={media} />
            ))}
          </div>
        </section>
      ) : null}

      {unitTypes.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold tracking-tight">Unit types</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-300 text-neutral-500">
                  <th className="py-2 pr-4 font-medium">Type</th>
                  <th className="py-2 pr-4 font-medium">Beds</th>
                  {showCountColumn ? (
                    <th className="py-2 pr-4 font-medium">Count</th>
                  ) : null}
                  <th className="py-2 pr-4 font-medium">BUA</th>
                  <th className="py-2 pr-4 font-medium">Plot</th>
                  {showBreakdownColumn ? (
                    <th className="py-2 pr-4 font-medium">Areas</th>
                  ) : null}
                  <th className="py-2 font-medium">Layout</th>
                </tr>
              </thead>
              <tbody>
                {unitTypes.map((unit) => {
                  const bua = formatRange(unit.bua_min, unit.bua_max, "sq ft");
                  const plot = formatRange(
                    unit.plot_min,
                    unit.plot_max,
                    "sq ft",
                  );
                  const breakdown = [
                    ["Suite", formatSqFt(unit.suite_area)],
                    ["Garage", formatSqFt(unit.garage_area)],
                    ["Balcony", formatSqFt(unit.balcony_area)],
                    ["Roof", formatSqFt(unit.roof_terrace_area)],
                  ].filter(([, v]) => v != null) as [string, string][];

                  return (
                    <tr
                      key={unit.id}
                      className="border-b border-neutral-200 align-top"
                    >
                      <td className="py-3 pr-4 text-neutral-900">
                        {unit.label ?? "—"}
                      </td>
                      <td className="py-3 pr-4">{unit.bedrooms}</td>
                      {showCountColumn ? (
                        <td className="py-3 pr-4">
                          <ConfidenceGate confidence={unit.confidence}>
                            {unit.unit_count != null
                              ? unit.unit_count.toLocaleString()
                              : "—"}
                          </ConfidenceGate>
                        </td>
                      ) : null}
                      <td className="py-3 pr-4">
                        <ConfidenceGate confidence={unit.confidence}>
                          {bua}
                        </ConfidenceGate>
                      </td>
                      <td className="py-3 pr-4">
                        <ConfidenceGate confidence={unit.confidence}>
                          {plot}
                        </ConfidenceGate>
                      </td>
                      {showBreakdownColumn ? (
                        <td className="py-3 pr-4 text-neutral-700">
                          <ConfidenceGate confidence={unit.confidence}>
                            {breakdown.length > 0 ? (
                              <ul className="space-y-0.5">
                                {breakdown.map(([label, value]) => (
                                  <li key={label}>
                                    <span className="text-neutral-500">
                                      {label}{" "}
                                    </span>
                                    {value}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              "—"
                            )}
                          </ConfidenceGate>
                        </td>
                      ) : null}
                      <td className="py-3 text-neutral-700">
                        {unit.layout ?? "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {unitTypeMedia.length > 0 ? (
            <div className="mt-8 space-y-8">
              <h3 className="text-sm font-medium tracking-wide text-neutral-500 uppercase">
                Floor plans
              </h3>
              {unitTypes.map((unit) => {
                const media = mediaBySubject(unitTypeMedia, unit.id);
                if (media.length === 0) return null;
                return (
                  <div key={unit.id}>
                    <p className="text-sm font-medium text-neutral-900">
                      {unit.label ?? `${unit.bedrooms}-bed`}
                    </p>
                    <div className="mt-2 grid gap-4 sm:grid-cols-2">
                      {media.map((item) => (
                        <MediaFigure key={item.id} media={item} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </section>
      ) : null}

      {facades.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold tracking-tight">Facades</h2>
          <div className="mt-4 space-y-8">
            {facades.map((facade) => {
              const image = primaryMedia(
                mediaBySubject(facadeMedia, facade.id),
              );
              return (
                <div key={facade.id}>
                  <h3 className="font-medium text-neutral-900">
                    {facade.style_name}
                  </h3>
                  <ConfidenceGate confidence={facade.confidence}>
                    {facade.description ? (
                      <p className="mt-2 max-w-2xl leading-relaxed text-neutral-700">
                        {facade.description}
                      </p>
                    ) : null}
                  </ConfidenceGate>
                  {image ? <MediaFigure media={image} /> : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {amenities.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold tracking-tight">
            On-site amenities
          </h2>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-neutral-800">
            {amenities.map((place) => (
              <li key={place.id}>
                <Link
                  href={`/places/${place.slug}`}
                  className="underline-offset-2 hover:underline"
                >
                  {place.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
