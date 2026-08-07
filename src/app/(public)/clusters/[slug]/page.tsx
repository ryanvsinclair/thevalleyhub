import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ConfidenceGate } from "@/components/content/ConfidenceGate";
import { MarkdownBody } from "@/components/content/MarkdownBody";
import { VerifiedBadge } from "@/components/content/VerifiedBadge";
import {
  getPublishedClusterBySlug,
  listPublishedClusterSlugs,
  listUnitTypesForCluster,
} from "@/lib/queries/clusters";

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
  return {
    title: cluster.meta_title ?? cluster.name,
    description: cluster.meta_description ?? cluster.summary ?? undefined,
  };
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

export default async function ClusterDetailPage({ params }: Props) {
  const { slug } = await params;
  const cluster = await getPublishedClusterBySlug(slug);
  if (!cluster) notFound();

  const unitTypes = await listUnitTypesForCluster(cluster.id);

  return (
    <article>
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

      {unitTypes.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold tracking-tight">Unit types</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-300 text-neutral-500">
                  <th className="py-2 pr-4 font-medium">Type</th>
                  <th className="py-2 pr-4 font-medium">Beds</th>
                  <th className="py-2 pr-4 font-medium">BUA</th>
                  <th className="py-2 pr-4 font-medium">Plot</th>
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
                  return (
                    <tr
                      key={unit.id}
                      className="border-b border-neutral-200 align-top"
                    >
                      <td className="py-3 pr-4 text-neutral-900">
                        {unit.label ?? "—"}
                      </td>
                      <td className="py-3 pr-4">{unit.bedrooms}</td>
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
                      <td className="py-3 text-neutral-700">
                        {unit.layout ?? "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </article>
  );
}
