import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getPublishedCommunityBySlug,
  listComparisonsForCommunity,
  listPublishedCommunitySlugs,
} from "@/lib/queries/communities";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await listPublishedCommunitySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const community = await getPublishedCommunityBySlug(slug);
  if (!community) return { title: "Compare" };
  return {
    title: `${community.name} vs The Valley`,
    description: community.summary ?? undefined,
  };
}

export default async function CompareDetailPage({ params }: Props) {
  const { slug } = await params;
  const community = await getPublishedCommunityBySlug(slug);
  if (!community) notFound();

  const comparisons = await listComparisonsForCommunity(community.id);

  return (
    <article>
      <header className="border-b border-neutral-200 pb-8">
        <h1 className="font-serif text-3xl tracking-tight text-neutral-900">
          {community.name}
        </h1>
        {community.developer ? (
          <p className="mt-2 text-sm text-neutral-600">{community.developer}</p>
        ) : null}
        {community.summary ? (
          <p className="mt-4 max-w-2xl text-neutral-700">{community.summary}</p>
        ) : null}
      </header>

      {comparisons.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">
          No comparison dimensions published for this community.
        </p>
      ) : (
        <div className="mt-10 space-y-10">
          {comparisons.map((row) => (
            <section key={row.id}>
              <h2 className="text-lg font-semibold tracking-tight capitalize">
                {row.dimension.replaceAll("_", " ")}
              </h2>
              <div className="mt-4 grid gap-6 text-sm sm:grid-cols-2">
                {row.valley_advantage ? (
                  <div>
                    <h3 className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
                      The Valley
                    </h3>
                    <p className="mt-2 leading-relaxed text-neutral-800">
                      {row.valley_advantage}
                    </p>
                  </div>
                ) : null}
                {row.other_advantage ? (
                  <div>
                    <h3 className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
                      {community.name}
                    </h3>
                    <p className="mt-2 leading-relaxed text-neutral-800">
                      {row.other_advantage}
                    </p>
                  </div>
                ) : null}
              </div>
              {row.honest_read ? (
                <div className="mt-4 max-w-2xl">
                  <h3 className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
                    Honest read
                  </h3>
                  <p className="mt-2 leading-relaxed text-neutral-800">
                    {row.honest_read}
                  </p>
                </div>
              ) : null}
            </section>
          ))}
        </div>
      )}
    </article>
  );
}
