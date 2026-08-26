import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development", // typically disable in dev to prevent caching issues, but we can enable it if we want to test
});

const nextConfig: NextConfig = {
  images: {
    unoptimized: true
  }
};

export default withSerwist(nextConfig);
