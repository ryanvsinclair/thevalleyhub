import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description:
    "Valley is an independent community resource for The Valley, Dubai. Not affiliated with Emaar Properties.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <article className="max-w-2xl">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <h1 className="font-serif text-3xl tracking-tight text-neutral-900">
        About
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-neutral-800">
        Valley is an independent community resource for The Valley, Dubai. It is
        not affiliated with Emaar Properties.
      </p>

      <section className="mt-10 space-y-4 text-neutral-700">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
          Methodology
        </h2>
        <p className="leading-relaxed">
          Facts on this site come from verified sources — developer and land
          department material, operator statements, and corroborating public
          records — not from broker marketing copy. Every raw numeric or
          specification field carries a confidence level.
        </p>
        <p className="leading-relaxed">
          Values marked unverified are hidden at render. Approved positioning
          and question answers may still appear where the source document has
          cleared them for publication. Where sources conflict, the field is
          left empty rather than guessed.
        </p>
        <p className="leading-relaxed">
          Honest negatives stay in the answers: what is missing, unfinished, or
          farther than the brochure implies. Masterplan amenity operational
          status is treated as unknown until confirmed on the ground.
        </p>
      </section>

      <section className="mt-10 space-y-4 text-neutral-700">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
          Editor
        </h2>
        <p className="leading-relaxed">
          Maintained by an independent editor. No developer sponsorship, no
          listing fees, no invented biography.
        </p>
      </section>
    </article>
  );
}
