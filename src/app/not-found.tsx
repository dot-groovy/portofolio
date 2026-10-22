import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * Página 404. Mostrada quando a rota não existe ou `notFound()` é chamado.
 */
export default function NotFound() {
  return (
    <div className="page-wrapper">
      <Header />
      <main className="main-content">
        <div className="not-found fade-in">
          <h1>404</h1>
          <p>
            Nothing here. <Link href="/">Go back</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
