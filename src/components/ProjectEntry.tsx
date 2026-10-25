import Link from "next/link";
import { Project } from "@/types";

interface Props {
  project: Project;
  index: number;
}

/**
 * Item individual da timeline. Mostra data, título, descrição e tags
 * de um projeto, com link para a sua página de detalhe.
 * O `index` controla o atraso da animação de entrada (stagger).
 */
export default function ProjectEntry({ project, index }: Props) {
  // Formata a data como "mmm yyyy" (ex.: "may 2026").
  const date = new Date(project.date);
  const formatted = date
    .toLocaleDateString("en-US", { month: "short", year: "numeric" })
    .toLowerCase();

  // Só os primeiros 8 itens têm animação escalonada.
  const staggerClass = index <= 8 ? `stagger-${index}` : "";

  return (
    <Link href={`/project/${project.id}`}>
      <article className={`project-entry fade-in ${staggerClass}`}>
        <span className="project-date">{formatted}</span>
        <div className="project-body">
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <div className="project-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="project-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
