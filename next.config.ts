import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow feed/recipe/partner images hosted on external https URLs.
    // Local /public images work without any config.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
