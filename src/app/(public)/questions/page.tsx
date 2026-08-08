import Link from "next/link";
import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/JsonLd";
import { listPublishedQuestions } from "@/lib/queries/questions";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Questions",
  description:
    "Straight answers for people looking at The Valley and people who live here.",
  path: "/questions",
});

type Props = {
  searchParams: Promise<{ audience?: string }>;
};

function audienceFromParam(
  value: string | undefined,
): "prospect" | "resident" | undefined {
  if (value === "prospect" || value === "resident") return value;
  return undefined;
}

export default async function QuestionsPage({ searchParams }: Props) {
  const { audience: raw } = await searchParams;
  const audience = audienceFromParam(raw);
  const questions = await listPublishedQuestions(audience);

  return (
    <div>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Questions", path: "/questions" },
        ])}
      />
      <h1 className="font-serif text-3xl tracking-tight text-neutral-900">
        Questions
      </h1>
      <p className="mt-2 max-w-2xl text-neutral-600">
        Straight answers for people looking at The Valley and people who live
        here.
      </p>

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link
          href="/questions"
          className={
            audience === undefined
              ? "text-neutral-900 underline underline-offset-4"
              : "text-neutral-600 hover:text-neutral-900"
          }
        >
          All
        </Link>
        <Link
          href="/questions?audience=prospect"
          className={
            audience === "prospect"
              ? "text-neutral-900 underline underline-offset-4"
              : "text-neutral-600 hover:text-neutral-900"
          }
        >
          Prospect
        </Link>
        <Link
          href="/questions?audience=resident"
          className={
            audience === "resident"
              ? "text-neutral-900 underline underline-offset-4"
              : "text-neutral-600 hover:text-neutral-900"
          }
        >
          Resident
        </Link>
      </div>

      <ul className="mt-10 divide-y divide-neutral-200 border-t border-neutral-200">
        {questions.map((question) => (
          <li key={question.id} className="py-4">
            <Link
              href={`/questions/${question.slug}`}
              className="text-base font-medium text-neutral-900 underline-offset-4 hover:underline"
            >
              {question.question}
            </Link>
            <p className="mt-1 text-xs tracking-wide text-neutral-500 uppercase">
              {question.topic}
              {question.audience !== "both" ? ` · ${question.audience}` : null}
            </p>
          </li>
        ))}
      </ul>

      {questions.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">
          No published questions for this audience.
        </p>
      ) : null}
    </div>
  );
}
