import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(isGithubPages && {
    basePath: "/playground",
    assetPrefix: "/playground",
  }),
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@nw/widget-core", "@nw/widgets", "@nw/ui"],
};

export default nextConfig;
