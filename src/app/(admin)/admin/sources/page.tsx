import Link from "next/link";

import { AdminTable } from "@/components/admin/fields";
import { createClient } from "@/lib/supabase/server";

export default async function AdminSourcesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sources")
    .select("id, kind, label, url, retrieved_at")
    .order("label");

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Sources</h1>
      <p className="mt-2 text-neutral-600">Citation rows used across content.</p>
      {error ? (
        <p className="mt-4 text-sm text-red-700">{error.message}</p>
      ) : (
        <AdminTable headers={["Label", "Kind", "Retrieved", ""]}>
          {(data ?? []).map((row) => (
            <tr key={row.id}>
              <td className="px-3 py-2">
                <div className="font-medium">{row.label}</div>
                {row.url ? (
                  <div className="truncate text-xs text-neutral-500">
                    {row.url}
                  </div>
                ) : null}
              </td>
              <td className="px-3 py-2">{row.kind}</td>
              <td className="px-3 py-2">{row.retrieved_at}</td>
              <td className="px-3 py-2 text-right">
                <Link
                  href={`/admin/sources/${row.id}`}
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
