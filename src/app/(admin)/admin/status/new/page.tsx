import { AdminForm } from "@/components/admin/AdminForm";
import { FormField, SelectField, TextAreaField } from "@/components/admin/fields";
import { createStatusLog } from "@/lib/admin/actions";
import {
  amenityKeyValues,
  confidenceValues,
  statusSubjectTypeValues,
  statusValues,
} from "@/lib/schema";
import { createClient } from "@/lib/supabase/server";

export default async function AdminStatusNewPage() {
  const supabase = await createClient();
  const { data: sources } = await supabase
    .from("sources")
    .select("id, label")
    .order("label");

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">New status entry</h1>
      <p className="mt-2 text-neutral-600">
        Append-only status_log row via session client.
      </p>

      <AdminForm action={createStatusLog} submitLabel="Create status entry">
        <SelectField
          label="Subject type"
          name="subject_type"
          options={statusSubjectTypeValues}
          required
        />
        <FormField
          label="Subject id"
          name="subject_id"
          hint="Optional UUID for cluster / place / community"
        />
        <SelectField
          label="Amenity key"
          name="amenity_key"
          options={amenityKeyValues}
          allowEmpty
          emptyLabel="— none —"
        />
        <SelectField
          label="Status"
          name="status"
          options={statusValues}
          required
        />
        <FormField
          label="Observed on"
          name="observed_on"
          type="date"
          defaultValue={today}
          required
        />
        <TextAreaField label="Note" name="note" rows={3} />
        <SelectField
          label="Confidence"
          name="confidence"
          options={confidenceValues}
          defaultValue="unverified"
          required
        />
        <SelectField
          label="Source"
          name="source_id"
          options={(sources ?? []).map((s) => ({
            value: s.id,
            label: s.label,
          }))}
          allowEmpty
          emptyLabel="— none —"
        />
      </AdminForm>
    </div>
  );
}
