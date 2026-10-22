import Link from "next/link";

/**
 * Cabeçalho do site. Mostra o logótipo com link para a página inicial.
 */
export default function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="site-logo">
        portfolio.
      </Link>
    </header>
  );
}
