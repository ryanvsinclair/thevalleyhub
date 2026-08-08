import Link from "next/link";

import { AdminTable } from "@/components/admin/fields";
import { createClient } from "@/lib/supabase/server";

function staleCutoff(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 90);
  return d.toISOString().slice(0, 10);
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;
  const supabase = await createClient();
  const cutoff = staleCutoff();

  const [
    unverifiedClusters,
    unverifiedPlaces,
    unverifiedQuestions,
    staleClusters,
    stalePlaces,
    staleQuestions,
    audit,
  ] = await Promise.all([
    supabase
      .from("clusters")
      .select("id", { count: "exact", head: true })
      .eq("confidence", "unverified")
      .is("deleted_at", null),
    supabase
      .from("places")
      .select("id", { count: "exact", head: true })
      .eq("confidence", "unverified")
      .is("deleted_at", null),
    supabase
      .from("questions")
      .select("id", { count: "exact", head: true })
      .eq("confidence", "unverified")
      .is("deleted_at", null),
    supabase
      .from("clusters")
      .select("id", { count: "exact", head: true })
      .eq("state", "published")
      .is("deleted_at", null)
      .or(`verified_at.is.null,verified_at.lt.${cutoff}`),
    supabase
      .from("places")
      .select("id", { count: "exact", head: true })
      .eq("state", "published")
      .is("deleted_at", null)
      .or(`verified_at.is.null,verified_at.lt.${cutoff}`),
    supabase
      .from("questions")
      .select("id", { count: "exact", head: true })
      .eq("state", "published")
      .is("deleted_at", null)
      .or(`verified_at.is.null,verified_at.lt.${cutoff}`),
    supabase
      .from("audit_log")
      .select("id, created_at, actor_id, table_name, action, record_id")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const unverified =
    (unverifiedClusters.count ?? 0) +
    (unverifiedPlaces.count ?? 0) +
    (unverifiedQuestions.count ?? 0);
  const stale =
    (staleClusters.count ?? 0) +
    (stalePlaces.count ?? 0) +
    (staleQuestions.count ?? 0);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-neutral-600">
        Editorial health and recent activity.
      </p>

      {message ? (
        <p className="mt-4 rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </p>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="border border-neutral-200 bg-white px-4 py-5">
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            Unverified
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{unverified}</p>
          <p className="mt-1 text-xs text-neutral-500">
            clusters {unverifiedClusters.count ?? 0} · places{" "}
            {unverifiedPlaces.count ?? 0} · questions{" "}
            {unverifiedQuestions.count ?? 0}
          </p>
        </div>
        <div className="border border-neutral-200 bg-white px-4 py-5">
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            Stale published
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{stale}</p>
          <p className="mt-1 text-xs text-neutral-500">
            verified_at null or older than 90 days
          </p>
        </div>
        <div className="border border-neutral-200 bg-white px-4 py-5">
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            Quick link
          </p>
          <Link
            href="/admin/status/new"
            className="mt-3 inline-block text-sm text-neutral-900 underline underline-offset-2"
          >
            Log a status update
          </Link>
        </div>
      </div>

      <h2 className="mt-10 text-lg font-medium tracking-tight">
        Recent activity
      </h2>
      {audit.error ? (
        <p className="mt-3 text-sm text-red-700">{audit.error.message}</p>
      ) : (
        <AdminTable
          headers={["When", "Table", "Action", "Record", "Actor"]}
        >
          {(audit.data ?? []).map((row) => (
            <tr key={row.id}>
              <td className="px-3 py-2 whitespace-nowrap text-neutral-600">
                {new Date(row.created_at).toLocaleString()}
              </td>
              <td className="px-3 py-2">{row.table_name}</td>
              <td className="px-3 py-2">{row.action}</td>
              <td className="px-3 py-2 font-mono text-xs text-neutral-500">
                {row.record_id?.slice(0, 8) ?? "—"}
              </td>
              <td className="px-3 py-2 font-mono text-xs text-neutral-500">
                {row.actor_id?.slice(0, 8) ?? "—"}
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  );
}
