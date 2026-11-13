import { experiences } from "@/data/portfolio";

function startMonth(period: string) {
  const start = /^(\d{4})\.(\d{2})\b/.exec(period);
  return start ? Number(start[1]) * 100 + Number(start[2]) : 0;
}

export const orderedExperiences = experiences
  .map((experience, index) => ({
    experience,
    index,
    routeId: experience.id ?? String(index),
    start: startMonth(experience.period),
  }))
  .sort((a, b) => b.start - a.start || a.index - b.index);

export function findExperience(routeId?: string) {
  if (routeId === undefined) return undefined;
  return (
    experiences.find(experience => experience.id === routeId) ??
    (/^\d+$/.test(routeId) ? experiences[Number(routeId)] : undefined)
  );
}
