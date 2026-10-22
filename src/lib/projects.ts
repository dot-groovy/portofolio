import fs from "fs";
import path from "path";
import { Project } from "@/types";

// Caminho absoluto para o ficheiro JSON com os dados dos projetos.
const DATA_PATH = path.join(process.cwd(), "data", "projects.json");

/**
 * Lê o ficheiro `data/projects.json` e devolve todos os projetos
 * ordenados por data, do mais recente para o mais antigo.
 */
export function getProjects(): Project[] {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  const projects: Project[] = JSON.parse(raw);
  return projects.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Procura um projeto pelo seu `id`.
 * Devolve `undefined` se não existir.
 */
export function getProjectById(id: string): Project | undefined {
  return getProjects().find((p) => p.id === id);
}

/**
 * Agrupa uma lista de projetos pelo ano da sua data.
 * Devolve um objeto no formato `{ "2026": [...], "2025": [...] }`.
 */
export function groupByYear(projects: Project[]): Record<string, Project[]> {
  return projects.reduce(
    (acc, project) => {
      const year = new Date(project.date).getFullYear().toString();
      if (!acc[year]) acc[year] = [];
      acc[year].push(project);
      return acc;
    },
    {} as Record<string, Project[]>
  );
}
