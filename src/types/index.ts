export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  url?: string;
  github?: string;
  image?: string;
}
