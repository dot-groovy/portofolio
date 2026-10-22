import { Project } from "@/types";
import { groupByYear } from "@/lib/projects";
import ProjectEntry from "./ProjectEntry";

interface Props {
  projects: Project[];
}

/**
 * Timeline de projetos agrupados por ano (do mais recente para o mais antigo).
 * Renderiza um `ProjectEntry` por projeto.
 */
export default function Timeline({ projects }: Props) {
  const grouped = groupByYear(projects);
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  // Contador global para a animação escalonada, contínuo entre anos.
  let globalIndex = 1;

  return (
    <section>
      {years.map((year) => (
        <div key={year} className="year-group">
          <div className="year-label">{year}</div>
          {grouped[year].map((project) => {
            const idx = globalIndex++;
            return <ProjectEntry key={project.id} project={project} index={idx} />;
          })}
        </div>
      ))}
    </section>
  );
}
