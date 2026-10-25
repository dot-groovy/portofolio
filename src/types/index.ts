/**
 * Representa um projeto do portfólio.
 * Os campos `url`, `github`, `image`, `images` e `video` são opcionais.
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  url?: string;
  github?: string;
  /** Imagem única (legado). Preferir `images` para galeria com slide. */
  image?: string;
  /** Caminhos em `public/` para o carrossel (ex.: `/images/projeto/1.png`). */
  images?: string[];
  /** Caminho em `public/` (ex.: `/videos/demo.mp4`). */
  video?: string;
}
