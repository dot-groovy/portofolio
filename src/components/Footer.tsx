/**
 * Rodapé do site. Marca "original" e links para GitHub e LinkedIn.
 */
export default function Footer() {
  return (
    <footer className="site-footer">
      <span className="site-meta site-meta--sm">ORIGINAL</span>
      <div className="footer-links">
        <a
          href="https://github.com/dot-groovy"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      </div>
    </footer>
  );
}
