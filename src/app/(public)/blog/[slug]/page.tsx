import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MarkdownBody } from "@/components/content/MarkdownBody";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getPublishedPostBySlug,
  listPublishedPostSlugs,
} from "@/lib/queries/posts";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

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
  return buildPageMetadata({
    title: post.meta_title ?? post.title,
    description: post.meta_description ?? post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  return (
    <article>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          articleJsonLd(post),
        ]}
      />
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
