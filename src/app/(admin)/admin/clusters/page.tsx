import Link from "next/link";

import { AdminTable } from "@/components/admin/fields";
import { createClient } from "@/lib/supabase/server";

export default async function AdminClustersPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clusters")
    .select("id, slug, name, phase, product_type, state, confidence")
    .is("deleted_at", null)
    .order("sort_order")
    .order("name");

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Clusters</h1>
      <p className="mt-2 text-neutral-600">
        Cluster pages and inline unit types.
      </p>
      {error ? (
        <p className="mt-4 text-sm text-red-700">{error.message}</p>
      ) : (
        <AdminTable
          headers={["Name", "Phase", "Product", "State", "Confidence", ""]}
        >
          {(data ?? []).map((row) => (
            <tr key={row.id}>
              <td className="px-3 py-2">
                <div className="font-medium">{row.name}</div>
                <div className="font-mono text-xs text-neutral-500">
                  {row.slug}
                </div>
              </td>
              <td className="px-3 py-2">{row.phase ?? "—"}</td>
              <td className="px-3 py-2">{row.product_type ?? "—"}</td>
              <td className="px-3 py-2">{row.state}</td>
              <td className="px-3 py-2">{row.confidence}</td>
              <td className="px-3 py-2 text-right">
                <Link
                  href={`/admin/clusters/${row.id}`}
                  className="text-sm underline underline-offset-2"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  );
}
