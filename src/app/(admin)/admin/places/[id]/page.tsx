import { notFound } from "next/navigation";

import { AdminForm } from "@/components/admin/AdminForm";
import {
  FormField,
  SelectField,
  TextAreaField,
} from "@/components/admin/fields";
import { GooglePlaceAutocomplete } from "@/components/admin/GooglePlaceAutocomplete";
import { updatePlace } from "@/lib/admin/actions";
import { importGooglePlacePhotoAction } from "@/lib/admin/google-places-actions";
import {
  confidenceValues,
  placeCategoryValues,
  publishStateValues,
} from "@/lib/schema";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

export default async function AdminPlaceEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: place }, { data: sources }, { data: clusters }] =
    await Promise.all([
      supabase.from("places").select("*").eq("id", id).maybeSingle(),
      supabase.from("sources").select("id, label").order("label"),
      supabase
        .from("clusters")
        .select("id, name, slug")
        .is("deleted_at", null)
        .order("sort_order")
        .order("name"),
    ]);

  if (!place) notFound();

  const hoursDefault =
    place.hours == null ? "" : JSON.stringify(place.hours, null, 2);
  const valleyWide = place.cluster_id == null;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Edit place</h1>
      <p className="mt-2 font-mono text-xs text-neutral-500">{place.id}</p>

      <AdminForm action={updatePlace}>
        <input type="hidden" name="id" value={place.id} />
        <GooglePlaceAutocomplete enabled={valleyWide} />
        {!valleyWide ? (
          <p className="text-xs text-neutral-500">
            Cluster-scoped amenity — Google Places lookup is disabled
            (google_place_id must stay null).
          </p>
        ) : null}
        <FormField label="Slug" name="slug" defaultValue={place.slug} required />
        <FormField label="Name" name="name" defaultValue={place.name} required />
        <SelectField
          label="Category"
          name="category"
          options={placeCategoryValues}
          defaultValue={place.category}
          required
        />
        <FormField
          label="Subcategory"
          name="subcategory"
          defaultValue={place.subcategory}
        />
        <SelectField
          label="Cluster"
          name="cluster_id"
          options={(clusters ?? []).map((c) => ({
            value: c.id,
            label: `${c.name} (${c.slug})`,
          }))}
          defaultValue={place.cluster_id}
          allowEmpty
        />
        <p className="-mt-2 text-xs text-neutral-500">
          Set for on-site amenities; leave empty for Valley-wide places.
        </p>
        <FormField
          label="Parent place id"
          name="parent_place_id"
          defaultValue={place.parent_place_id}
          hint="UUID of containing place, if any"
        />
        <FormField
          label="Google Place ID"
          name="google_place_id"
          defaultValue={place.google_place_id}
          hint={
            valleyWide
              ? "Filled by Google lookup above, or paste manually"
              : "Must remain empty for cluster amenities"
          }
        />
        <SelectField
          label="In community"
          name="in_community"
          options={[
            { value: "false", label: "false" },
            { value: "true", label: "true" },
          ]}
          defaultValue={String(place.in_community)}
        />
        <FormField
          label="Operator"
          name="operator"
          defaultValue={place.operator}
        />
        <FormField
          label="Address"
          name="address"
          defaultValue={place.address}
        />
        <FormField label="Lat" name="lat" defaultValue={place.lat} />
        <FormField label="Lng" name="lng" defaultValue={place.lng} />
        <FormField label="Phone" name="phone" defaultValue={place.phone} />
        <FormField
          label="Website"
          name="website"
          defaultValue={place.website}
        />
        <TextAreaField
          label="Hours (JSON)"
          name="hours"
          defaultValue={hoursDefault}
          rows={10}
          hint='Shape: {"mon":{"open":"09:00","close":"22:00"},"sat":null}'
        />
        <FormField
          label="Drive minutes"
          name="drive_minutes"
          type="number"
          defaultValue={place.drive_minutes}
        />
        <SelectField
          label="Drive verified"
          name="drive_verified"
          options={[
            { value: "false", label: "false" },
            { value: "true", label: "true" },
          ]}
          defaultValue={String(place.drive_verified)}
        />
        <TextAreaField
          label="Summary"
          name="summary"
          defaultValue={place.summary}
          rows={3}
        />
        <TextAreaField
          label="Notes"
          name="notes"
          defaultValue={place.notes}
          rows={3}
        />
        <FormField
          label="Meta title"
          name="meta_title"
          defaultValue={place.meta_title}
        />
        <TextAreaField
          label="Meta description"
          name="meta_description"
          defaultValue={place.meta_description}
          rows={2}
        />
        <FormField
          label="Sort order"
          name="sort_order"
          type="number"
          defaultValue={place.sort_order}
        />
        <SelectField
          label="Confidence"
          name="confidence"
          options={confidenceValues}
          defaultValue={place.confidence}
          required
        />
        <SelectField
          label="Source"
          name="source_id"
          options={(sources ?? []).map((s) => ({
            value: s.id,
            label: s.label,
          }))}
          defaultValue={place.source_id}
          allowEmpty
        />
        <FormField
          label="Verified at"
          name="verified_at"
          type="date"
          defaultValue={place.verified_at}
        />
        <SelectField
          label="State"
          name="state"
          options={publishStateValues}
          defaultValue={place.state}
          required
        />
      </AdminForm>

      {valleyWide && place.google_place_id ? (
        <div className="mt-10 max-w-2xl border-t border-neutral-200 pt-8">
          <h2 className="text-lg font-medium tracking-tight">Place photo</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Import the first Google Place Photo into Storage and link it as
            primary. Skips if a primary place photo already exists. Credit is
            stored for attribution.
          </p>
          <AdminForm
            action={importGooglePlacePhotoAction}
            submitLabel="Import Google photo"
            className="mt-4 space-y-3"
          >
            <input type="hidden" name="place_id" value={place.id} />
          </AdminForm>
        </div>
      ) : null}
    </div>
  );
}
