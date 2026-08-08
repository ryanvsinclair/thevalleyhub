import { AdminForm } from "@/components/admin/AdminForm";
import {
  FormField,
  SelectField,
  TextAreaField,
} from "@/components/admin/fields";
import { createQuestion } from "@/lib/admin/actions";
import {
  audienceValues,
  confidenceValues,
  publishStateValues,
  topicValues,
} from "@/lib/schema";
import { createClient } from "@/lib/supabase/server";

export default async function AdminQuestionNewPage() {
  const supabase = await createClient();
  const { data: sources } = await supabase
    .from("sources")
    .select("id, label")
    .order("label");

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">New question</h1>
      <p className="mt-2 text-neutral-600">
        Gate 5 test: create via session, then delete when done.
      </p>

      <AdminForm action={createQuestion} submitLabel="Create question">
        <FormField
          label="Slug"
          name="slug"
          defaultValue="gate5-test-question"
          required
        />
        <TextAreaField
          label="Question"
          name="question"
          defaultValue="Gate 5 test question — delete me"
          rows={2}
          required
        />
        <TextAreaField
          label="Answer short"
          name="answer_short"
          defaultValue="Temporary row for audit actor_id check."
          rows={2}
        />
        <TextAreaField label="Answer long" name="answer_long" rows={4} />
        <SelectField
          label="Audience"
          name="audience"
          options={audienceValues}
          defaultValue="both"
          required
        />
        <SelectField
          label="Topic"
          name="topic"
          options={topicValues}
          defaultValue="basics"
          required
        />
        <FormField label="Ask count" name="ask_count" type="number" defaultValue={0} />
        <SelectField
          label="Is generated"
          name="is_generated"
          options={[
            { value: "false", label: "false" },
            { value: "true", label: "true" },
          ]}
          defaultValue="false"
        />
        <FormField label="Sort order" name="sort_order" type="number" defaultValue={9999} />
        <SelectField
          label="Confidence"
          name="confidence"
          options={confidenceValues}
          defaultValue="unverified"
          required
        />
        <SelectField
          label="State"
          name="state"
          options={publishStateValues}
          defaultValue="draft"
          required
        />
        <SelectField
          label="Source"
          name="source_id"
          options={[
            { value: "", label: "— none —" },
            ...(sources ?? []).map((s) => ({ value: s.id, label: s.label })),
          ]}
        />
      </AdminForm>
    </div>
  );
}
