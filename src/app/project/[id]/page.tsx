import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProjectById } from "@/lib/projects";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) notFound();

  const date = new Date(project.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="page-wrapper">
      <Header />
      <main className="main-content project-detail fade-in">
        <Link href="/" className="project-detail-back">
          &larr; back
        </Link>

        <h1>{project.title}</h1>

        <div className="project-detail-meta">
          <span>{date}</span>
          <span>{project.tags.join(" / ")}</span>
        </div>

        {project.image && (
          <div className="project-detail-image">
            <Image
              src={project.image}
              alt={project.title}
              width={720}
              height={400}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        )}

        <p className="project-detail-description">{project.description}</p>

        <div className="project-detail-links">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              Visit site
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              Source code
            </a>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
