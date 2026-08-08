import { notFound } from "next/navigation";

import { AdminForm } from "@/components/admin/AdminForm";
import {
  FormField,
  SelectField,
  TextAreaField,
} from "@/components/admin/fields";
import { updateCluster, upsertUnitType } from "@/lib/admin/actions";
import { boolSelect } from "@/lib/admin/form";
import {
  confidenceValues,
  productTypeValues,
  publishStateValues,
} from "@/lib/schema";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

function UnitTypeForm({
  clusterId,
  unit,
  sources,
}: {
  clusterId: string;
  unit?: {
    id: string;
    bedrooms: number;
    label: string | null;
    bua_min: number | null;
    bua_max: number | null;
    plot_min: number | null;
    plot_max: number | null;
    layout: string | null;
    maids_room: boolean | null;
    ground_floor_bedroom: boolean | null;
    private_pool: boolean | null;
    corner_unit: boolean | null;
    notes: string | null;
    sort_order: number;
    confidence: "official" | "corroborated" | "unverified";
    source_id: string | null;
    verified_at: string | null;
  };
  sources: { id: string; label: string }[];
}) {
  return (
    <AdminForm
      action={upsertUnitType}
      submitLabel={unit ? "Update unit type" : "Add unit type"}
      className="mt-4 space-y-3 rounded-sm border border-neutral-200 bg-white p-4"
    >
      <input type="hidden" name="cluster_id" value={clusterId} />
      {unit ? <input type="hidden" name="id" value={unit.id} /> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField
          label="Bedrooms"
          name="bedrooms"
          type="number"
          defaultValue={unit?.bedrooms ?? 0}
          required
        />
        <FormField label="Label" name="label" defaultValue={unit?.label} />
        <FormField
          label="BUA min"
          name="bua_min"
          type="number"
          defaultValue={unit?.bua_min}
        />
        <FormField
          label="BUA max"
          name="bua_max"
          type="number"
          defaultValue={unit?.bua_max}
        />
        <FormField
          label="Plot min"
          name="plot_min"
          type="number"
          defaultValue={unit?.plot_min}
        />
        <FormField
          label="Plot max"
          name="plot_max"
          type="number"
          defaultValue={unit?.plot_max}
        />
        <FormField label="Layout" name="layout" defaultValue={unit?.layout} />
        <FormField
          label="Sort order"
          name="sort_order"
          type="number"
          defaultValue={unit?.sort_order ?? 0}
        />
        <SelectField
          label="Maids room"
          name="maids_room"
          options={[
            { value: "true", label: "true" },
            { value: "false", label: "false" },
          ]}
          defaultValue={boolSelect(unit?.maids_room)}
          allowEmpty
        />
        <SelectField
          label="Ground floor bedroom"
          name="ground_floor_bedroom"
          options={[
            { value: "true", label: "true" },
            { value: "false", label: "false" },
          ]}
          defaultValue={boolSelect(unit?.ground_floor_bedroom)}
          allowEmpty
        />
        <SelectField
          label="Private pool"
          name="private_pool"
          options={[
            { value: "true", label: "true" },
            { value: "false", label: "false" },
          ]}
          defaultValue={boolSelect(unit?.private_pool)}
          allowEmpty
        />
        <SelectField
          label="Corner unit"
          name="corner_unit"
          options={[
            { value: "true", label: "true" },
            { value: "false", label: "false" },
          ]}
          defaultValue={boolSelect(unit?.corner_unit)}
          allowEmpty
        />
        <SelectField
          label="Confidence"
          name="confidence"
          options={confidenceValues}
          defaultValue={unit?.confidence ?? "unverified"}
          required
        />
        <SelectField
          label="Source"
          name="source_id"
          options={sources.map((s) => ({ value: s.id, label: s.label }))}
          defaultValue={unit?.source_id}
          allowEmpty
        />
        <FormField
          label="Verified at"
          name="verified_at"
          type="date"
          defaultValue={unit?.verified_at}
        />
      </div>
      <TextAreaField label="Notes" name="notes" defaultValue={unit?.notes} rows={2} />
    </AdminForm>
  );
}

export default async function AdminClusterEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: cluster }, { data: unitTypes }, { data: sources }] =
    await Promise.all([
      supabase.from("clusters").select("*").eq("id", id).maybeSingle(),
      supabase
        .from("unit_types")
        .select("*")
        .eq("cluster_id", id)
        .order("sort_order")
        .order("bedrooms"),
      supabase.from("sources").select("id, label").order("label"),
    ]);

  if (!cluster) notFound();

  const sourceOpts = sources ?? [];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Edit cluster</h1>
      <p className="mt-2 font-mono text-xs text-neutral-500">{cluster.id}</p>

      <AdminForm action={updateCluster}>
        <input type="hidden" name="id" value={cluster.id} />
        <FormField label="Slug" name="slug" defaultValue={cluster.slug} required />
        <FormField label="Name" name="name" defaultValue={cluster.name} required />
        <FormField
          label="Phase"
          name="phase"
          type="number"
          defaultValue={cluster.phase}
        />
        <SelectField
          label="Product type"
          name="product_type"
          options={productTypeValues}
          defaultValue={cluster.product_type}
          allowEmpty
        />
        <FormField
          label="Unit count"
          name="unit_count"
          type="number"
          defaultValue={cluster.unit_count}
        />
        <FormField
          label="Facade styles"
          name="facade_styles"
          defaultValue={cluster.facade_styles?.join(", ") ?? ""}
          hint="Comma-separated"
        />
        <SelectField
          label="Single row"
          name="single_row"
          options={[
            { value: "true", label: "true" },
            { value: "false", label: "false" },
          ]}
          defaultValue={boolSelect(cluster.single_row)}
          allowEmpty
        />
        <FormField
          label="Plex config"
          name="plex_config"
          defaultValue={cluster.plex_config}
        />
        <FormField
          label="Launch date"
          name="launch_date"
          type="date"
          defaultValue={cluster.launch_date}
        />
        <FormField
          label="Handover target"
          name="handover_target"
          type="date"
          defaultValue={cluster.handover_target}
        />
        <FormField
          label="Handover actual"
          name="handover_actual"
          type="date"
          defaultValue={cluster.handover_actual}
        />
        <FormField
          label="Price from AED"
          name="price_from_aed"
          type="number"
          defaultValue={cluster.price_from_aed}
        />
        <TextAreaField
          label="Payment plan"
          name="payment_plan"
          defaultValue={cluster.payment_plan}
          rows={2}
        />
        <TextAreaField
          label="Summary"
          name="summary"
          defaultValue={cluster.summary}
          rows={3}
        />
        <TextAreaField
          label="Positioning"
          name="positioning"
          defaultValue={cluster.positioning}
          rows={3}
        />
        <TextAreaField
          label="Body"
          name="body"
          defaultValue={cluster.body}
          rows={8}
        />
        <TextAreaField
          label="Notes"
          name="notes"
          defaultValue={cluster.notes}
          rows={3}
        />
        <FormField
          label="Meta title"
          name="meta_title"
          defaultValue={cluster.meta_title}
        />
        <TextAreaField
          label="Meta description"
          name="meta_description"
          defaultValue={cluster.meta_description}
          rows={2}
        />
        <FormField
          label="Sort order"
          name="sort_order"
          type="number"
          defaultValue={cluster.sort_order}
        />
        <SelectField
          label="Confidence"
          name="confidence"
          options={confidenceValues}
          defaultValue={cluster.confidence}
          required
        />
        <SelectField
          label="Source"
          name="source_id"
          options={sourceOpts.map((s) => ({ value: s.id, label: s.label }))}
          defaultValue={cluster.source_id}
          allowEmpty
        />
        <FormField
          label="Verified at"
          name="verified_at"
          type="date"
          defaultValue={cluster.verified_at}
        />
        <SelectField
          label="State"
          name="state"
          options={publishStateValues}
          defaultValue={cluster.state}
          required
        />
      </AdminForm>

      <h2 className="mt-12 text-lg font-medium tracking-tight">Unit types</h2>
      <p className="mt-1 text-sm text-neutral-600">
        Inline rows for this cluster.
      </p>

      {(unitTypes ?? []).map((unit) => (
        <div key={unit.id} className="mt-6">
          <p className="text-sm font-medium text-neutral-800">
            {unit.label ?? `${unit.bedrooms} BR`}{" "}
            <span className="font-mono text-xs font-normal text-neutral-500">
              {unit.id.slice(0, 8)}
            </span>
          </p>
          <UnitTypeForm clusterId={id} unit={unit} sources={sourceOpts} />
        </div>
      ))}

      <div className="mt-8">
        <p className="text-sm font-medium text-neutral-800">Add unit type</p>
        <UnitTypeForm clusterId={id} sources={sourceOpts} />
      </div>
    </div>
  );
}
