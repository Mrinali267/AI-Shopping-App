import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev server only fully trusts the "localhost" host by default; without
  // this, loading the app via 127.0.0.1 silently breaks client hydration
  // data streaming (page shell renders, but effects/fetches never run).
  allowedDevOrigins: ["127.0.0.1"],
  // Docker needs a standalone bundle, but Vercel's Next.js adapter owns the
  // deployment output and Next.js 16.3 standalone builds can miss its NFT file.
  // Keep standalone output for Docker and leave Vercel's build output alone.
  output: process.env.VERCEL ? undefined : "standalone",
};

export default nextConfig;
