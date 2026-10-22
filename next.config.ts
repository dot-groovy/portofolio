import type { NextConfig } from "next";

// Nome do repositório no GitHub (URL: https://dot-groovy.github.io/portofolio/).
const repo = "portofolio";
const isGhPages = process.env.GITHUB_PAGES === "true";

// Configuração do Next.js.
const nextConfig: NextConfig = {
  devIndicators: false,
  ...(isGhPages
    ? {
        output: "export",
        basePath: `/${repo}`,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
