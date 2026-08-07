import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MarkdownBody } from "@/components/content/MarkdownBody";
import {
  getPublishedPostBySlug,
  listPublishedPostSlugs,
} from "@/lib/queries/posts";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await listPublishedPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Blog" };
  return {
    title: post.meta_title ?? post.title,
    description: post.meta_description ?? post.excerpt ?? undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  return (
    <article>
      <header className="border-b border-neutral-200 pb-8">
        <h1 className="font-serif text-3xl tracking-tight text-neutral-900">
          {post.title}
        </h1>
        {post.published_at ? (
          <p className="mt-3 text-sm text-neutral-500">
            {new Intl.DateTimeFormat("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
              timeZone: "Asia/Dubai",
            }).format(new Date(post.published_at))}
          </p>
        ) : null}
        {post.excerpt ? (
          <p className="mt-4 max-w-2xl text-neutral-700">{post.excerpt}</p>
        ) : null}
      </header>

      {post.body ? (
        <section className="mt-8">
          <MarkdownBody content={post.body} />
        </section>
      ) : null}
    </article>
  );
}
