import type { NextConfig } from "next";

function supabaseHostname(): string | null {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return null;
  try {
    return new URL(raw).hostname;
  } catch {
    return null;
  }
}

const supabaseHost = supabaseHostname();

if (!supabaseHost) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL must be set so images.remotePatterns can allow the Storage host",
  );
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHost,
        pathname: "/storage/v1/object/public/media/**",
      },
    ],
  },
};

export default nextConfig;
