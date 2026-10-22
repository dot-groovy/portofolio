# Portfolio - TypeScript
Essa estrutura é a BASE do portofolio
Portfolio simples e rapida exploracao. Em TypeScript com Next.js.

## Iniciar o Projeto

```bash
npm install
npm run dev
```

## Publicar no GitHub Pages

1. Faz push para a branch `main` (o workflow `.github/workflows/deploy-pages.yml` faz o build e deploy).
2. No GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Site público: **https://dot-groovy.github.io/portofolio/** (o repo no GitHub tem de chamar-se `portofolio`).

Para testar o build estático localmente:

```bash
npm run build:pages
```

Os ficheiros gerados ficam em `out/`.
