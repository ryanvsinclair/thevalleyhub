import Link from "next/link";
import type { Metadata } from "next";

import { ConfidenceGate } from "@/components/content/ConfidenceGate";
import { listPublishedClusters } from "@/lib/queries/clusters";

export const metadata: Metadata = {
  title: "Clusters",
};

const PRODUCT_TYPES = ["townhouse", "twin_villa", "villa"] as const;

type Props = {
  searchParams: Promise<{ type?: string }>;
};

function formatProductType(value: string | null) {
  if (!value) return null;
  return value.replaceAll("_", " ");
}

function formatHandover(actual: string | null, target: string | null) {
  if (actual) return `Delivered ${actual}`;
  if (target) return `Target ${target}`;
  return null;
}

export default async function ClustersPage({ searchParams }: Props) {
  const { type } = await searchParams;
  const filter =
    type && (PRODUCT_TYPES as readonly string[]).includes(type) ? type : null;

  const clusters = await listPublishedClusters();
  const filtered = filter
    ? clusters.filter((cluster) => cluster.product_type === filter)
    : clusters;

  return (
    <div>
      <h1 className="font-serif text-3xl tracking-tight text-neutral-900">
        Clusters
      </h1>
      <p className="mt-2 max-w-2xl text-neutral-600">
        Published collections at The Valley. Specs only when confidence allows.
      </p>

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link
          href="/clusters"
          className={
            filter === null
              ? "text-neutral-900 underline underline-offset-4"
              : "text-neutral-600 hover:text-neutral-900"
          }
        >
          All
        </Link>
        {PRODUCT_TYPES.map((productType) => (
          <Link
            key={productType}
            href={`/clusters?type=${productType}`}
            className={
              filter === productType
                ? "text-neutral-900 underline underline-offset-4"
                : "text-neutral-600 hover:text-neutral-900"
            }
          >
            {formatProductType(productType)}
          </Link>
        ))}
      </div>

      <ul className="mt-10 divide-y divide-neutral-200 border-t border-neutral-200">
        {filtered.map((cluster) => {
          const handover = formatHandover(
            cluster.handover_actual,
            cluster.handover_target,
          );
          return (
            <li key={cluster.id} className="py-4">
              <Link
                href={`/clusters/${cluster.slug}`}
                className="text-lg font-medium text-neutral-900 underline-offset-4 hover:underline"
              >
                {cluster.name}
              </Link>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-600">
                {cluster.product_type ? (
                  <span className="capitalize">
                    {formatProductType(cluster.product_type)}
                  </span>
                ) : null}
                <ConfidenceGate confidence={cluster.confidence}>
                  {handover ? <span>{handover}</span> : null}
                </ConfidenceGate>
              </div>
            </li>
          );
        })}
      </ul>

      {filtered.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">
          No published clusters match this filter.
        </p>
      ) : null}
    </div>
  );
}
