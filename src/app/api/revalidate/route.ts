import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

type Body = {
  path?: string;
  paths?: string[];
};

export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-secret");

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Body | null;
  const paths = [
    ...(body?.path ? [body.path] : []),
    ...(Array.isArray(body?.paths) ? body.paths : []),
  ].filter((p) => typeof p === "string" && p.startsWith("/"));

  if (paths.length === 0) {
    return NextResponse.json(
      { message: "Missing path or paths (must start with /)" },
      { status: 400 },
    );
  }

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: true, paths });
}
