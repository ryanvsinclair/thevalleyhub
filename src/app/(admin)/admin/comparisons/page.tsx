import Link from "next/link";

import { AdminTable } from "@/components/admin/fields";
import { createClient } from "@/lib/supabase/server";

export default async function AdminComparisonsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comparisons")
    .select(
      "id, dimension, confidence, community_id, communities(name, slug)",
    )
    .order("sort_order");

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Comparisons</h1>
      <p className="mt-2 text-neutral-600">
        Edit by id (community + dimension).
      </p>
      {error ? (
        <p className="mt-4 text-sm text-red-700">{error.message}</p>
      ) : (
        <AdminTable headers={["Community", "Dimension", "Confidence", ""]}>
          {(data ?? []).map((row) => {
            const community = Array.isArray(row.communities)
              ? row.communities[0]
              : row.communities;
            return (
              <tr key={row.id}>
                <td className="px-3 py-2">
                  {community?.name ?? row.community_id.slice(0, 8)}
                </td>
                <td className="px-3 py-2">{row.dimension}</td>
                <td className="px-3 py-2">{row.confidence}</td>
                <td className="px-3 py-2 text-right">
                  <Link
                    href={`/admin/comparisons/${row.id}`}
                    className="text-sm underline underline-offset-2"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            );
          })}
        </AdminTable>
      )}
    </div>
  );
}
