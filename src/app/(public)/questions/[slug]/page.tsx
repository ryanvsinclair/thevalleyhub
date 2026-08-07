import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MarkdownBody } from "@/components/content/MarkdownBody";
import { VerifiedBadge } from "@/components/content/VerifiedBadge";
import {
  getPublishedQuestionBySlug,
  listPublishedQuestionSlugs,
} from "@/lib/queries/questions";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await listPublishedQuestionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const question = await getPublishedQuestionBySlug(slug);
  if (!question) return { title: "Question" };
  return {
    title: question.meta_title ?? question.question,
    description: question.meta_description ?? question.answer_short ?? undefined,
  };
}

export default async function QuestionDetailPage({ params }: Props) {
  const { slug } = await params;
  const question = await getPublishedQuestionBySlug(slug);
  if (!question) notFound();

  return (
    <article>
      <header className="border-b border-neutral-200 pb-8">
        <p className="text-xs tracking-wide text-neutral-500 uppercase">
          {question.topic}
        </p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight text-neutral-900">
          {question.question}
        </h1>
        <div className="mt-3">
          <VerifiedBadge verifiedAt={question.verified_at} />
        </div>
      </header>

      {question.is_generated ? (
        <section className="mt-8 max-w-2xl space-y-4 text-neutral-700">
          <p>
            This answer is computed from published place hours (Dubai time), not
            a fixed write-up. Hours can change; treat it as a snapshot of what
            the data currently says.
          </p>
          <p>
            See{" "}
            <Link
              href="/"
              className="text-neutral-900 underline underline-offset-4"
            >
              What&apos;s open now
            </Link>{" "}
            on the home page for the live list derived from those hours.
          </p>
        </section>
      ) : (
        <section className="mt-8 space-y-6">
          {question.answer_short ? (
            <p className="max-w-2xl text-lg leading-relaxed text-neutral-900">
              {question.answer_short}
            </p>
          ) : (
            <p className="text-sm text-neutral-500">
              No short answer is published for this question.
            </p>
          )}
          {question.answer_long ? (
            <MarkdownBody content={question.answer_long} />
          ) : null}
        </section>
      )}
    </article>
  );
}
