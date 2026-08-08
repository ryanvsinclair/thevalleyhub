import Link from "next/link";

import { AdminTable } from "@/components/admin/fields";
import { createClient } from "@/lib/supabase/server";

export default async function AdminQuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("questions")
    .select("id, slug, question, topic, state, confidence, verified_at")
    .is("deleted_at", null)
    .order("sort_order")
    .order("slug");

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Questions</h1>
          <p className="mt-2 text-neutral-600">Create and edit Q&A entries.</p>
        </div>
        <Link
          href="/admin/questions/new"
          className="rounded-sm bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-neutral-800"
        >
          New question
        </Link>
      </div>
      {message ? (
        <p className="mt-4 rounded-sm border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 text-sm text-red-700">{error.message}</p>
      ) : (
        <AdminTable
          headers={["Question", "Topic", "State", "Confidence", ""]}
        >
          {(data ?? []).map((row) => (
            <tr key={row.id}>
              <td className="px-3 py-2">
                <div className="font-medium text-neutral-900">{row.question}</div>
                <div className="font-mono text-xs text-neutral-500">
                  {row.slug}
                </div>
              </td>
              <td className="px-3 py-2">{row.topic}</td>
              <td className="px-3 py-2">{row.state}</td>
              <td className="px-3 py-2">{row.confidence}</td>
              <td className="px-3 py-2 text-right">
                <Link
                  href={`/admin/questions/${row.id}`}
                  className="text-sm underline underline-offset-2"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  );
}
