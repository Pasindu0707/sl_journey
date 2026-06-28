/** @type {import('next').NextConfig} */

// GitHub Pages serves this project site from https://<user>.github.io/sl_journeys/
// so in production every route and asset must be prefixed with the repo name.
const basePath = process.env.NODE_ENV === "production" ? "/sl_journeys" : "";

const nextConfig = {
  reactStrictMode: true,
  output: "export", // emit a fully static site into ./out
  images: { unoptimized: true }, // no Image Optimization server on Pages
  basePath,
  assetPrefix: basePath,
  trailingSlash: true, // emit /about/index.html so static hosts resolve cleanly
  env: { NEXT_PUBLIC_BASE_PATH: basePath }, // exposed to <img>/href helpers
};

export default nextConfig;
