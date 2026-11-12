import type { NextConfig } from "next";
import "./scripts/patch-mkdir.js";

/**
 * Static export configuration - `npm run build` emits a fully static site in ./out
 * that can be uploaded to ANY static host (GitHub Pages, Netlify, Vercel, S3, cPanel…).
 * The dev server (`npm run dev`) ignores `output: "export"` and works normally.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
};

export default nextConfig;

