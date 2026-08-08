import { AdminTable } from "@/components/admin/fields";
import { createClient } from "@/lib/supabase/server";

export default async function AdminAuditPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("audit_log")
    .select("id, created_at, actor_id, table_name, action, record_id, diff")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Audit log</h1>
      <p className="mt-2 text-neutral-600">Read-only recent writes (last 100).</p>
      {error ? (
        <p className="mt-4 text-sm text-red-700">{error.message}</p>
      ) : (
        <AdminTable
          headers={["When", "Table", "Action", "Record", "Actor", "Diff"]}
        >
          {(data ?? []).map((row) => (
            <tr key={row.id}>
              <td className="px-3 py-2 whitespace-nowrap text-neutral-600">
                {new Date(row.created_at).toLocaleString()}
              </td>
              <td className="px-3 py-2">{row.table_name}</td>
              <td className="px-3 py-2">{row.action}</td>
              <td className="px-3 py-2 font-mono text-xs text-neutral-500">
                {row.record_id ?? "—"}
              </td>
              <td className="px-3 py-2 font-mono text-xs text-neutral-500">
                {row.actor_id ?? "—"}
              </td>
              <td className="max-w-xs truncate px-3 py-2 font-mono text-xs text-neutral-500">
                {row.diff ? JSON.stringify(row.diff) : "—"}
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  );
}
