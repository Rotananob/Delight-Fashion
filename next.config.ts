import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "172.20.10.2",
    "172.20.10.2:3000",
    "localhost",
    "localhost:3000"
  ],
  images: {
    unoptimized: true
  }
};

export default withSerwist(nextConfig);
