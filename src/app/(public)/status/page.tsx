import type { Metadata } from "next";
import Link from "next/link";

import { StatusPill } from "@/components/content/StatusPill";
import { listPublishedClusters } from "@/lib/queries/clusters";
import { listDeliveredClusterStatus } from "@/lib/queries/status";

export const metadata: Metadata = {
  title: "Status",
};

export default async function StatusPage() {
  const [clusters, delivered] = await Promise.all([
    listPublishedClusters(),
    listDeliveredClusterStatus(),
  ]);

  const statusBySubject = new Map(
    delivered
      .filter((row) => row.subject_id)
      .map((row) => [row.subject_id as string, row]),
  );

  const deliveredClusters = clusters
    .map((cluster) => {
      const status = statusBySubject.get(cluster.id);
      if (!status) return null;
      return { cluster, status };
    })
    .filter((row): row is NonNullable<typeof row> => row != null);

  return (
    <div>
      <h1 className="font-serif text-3xl tracking-tight text-neutral-900">
        Status
      </h1>
      <p className="mt-2 max-w-2xl text-neutral-600">
        Cluster delivery confirmed in the status log. Masterplan amenity
        operational status is unknown — listed amenities are specified or
        planned, not confirmed open.
      </p>

      {deliveredClusters.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">
          No delivered cluster status rows are published yet.
        </p>
      ) : (
        <ul className="mt-10 divide-y divide-neutral-200 border-t border-neutral-200">
          {deliveredClusters.map(({ cluster, status }) => (
            <li key={status.id} className="flex flex-wrap items-center gap-4 py-4">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/clusters/${cluster.slug}`}
                  className="text-lg font-medium text-neutral-900 underline-offset-4 hover:underline"
                >
                  {cluster.name}
                </Link>
                <p className="mt-1 text-sm text-neutral-600">
                  Observed {status.observed_on}
                  {status.note ? ` · ${status.note}` : null}
                </p>
              </div>
              <StatusPill status={status.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
