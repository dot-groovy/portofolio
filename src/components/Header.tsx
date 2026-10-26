import Link from "next/link";

/**
 * Cabeçalho do site. Navegação principal (portfolio / about) em coluna.
 */
export default function Header() {
  return (
    <header className="site-header">
      <nav className="site-nav site-nav--stacked" aria-label="Main">
        <Link href="/">portfolio.</Link>
        <Link href="/about">about.</Link>
      </nav>
    </header>
  );
}
