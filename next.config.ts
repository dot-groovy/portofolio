import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Nome do repositório no GitHub (URL: https://dot-groovy.github.io/portofolio.ts/).
const repo = "portofolio.ts";
const isGhPages = process.env.GITHUB_PAGES === "true";

// Configuração do Next.js.
const basePath = isGhPages ? `/${repo}` : "";

const nextConfig: NextConfig = {
  devIndicators: false,
  outputFileTracingRoot: path.join(__dirname),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
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
