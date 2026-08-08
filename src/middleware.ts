import { NextResponse, type NextRequest } from "next/server";

import { createAnonClient } from "@/lib/supabase/anon";

/**
 * Reads public `redirects` rows (RLS: anon select) and issues redirects.
 * Uses cookie-less anon client — safe on Edge; no service role.
 */
export async function middleware(request: NextRequest) {
  const fromPath = request.nextUrl.pathname;

  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("redirects")
      .select("to_path, status_code")
      .eq("from_path", fromPath)
      .maybeSingle();

    if (error || !data) {
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
