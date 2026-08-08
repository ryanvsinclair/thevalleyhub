import type { MetadataRoute } from "next";

import { listPublishedClusters } from "@/lib/queries/clusters";
import { listPublishedCommunities } from "@/lib/queries/communities";
import { LIVING_CATEGORIES } from "@/lib/queries/places";
import { listPublishedPlaces } from "@/lib/queries/places";
import { listPublishedPosts } from "@/lib/queries/posts";
import { listPublishedQuestions } from "@/lib/queries/questions";
import { absoluteUrl } from "@/lib/seo/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [clusters, places, questions, communities, posts] = await Promise.all([
    listPublishedClusters(),
    listPublishedPlaces(),
    listPublishedQuestions(),
    listPublishedCommunities(),
    listPublishedPosts(),
  ]);

  const staticPaths = [
    "/",
    "/clusters",
    "/living",
    ...LIVING_CATEGORIES.map((category) => `/living/${category}`),
    "/questions",
    "/compare",
    "/status",
    "/about",
    "/blog",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  return [
    ...staticEntries,
    ...clusters.map((cluster) => ({
      url: absoluteUrl(`/clusters/${cluster.slug}`),
      lastModified: new Date(cluster.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...places.map((place) => ({
      url: absoluteUrl(`/places/${place.slug}`),
      lastModified: new Date(place.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...questions.map((question) => ({
      url: absoluteUrl(`/questions/${question.slug}`),
      lastModified: new Date(question.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...communities.map((community) => ({
      url: absoluteUrl(`/compare/${community.slug}`),
      lastModified: new Date(community.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
