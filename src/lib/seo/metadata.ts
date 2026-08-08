import type { Metadata } from "next";

import { absoluteUrl, getSiteUrl } from "@/lib/seo/site";

type BuildPageMetadataInput = {
  title: string;
  description?: string | null;
  path: string;
  image?: string | null;
  type?: "website" | "article";
};

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: BuildPageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const desc = description?.trim() || undefined;
  const images = image ? [{ url: image }] : undefined;

  return {
    title,
    description: desc,
    metadataBase: new URL(getSiteUrl()),
    alternates: { canonical: url },
    openGraph: {
      title,
      description: desc,
      url,
      siteName: "Valley",
      type,
      images,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description: desc,
      images: image ? [image] : undefined,
    },
  };
}
