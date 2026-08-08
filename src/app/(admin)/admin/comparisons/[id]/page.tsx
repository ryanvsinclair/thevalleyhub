import { notFound } from "next/navigation";

import { AdminForm } from "@/components/admin/AdminForm";
import {
  FormField,
  SelectField,
  TextAreaField,
} from "@/components/admin/fields";
import { updateComparison } from "@/lib/admin/actions";
import {
  comparisonDimensionValues,
  confidenceValues,
} from "@/lib/schema";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

export default async function AdminComparisonEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: comparison }, { data: communities }, { data: sources }] =
    await Promise.all([
      supabase.from("comparisons").select("*").eq("id", id).maybeSingle(),
      supabase
        .from("communities")
        .select("id, name, slug")
        .order("sort_order")
        .order("name"),
      supabase.from("sources").select("id, label").order("label"),
    ]);

  if (!comparison) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Edit comparison</h1>
      <p className="mt-2 font-mono text-xs text-neutral-500">{comparison.id}</p>

      <AdminForm action={updateComparison}>
        <input type="hidden" name="id" value={comparison.id} />
        <SelectField
          label="Community"
          name="community_id"
          options={(communities ?? []).map((c) => ({
            value: c.id,
            label: c.name,
          }))}
          defaultValue={comparison.community_id}
          required
        />
        <SelectField
          label="Dimension"
          name="dimension"
          options={comparisonDimensionValues}
          defaultValue={comparison.dimension}
          required
        />
        <TextAreaField
          label="Valley advantage"
          name="valley_advantage"
          defaultValue={comparison.valley_advantage}
          rows={4}
        />
        <TextAreaField
          label="Other advantage"
          name="other_advantage"
          defaultValue={comparison.other_advantage}
          rows={4}
        />
        <TextAreaField
          label="Honest read"
          name="honest_read"
          defaultValue={comparison.honest_read}
          rows={4}
        />
        <FormField
          label="Sort order"
          name="sort_order"
          type="number"
          defaultValue={comparison.sort_order}
        />
        <SelectField
          label="Confidence"
          name="confidence"
          options={confidenceValues}
          defaultValue={comparison.confidence}
          required
        />
        <SelectField
          label="Source"
          name="source_id"
          options={(sources ?? []).map((s) => ({
            value: s.id,
            label: s.label,
          }))}
          defaultValue={comparison.source_id}
          allowEmpty
        />
      </AdminForm>
    </div>
  );
}
