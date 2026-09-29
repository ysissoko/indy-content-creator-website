import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow feed/recipe/partner images hosted on external https URLs.
    // Local /public images work without any config.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  // Keystatic's reader loads content/** from disk at runtime. Those files are
  // not imported anywhere, so the tracer leaves them out of the serverless
  // bundle and dynamic routes (e.g. /api/contact) silently fall back to the
  // defaults in src/config/site.ts. The site now lives under app/[lang], so
  // the "/*" key from before no longer matches — trace both segments.
  outputFileTracingIncludes: {
    "/[lang]": ["./content/**/*"],
    "/api/*": ["./content/**/*"],
  },
};

export default nextConfig;
