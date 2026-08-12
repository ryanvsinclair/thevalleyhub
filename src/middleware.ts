import { NextResponse, type NextRequest } from "next/server";

import { createAnonClient } from "@/lib/supabase/anon";

type RedirectRow = {
  from_path: string;
  to_path: string;
  status_code: number;
};

const CACHE_TTL_MS = 120_000;

type CacheState = {
  expiresAt: number;
  byFrom: Map<string, RedirectRow>;
};

declare global {
  var __valleyRedirectCache: CacheState | undefined;
}

async function loadRedirectMap(): Promise<Map<string, RedirectRow>> {
  const now = Date.now();
  const cached = globalThis.__valleyRedirectCache;
  if (cached && cached.expiresAt > now) {
    return cached.byFrom;
  }

  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("redirects")
    .select("from_path, to_path, status_code");

  const byFrom = new Map<string, RedirectRow>();
  if (!error && data) {
    for (const row of data) {
      byFrom.set(row.from_path, row as RedirectRow);
    }
  }

  globalThis.__valleyRedirectCache = {
    expiresAt: now + CACHE_TTL_MS,
    byFrom,
  };

  return byFrom;
}

/**
 * Reads public `redirects` rows (RLS: anon select) and issues redirects.
 * Uses cookie-less anon client — safe on Edge; no service role.
 * Map is cached in-process for CACHE_TTL_MS (Doc 4 #13).
 */
export async function middleware(request: NextRequest) {
  const fromPath = request.nextUrl.pathname;

  try {
    const byFrom = await loadRedirectMap();
    const data = byFrom.get(fromPath);

    if (!data) {
      return NextResponse.next();
    }

    const status = data.status_code as 301 | 302 | 308;
    if (data.to_path.startsWith("http://") || data.to_path.startsWith("https://")) {
      return NextResponse.redirect(data.to_path, status);
    }

    const url = request.nextUrl.clone();
    url.pathname = data.to_path.startsWith("/") ? data.to_path : `/${data.to_path}`;
    url.search = "";
    return NextResponse.redirect(url, status);
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
