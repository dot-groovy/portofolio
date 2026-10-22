import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Nome do repositório no GitHub (URL: https://dot-groovy.github.io/portofolio/).
const repo = "portofolio";
const isGhPages = process.env.GITHUB_PAGES === "true";

// Configuração do Next.js.
const nextConfig: NextConfig = {
  devIndicators: false,
  outputFileTracingRoot: path.join(__dirname),
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
