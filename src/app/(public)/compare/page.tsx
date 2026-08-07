import Link from "next/link";
import type { Metadata } from "next";

import { listPublishedCommunities } from "@/lib/queries/communities";

export const metadata: Metadata = {
  title: "Compare",
};

export default async function CompareIndexPage() {
  const communities = await listPublishedCommunities();

  return (
    <div>
      <h1 className="font-serif text-3xl tracking-tight text-neutral-900">
        Compare
      </h1>
      <p className="mt-2 max-w-2xl text-neutral-600">
        How The Valley stacks up against nearby communities — by dimension, with
        an honest read.
      </p>

      <ul className="mt-10 divide-y divide-neutral-200 border-t border-neutral-200">
        {communities.map((community) => (
          <li key={community.id} className="py-5">
            <Link
              href={`/compare/${community.slug}`}
              className="text-lg font-medium text-neutral-900 underline-offset-4 hover:underline"
            >
              {community.name}
            </Link>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-600">
              {community.developer ? <span>{community.developer}</span> : null}
            </div>
            {community.summary ? (
              <p className="mt-2 max-w-2xl text-sm text-neutral-600">
                {community.summary}
              </p>
            ) : null}
          </li>
        ))}
      </ul>

      {communities.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">
          No published communities to compare yet.
        </p>
      ) : null}
    </div>
  );
}
