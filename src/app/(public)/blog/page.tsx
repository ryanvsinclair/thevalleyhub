import Link from "next/link";
import type { Metadata } from "next";

import { listPublishedPosts } from "@/lib/queries/posts";

export const metadata: Metadata = {
  title: "Blog",
};

export default async function BlogIndexPage() {
  const posts = await listPublishedPosts();

  return (
    <div>
      <h1 className="font-serif text-3xl tracking-tight text-neutral-900">
        Blog
      </h1>
      <p className="mt-2 max-w-2xl text-neutral-600">
        Notes and updates about The Valley when there is something worth
        publishing.
      </p>

      {posts.length === 0 ? (
        <p className="mt-10 text-sm text-neutral-500">
          No posts published yet.
        </p>
      ) : (
        <ul className="mt-10 divide-y divide-neutral-200 border-t border-neutral-200">
          {posts.map((post) => (
            <li key={post.id} className="py-5">
              <Link
                href={`/blog/${post.slug}`}
                className="text-lg font-medium text-neutral-900 underline-offset-4 hover:underline"
              >
                {post.title}
              </Link>
              {post.published_at ? (
                <p className="mt-1 text-sm text-neutral-500">
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    timeZone: "Asia/Dubai",
                  }).format(new Date(post.published_at))}
                </p>
              ) : null}
              {post.excerpt ? (
                <p className="mt-2 max-w-2xl text-sm text-neutral-600">
                  {post.excerpt}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
