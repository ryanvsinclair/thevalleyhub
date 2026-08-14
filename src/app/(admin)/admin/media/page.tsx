import { AdminForm } from "@/components/admin/AdminForm";
import {
  AdminTable,
  FormField,
  SelectField,
  TextAreaField,
} from "@/components/admin/fields";
import {
  deleteMediaLink,
  uploadMedia,
  upsertMediaLink,
} from "@/lib/admin/actions";
import { mediaKindValues, mediaSubjectTypeValues } from "@/lib/schema";
import { createClient } from "@/lib/supabase/server";

export default async function AdminMediaPage() {
  const supabase = await createClient();
  const [
    { data, error },
    { data: links },
    { data: clusters },
    { data: unitTypes },
    { data: facades },
    { data: places },
  ] = await Promise.all([
    supabase
      .from("media")
      .select("id, storage_path, kind, alt_text, caption, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("media_links")
      .select("media_id, subject_type, subject_id, sort_order, is_primary")
      .order("sort_order")
      .limit(100),
    supabase
      .from("clusters")
      .select("id, name, slug")
      .is("deleted_at", null)
      .order("name"),
    supabase
      .from("unit_types")
      .select("id, bedrooms, label, cluster_id, clusters(name)")
      .order("sort_order")
      .limit(200),
    supabase
      .from("facade_style_descriptions")
      .select("id, style_name, cluster_id, clusters(name)")
      .order("sort_order")
      .limit(100),
    supabase
      .from("places")
      .select("id, name, slug")
      .is("deleted_at", null)
      .eq("state", "published")
      .is("cluster_id", null)
      .order("name")
      .limit(200),
  ]);

  const mediaOpts = (data ?? []).map((row) => ({
    value: row.id,
    label: `${row.storage_path} (${row.kind})`,
  }));

  const clusterOpts = (clusters ?? []).map((c) => ({
    value: c.id,
    label: `cluster · ${c.name}`,
  }));

  const unitTypeOpts = (unitTypes ?? []).map((u) => {
    const clusterName =
      u.clusters && !Array.isArray(u.clusters)
        ? (u.clusters as { name: string }).name
        : "cluster";
    return {
      value: u.id,
      label: `unit_type · ${clusterName} · ${u.label ?? `${u.bedrooms} BR`}`,
    };
  });

  const facadeOpts = (facades ?? []).map((f) => {
    const clusterName =
      f.clusters && !Array.isArray(f.clusters)
        ? (f.clusters as { name: string }).name
        : "cluster";
    return {
      value: f.id,
      label: `facade · ${clusterName} · ${f.style_name}`,
    };
  });

  const placeOpts = (places ?? []).map((p) => ({
    value: p.id,
    label: `place · ${p.name} (${p.slug})`,
  }));

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

      <h2 className="mt-12 text-lg font-medium tracking-tight">Link media</h2>
      <p className="mt-1 text-sm text-neutral-600">
        Attach an upload to a cluster, unit type, or facade (or other subject
        types). Use the subject picker that matches{" "}
        <code className="text-xs">subject_type</code>.
      </p>

      <div className="mt-4 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        <AdminForm
          action={upsertMediaLink}
          submitLabel="Link to cluster"
          className="space-y-3 rounded-sm border border-neutral-200 bg-white p-4"
        >
          <SelectField
            label="Media"
            name="media_id"
            options={mediaOpts}
            required
          />
          <input type="hidden" name="subject_type" value="cluster" />
          <SelectField
            label="Cluster"
            name="subject_id"
            options={clusterOpts}
            required
          />
          <FormField label="Sort order" name="sort_order" type="number" defaultValue={0} />
          <SelectField
            label="Primary"
            name="is_primary"
            options={[
              { value: "false", label: "false" },
              { value: "true", label: "true" },
            ]}
            defaultValue="false"
          />
        </AdminForm>

        <AdminForm
          action={upsertMediaLink}
          submitLabel="Link to place"
          className="space-y-3 rounded-sm border border-neutral-200 bg-white p-4"
        >
          <SelectField
            label="Media"
            name="media_id"
            options={mediaOpts}
            required
          />
          <input type="hidden" name="subject_type" value="place" />
          <SelectField
            label="Valley-wide place"
            name="subject_id"
            options={placeOpts}
            required
          />
          <FormField label="Sort order" name="sort_order" type="number" defaultValue={0} />
          <SelectField
            label="Primary"
            name="is_primary"
            options={[
              { value: "false", label: "false" },
              { value: "true", label: "true" },
            ]}
            defaultValue="true"
          />
        </AdminForm>

        <AdminForm
          action={upsertMediaLink}
          submitLabel="Link to unit type"
          className="space-y-3 rounded-sm border border-neutral-200 bg-white p-4"
        >
          <SelectField
            label="Media"
            name="media_id"
            options={mediaOpts}
            required
          />
          <input type="hidden" name="subject_type" value="unit_type" />
          <SelectField
            label="Unit type"
            name="subject_id"
            options={unitTypeOpts}
            required
          />
          <FormField label="Sort order" name="sort_order" type="number" defaultValue={0} />
          <SelectField
            label="Primary"
            name="is_primary"
            options={[
              { value: "false", label: "false" },
              { value: "true", label: "true" },
            ]}
            defaultValue="true"
          />
        </AdminForm>

        <AdminForm
          action={upsertMediaLink}
          submitLabel="Link to facade"
          className="space-y-3 rounded-sm border border-neutral-200 bg-white p-4"
        >
          <SelectField
            label="Media"
            name="media_id"
            options={mediaOpts}
            required
          />
          <input type="hidden" name="subject_type" value="facade_style_description" />
          <SelectField
            label="Facade"
            name="subject_id"
            options={facadeOpts}
            required
          />
          <FormField label="Sort order" name="sort_order" type="number" defaultValue={0} />
          <SelectField
            label="Primary"
            name="is_primary"
            options={[
              { value: "false", label: "false" },
              { value: "true", label: "true" },
            ]}
            defaultValue="true"
          />
        </AdminForm>
      </div>

      <p className="mt-6 text-sm text-neutral-600">
        Other subject types (place, question, …) — enter IDs manually:
      </p>
      <AdminForm
        action={upsertMediaLink}
        submitLabel="Link (manual)"
        className="mt-3 max-w-2xl space-y-3 rounded-sm border border-neutral-200 bg-white p-4"
      >
        <SelectField label="Media" name="media_id" options={mediaOpts} required />
        <SelectField
          label="Subject type"
          name="subject_type"
          options={mediaSubjectTypeValues}
          required
        />
        <FormField label="Subject id" name="subject_id" required />
        <FormField label="Sort order" name="sort_order" type="number" defaultValue={0} />
        <SelectField
          label="Primary"
          name="is_primary"
          options={[
            { value: "false", label: "false" },
            { value: "true", label: "true" },
          ]}
          defaultValue="false"
        />
      </AdminForm>

      <h2 className="mt-12 text-lg font-medium tracking-tight">Current links</h2>
      <AdminTable
        headers={["Media", "Subject type", "Subject id", "Primary", ""]}
      >
        {(links ?? []).map((link) => (
          <tr key={`${link.media_id}-${link.subject_type}-${link.subject_id}`}>
            <td className="px-3 py-2 font-mono text-xs">
              {link.media_id.slice(0, 8)}…
            </td>
            <td className="px-3 py-2">{link.subject_type}</td>
            <td className="px-3 py-2 font-mono text-xs">
              {link.subject_id.slice(0, 8)}…
            </td>
            <td className="px-3 py-2">{link.is_primary ? "yes" : "—"}</td>
            <td className="px-3 py-2 text-right">
              <AdminForm
                action={deleteMediaLink}
                submitLabel="Remove"
                className="inline"
              >
                <input type="hidden" name="media_id" value={link.media_id} />
                <input
                  type="hidden"
                  name="subject_type"
                  value={link.subject_type}
                />
                <input type="hidden" name="subject_id" value={link.subject_id} />
              </AdminForm>
            </td>
          </tr>
        ))}
      </AdminTable>

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
