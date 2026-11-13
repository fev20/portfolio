import { motion } from "framer-motion";
import AnimalBackground from "@/components/AnimalBackground";
import { useInView } from "framer-motion";
import { useRef, type CSSProperties } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Shield, Terminal, BookOpen, Globe, Settings, Cpu } from "lucide-react";
import { useProjects } from "@/data/projects";
import {
  PROJECT_CATEGORY_ORDER,
  getProjectAppearance,
  getProjectCategoryAppearance,
} from "@/lib/projectAppearance";

const CATEGORY_META: Record<
  string,
  { icon: React.ElementType; subtitle: string }
> = {
  "Security Research": {
    icon: Shield,
    subtitle: "연구/분석형",
  },
  "CTF & Security Activities": {
    icon: Terminal,
    subtitle: "보안 활동형",
  },
  "Security Education": {
    icon: BookOpen,
    subtitle: "교육/발표형",
  },
  "Interactive Web Projects": {
    icon: Globe,
    subtitle: "인터랙션/웹 제작형",
  },
  "Embedded & Hardware Security": {
    icon: Settings,
    subtitle: "하드웨어 실습형",
  },
  "Leadership & Community": {
    icon: Cpu,
    subtitle: "리더십/커뮤니티형",
  },
};

export default function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const projects = useProjects();

  const grouped = PROJECT_CATEGORY_ORDER.map(cat => ({
    category: cat,
    items: projects.filter(p => p.category === cat),
  }));

  return (
    <section id="projects" className="relative py-12 sm:py-16 lg:py-20" ref={ref}>
      <AnimalBackground animal="mouse" placement="projects" />
      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-7 sm:mb-9"
        >
          <span className="section-number">03.</span>
          <h2
            style={{
              letterSpacing: "normal",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 3vw, 2.6rem)",
              fontWeight: 800,
              color: "var(--ink)",
            }}
          >
            Projects
          </h2>
          <div
            className="flex-1 h-px"
            style={{
              background: "var(--line)",
              maxWidth: "200px",
            }}
          />
        </motion.div>

        {/* Category groups */}
        <div className="space-y-8 sm:space-y-10">
          {grouped.map((group, gi) => {
            const meta = CATEGORY_META[group.category];
            const Icon = meta.icon;
            const categoryAppearance = getProjectCategoryAppearance(
              group.category
            );
            const categoryAccent = categoryAppearance.accent;
            return (
              <motion.div
                key={group.category}
                id={`project-cat-${group.category.replace(/\s+/g, "-")}`}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: gi * 0.1 }}
              >
                {/* Category header */}
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center flex-shrink-0"
                    style={{
                      background: categoryAppearance.soft,
                      border: `1px solid ${categoryAppearance.bright}`,
                    }}
                  >
                    <Icon size={15} style={{ color: categoryAccent }} />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.65rem",
                          color: categoryAccent,
                        }}
                      >
                        {String(gi + 1).padStart(2, "0")}.
                      </span>
                      <h3
                        style={{
                          letterSpacing: "normal",
                          fontFamily: "var(--font-body)",
                          fontSize: "1.15rem",
                          fontWeight: 600,
                          color: categoryAccent,
                        }}
                      >
                        {group.category}
                      </h3>
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.7rem",
                        color: "var(--ink-secondary)",
                        marginTop: "2px",
                      }}
                    >
                      {meta.subtitle}
                    </p>
                  </div>
                  <div
                    className="flex-1 h-px ml-2"
                    style={{
                      background: categoryAppearance.outline,
                    }}
                  />
                </div>

                {/* Cards in this category */}
                {group.items.length === 0 ? (
                  <div
                    className="rounded-[var(--radius)] p-5"
                    style={{
                      border: "1px dashed var(--line)",
                      background: "var(--surface)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.72rem",
                        color: "var(--ink-secondary)",
                      }}
                    >
                      // 준비 중
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {group.items.map(project => {
                      const { accent, soft, bright, outline } = getProjectAppearance(project);
                      return (
                        <Link
                          key={project.id}
                          id={`project-${project.id}`}
                          data-project-id={project.id}
                          href={`/project/${encodeURIComponent(project.id)}`}
                          className="paper-card project-card group block min-w-0 rounded-[var(--radius)] p-4"
                          style={{ "--project-accent": accent, "--project-outline": outline } as CSSProperties}
                        >
                          <div className="flex items-start gap-2.5">
                            <span
                              aria-hidden="true"
                              className="mt-0.5 shrink-0 text-xs tabular-nums"
                              style={{ color: accent }}
                            >
                              {project.number}
                            </span>
                            <h3 className="min-w-0 flex-1 text-sm font-semibold leading-snug text-[var(--ink)] [overflow-wrap:anywhere] group-hover:text-[var(--project-accent)] sm:text-base">
                              {project.title}
                            </h3>
                            <ArrowUpRight size={16} aria-hidden="true" className="shrink-0 text-[var(--project-accent)]" />
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {project.tags.map(tag => (
                              <span
                                key={tag}
                                className="max-w-full rounded-[var(--radius-sm)] border px-1.5 py-0.5 text-[0.68rem] [overflow-wrap:anywhere]"
                                style={{ background: soft, borderColor: bright, color: accent }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
