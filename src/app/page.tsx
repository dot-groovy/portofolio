import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Timeline from "@/components/Timeline";
import { getProjects } from "@/lib/projects";

/**
 * Página inicial. Carrega todos os projetos e mostra-os numa timeline,
 * com um texto de introdução e a contagem total.
 */
export default function Home() {
  const projects = getProjects();

  return (
    <div className="page-wrapper">
      <Header />
      <main className="main-content">
        <div className="timeline-intro fade-in">
          <h1>
            A collection of things I&apos;ve built, explored, and shipped.
          </h1>
          <p>{projects.length} projects</p>
        </div>
        <Timeline projects={projects} />
      </main>
      <Footer />
    </div>
  );
}
