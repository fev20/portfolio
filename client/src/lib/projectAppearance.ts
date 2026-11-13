import type { Project } from "@/data/projects";

export const PROJECT_CATEGORY_ORDER = [
  "Security Research",
  "CTF & Security Activities",
  "Security Education",
  "Interactive Web Projects",
  "Embedded & Hardware Security",
  "Leadership & Community",
] as const;

const PROJECT_APPEARANCES = [
  {
    accent: "var(--sage-deep)",
    soft: "var(--sage-soft)",
    bright: "var(--sage-bright)",
    number: "color-mix(in srgb, var(--sage) 80%, var(--sage-bright))",
    outline: "color-mix(in srgb, var(--sage-deep) 65%, var(--sage-bright))",
  },
  {
    accent: "var(--rose-deep)",
    soft: "var(--rose-soft)",
    bright: "var(--rose-bright)",
    number: "color-mix(in srgb, var(--rose) 80%, var(--rose-bright))",
    outline: "color-mix(in srgb, var(--rose-deep) 65%, var(--rose-bright))",
  },
] as const;

export function getProjectCategoryAppearance(category: string) {
  const index = PROJECT_CATEGORY_ORDER.findIndex(item => item === category);
  return PROJECT_APPEARANCES[index % 2 === 1 ? 1 : 0];
}

export function getProjectCategoryAccent(category: string): string {
  return getProjectCategoryAppearance(category).accent;
}

export function getProjectAppearance(project: Project | undefined) {
  return getProjectCategoryAppearance(project?.category ?? "");
}

export function getProjectAccent(project: Project | undefined): string {
  return getProjectAppearance(project).accent;
}
