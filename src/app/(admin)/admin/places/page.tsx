import Link from "next/link";

import { AdminTable } from "@/components/admin/fields";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPlacesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("places")
    .select("id, slug, name, category, state, confidence, in_community")
    .is("deleted_at", null)
    .order("sort_order")
    .order("name");

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Places</h1>
      <p className="mt-2 text-neutral-600">Directory entries and hours.</p>
      {error ? (
        <p className="mt-4 text-sm text-red-700">{error.message}</p>
      ) : (
        <AdminTable
          headers={["Name", "Category", "State", "Confidence", ""]}
        >
          {(data ?? []).map((row) => (
            <tr key={row.id}>
              <td className="px-3 py-2">
                <div className="font-medium">{row.name}</div>
                <div className="font-mono text-xs text-neutral-500">
                  {row.slug}
                  {row.in_community ? " · in-community" : ""}
                </div>
              </td>
              <td className="px-3 py-2">{row.category}</td>
              <td className="px-3 py-2">{row.state}</td>
              <td className="px-3 py-2">{row.confidence}</td>
              <td className="px-3 py-2 text-right">
                <Link
                  href={`/admin/places/${row.id}`}
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
