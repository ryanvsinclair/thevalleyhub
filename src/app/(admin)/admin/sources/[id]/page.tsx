import { notFound } from "next/navigation";

import { AdminForm } from "@/components/admin/AdminForm";
import { FormField, TextAreaField } from "@/components/admin/fields";
import { updateSource } from "@/lib/admin/actions";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

export default async function AdminSourceEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: source } = await supabase
    .from("sources")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!source) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Edit source</h1>
      <p className="mt-2 font-mono text-xs text-neutral-500">{source.id}</p>

      <AdminForm action={updateSource}>
        <input type="hidden" name="id" value={source.id} />
        <FormField label="Kind" name="kind" defaultValue={source.kind} required />
        <FormField
          label="Label"
          name="label"
          defaultValue={source.label}
          required
        />
        <FormField label="URL" name="url" defaultValue={source.url} />
        <FormField
          label="Retrieved at"
          name="retrieved_at"
          type="date"
          defaultValue={source.retrieved_at}
          required
        />
        <TextAreaField
          label="Notes"
          name="notes"
          defaultValue={source.notes}
          rows={4}
        />
      </AdminForm>
    </div>
  );
}
