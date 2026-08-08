import Link from "next/link";
import type { Metadata } from "next";

import { WhatsOpenNow } from "@/components/content/WhatsOpenNow";
import { JsonLd } from "@/components/seo/JsonLd";
import { listPublishedClusters } from "@/lib/queries/clusters";
import { listInCommunityPlaces } from "@/lib/queries/places";
import { listDeliveredClusterStatus } from "@/lib/queries/status";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

const homeMeta = buildPageMetadata({
  title: "Valley",
  description:
    "Independent answers for The Valley, Dubai — what is built, what is specified, and what nobody else will say plainly.",
  path: "/",
});

export const metadata: Metadata = {
  ...homeMeta,
  title: { absolute: "Valley" },
};

export default async function HomePage() {
  const [clusters, delivered, inCommunity] = await Promise.all([
    listPublishedClusters(),
    listDeliveredClusterStatus(),
    listInCommunityPlaces(),
  ]);

  return (
    <div>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }])} />
      <section className="min-h-[70vh] border-b border-neutral-200 pb-16">
        <p className="font-serif text-5xl tracking-tight text-neutral-900 sm:text-6xl md:text-7xl">
          Valley
        </p>
        <h1 className="mt-6 max-w-2xl text-2xl font-medium tracking-tight text-neutral-800 sm:text-3xl">
          Independent answers for The Valley, Dubai.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-600">
          What is built, what is specified, and what nobody else will say plainly —
          with sources and confidence on every fact.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/questions"
            className="inline-flex h-10 items-center rounded-sm bg-neutral-900 px-4 text-sm text-white hover:bg-neutral-800"
          >
            Browse questions
          </Link>
          <Link
            href="/clusters"
            className="inline-flex h-10 items-center rounded-sm border border-neutral-300 px-4 text-sm text-neutral-900 hover:bg-white/70"
          >
            View clusters
          </Link>
        </div>
      </section>

      <section className="grid gap-10 py-12 md:grid-cols-3">
        <div>
          <h2 className="text-sm font-medium tracking-wide text-neutral-500 uppercase">
            Published clusters
          </h2>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{clusters.length}</p>
          <p className="mt-2 text-sm text-neutral-600">
            From Eden through Farm Grove — specs only when Doc 1 has them.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-medium tracking-wide text-neutral-500 uppercase">
            Delivered handovers
          </h2>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{delivered.length}</p>
          <p className="mt-2 text-sm text-neutral-600">
            Status log rows for clusters confirmed delivered.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-medium tracking-wide text-neutral-500 uppercase">
            In-community services
          </h2>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{inCommunity.length}</p>
          <p className="mt-2 text-sm text-neutral-600">
            Clinic, pharmacies, nursery, grocery, fuel, mosque.
          </p>
        </div>
      </section>

      <WhatsOpenNow />
    </div>
  );
}
