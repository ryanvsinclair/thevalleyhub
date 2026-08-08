import { notFound } from "next/navigation";

import { AdminForm } from "@/components/admin/AdminForm";
import {
  FormField,
  SelectField,
  TextAreaField,
} from "@/components/admin/fields";
import { deleteQuestion, updateQuestion } from "@/lib/admin/actions";
import {
  audienceValues,
  confidenceValues,
  publishStateValues,
  topicValues,
} from "@/lib/schema";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

export default async function AdminQuestionEditPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: question }, { data: sources }] = await Promise.all([
    supabase.from("questions").select("*").eq("id", id).maybeSingle(),
    supabase.from("sources").select("id, label").order("label"),
  ]);

  if (!question) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Edit question</h1>
      <p className="mt-2 font-mono text-xs text-neutral-500">{question.id}</p>

      <AdminForm action={updateQuestion}>
        <input type="hidden" name="id" value={question.id} />
        <FormField label="Slug" name="slug" defaultValue={question.slug} required />
        <TextAreaField
          label="Question"
          name="question"
          defaultValue={question.question}
          rows={2}
          required
        />
        <TextAreaField
          label="Answer short"
          name="answer_short"
          defaultValue={question.answer_short}
          rows={3}
        />
        <TextAreaField
          label="Answer long"
          name="answer_long"
          defaultValue={question.answer_long}
          rows={8}
        />
        <SelectField
          label="Audience"
          name="audience"
          options={audienceValues}
          defaultValue={question.audience}
          required
        />
        <SelectField
          label="Topic"
          name="topic"
          options={topicValues}
          defaultValue={question.topic}
          required
        />
        <FormField
          label="Cluster id"
          name="cluster_id"
          defaultValue={question.cluster_id}
        />
        <FormField
          label="Place id"
          name="place_id"
          defaultValue={question.place_id}
        />
        <FormField
          label="Ask count"
          name="ask_count"
          type="number"
          defaultValue={question.ask_count}
        />
        <SelectField
          label="Is generated"
          name="is_generated"
          options={[
            { value: "false", label: "false" },
            { value: "true", label: "true" },
          ]}
          defaultValue={String(question.is_generated)}
        />
        <FormField
          label="Meta title"
          name="meta_title"
          defaultValue={question.meta_title}
        />
        <TextAreaField
          label="Meta description"
          name="meta_description"
          defaultValue={question.meta_description}
          rows={2}
        />
        <FormField
          label="Sort order"
          name="sort_order"
          type="number"
          defaultValue={question.sort_order}
        />
        <SelectField
          label="Confidence"
          name="confidence"
          options={confidenceValues}
          defaultValue={question.confidence}
          required
        />
        <SelectField
          label="Source"
          name="source_id"
          options={(sources ?? []).map((s) => ({
            value: s.id,
            label: s.label,
          }))}
          defaultValue={question.source_id}
          allowEmpty
        />
        <FormField
          label="Verified at"
          name="verified_at"
          type="date"
          defaultValue={question.verified_at}
        />
        <SelectField
          label="State"
          name="state"
          options={publishStateValues}
          defaultValue={question.state}
          required
        />
      </AdminForm>

      <form action={deleteQuestion} className="mt-10 max-w-2xl border-t border-neutral-200 pt-6">
        <input type="hidden" name="id" value={question.id} />
        <p className="text-sm text-neutral-600">
          Hard-delete this row (use for Gate 5 cleanup).
        </p>
        <button
          type="submit"
          className="mt-3 rounded-sm border border-red-300 px-3 py-2 text-sm text-red-800 hover:bg-red-50"
        >
          Delete question
        </button>
      </form>
    </div>
  );
}
