import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@nw/widget-core", "@nw/widgets", "@nw/ui"],
};

export default nextConfig;
