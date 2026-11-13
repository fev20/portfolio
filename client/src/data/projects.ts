import type { FileProtection } from "@/utils/auth";
import projectData from "./projects.json";

export type ProjectFile = {
  type?: "file";
  name: string;
  url: string;
  protection?: FileProtection;
};

export type ProjectFolder = {
  type: "folder";
  name: string;
  files: ProjectEntry[];
};

export type ProjectEntry = ProjectFile | ProjectFolder;
export type ProjectPhoto = string | { src: string; alt: string };
export type ProjectVideo = {
  sourceType: "file" | "youtube";
  src: string;
  title: string;
  description?: string;
  thumbnail?: string;
};

export type Project = {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  links: { site?: string; github?: string; report?: string };
  color?: string;
  organization?: string;
  role?: string;
  period?: string;
  status?: string;
  files?: ProjectEntry[];
  photos?: ProjectPhoto[];
  videos?: ProjectVideo[];
  sections?: { title: string; paragraphs?: string[]; items?: string[] }[];
};

// JSON inference widens file protection and folder type strings.
export const projects = projectData as Project[];

export function useProjects() {
  return projects;
}
