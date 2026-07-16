/** @type {import('next').NextConfig} */

// The site is served from the root of the custom domain (sljourney.com), so the
// base path is empty by default. Only set NEXT_PUBLIC_BASE_PATH if deploying
// back to a project subpath such as <user>.github.io/sl_journeys.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig = {
  reactStrictMode: true,
  output: "export", // emit a fully static site into ./out
  images: { unoptimized: true }, // no Image Optimization server on Pages
  basePath,
  assetPrefix: basePath,
  trailingSlash: true, // emit /about/index.html so static hosts resolve cleanly
};

export default nextConfig;
