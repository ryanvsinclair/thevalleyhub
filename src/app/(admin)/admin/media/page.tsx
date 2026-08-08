import { AdminForm } from "@/components/admin/AdminForm";
import {
  AdminTable,
  FormField,
  SelectField,
  TextAreaField,
} from "@/components/admin/fields";
import { uploadMedia } from "@/lib/admin/actions";
import { mediaKindValues } from "@/lib/schema";
import { createClient } from "@/lib/supabase/server";

export default async function AdminMediaPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .select("id, storage_path, kind, alt_text, caption, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Media</h1>
      <p className="mt-2 text-neutral-600">
        Upload to the <code className="text-xs">media</code> bucket. Alt text
        is required.
      </p>

      <AdminForm
        action={uploadMedia}
        submitLabel="Upload"
        className="mt-6 max-w-2xl space-y-4"
      >
        <label className="block text-sm">
          <span className="text-neutral-700">File</span>
          <input
            type="file"
            name="file"
            required
            className="mt-1 block w-full text-sm"
          />
        </label>
        <FormField label="Alt text" name="alt_text" required />
        <SelectField
          label="Kind"
          name="kind"
          options={mediaKindValues}
          defaultValue="photo"
          required
        />
        <TextAreaField label="Caption" name="caption" rows={2} />
        <FormField label="Credit" name="credit" />
        <FormField label="Captured on" name="captured_on" type="date" />
      </AdminForm>

      <h2 className="mt-12 text-lg font-medium tracking-tight">Recent uploads</h2>
      {error ? (
        <p className="mt-3 text-sm text-red-700">{error.message}</p>
      ) : (
        <AdminTable headers={["Path", "Kind", "Alt", "Created"]}>
          {(data ?? []).map((row) => (
            <tr key={row.id}>
              <td className="px-3 py-2 font-mono text-xs">{row.storage_path}</td>
              <td className="px-3 py-2">{row.kind}</td>
              <td className="px-3 py-2">{row.alt_text ?? "—"}</td>
              <td className="px-3 py-2 whitespace-nowrap text-neutral-600">
                {new Date(row.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  );
}
