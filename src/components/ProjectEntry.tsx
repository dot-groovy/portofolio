import Link from "next/link";
import { Project } from "@/types";

interface Props {
  project: Project;
  index: number;
}

export default function ProjectEntry({ project, index }: Props) {
  const date = new Date(project.date);
  const formatted = date
    .toLocaleDateString("en-US", { month: "short", day: "2-digit" })
    .toLowerCase();

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
