import { motion } from "framer-motion";
import AnimalBackground from "@/components/AnimalBackground";
import { useInView } from "framer-motion";
import { useRef, type CSSProperties } from "react";
import { useLocation } from "wouter";
import { Shield, Terminal, BookOpen, Globe, Settings, Cpu } from "lucide-react";
import { projects } from "@/data/portfolio";
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
  const [, navigate] = useLocation();

  const grouped = PROJECT_CATEGORY_ORDER.map(cat => ({
    category: cat,
    items: projects.filter(p => p.category === cat),
  }));

  return (
    <section id="projects" className="relative py-28" ref={ref}>
      <AnimalBackground animal="mouse" placement="projects" />
      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-14"
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
        <div className="space-y-16">
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
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-8 h-8 rounded-[2px] flex items-center justify-center flex-shrink-0"
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
                          fontFamily: "'Nunito Sans', sans-serif",
                          fontSize: "0.65rem",
                          color: categoryAccent,
                        }}
                      >
                        {String(gi + 1).padStart(2, "0")}.
                      </span>
                      <h3
                        style={{
                          letterSpacing: "normal",
                          fontFamily: "'Nunito Sans', sans-serif",
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
                        fontFamily: "'Nunito Sans', sans-serif",
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
                      background: categoryAppearance.bright,
                    }}
                  />
                </div>

                {/* Cards in this category */}
                {group.items.length === 0 ? (
                  <div
                    className="rounded-[4px] p-5"
                    style={{
                      border: "1px dashed var(--line)",
                      background: "var(--surface)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Nunito Sans', sans-serif",
                        fontSize: "0.72rem",
                        color: "var(--ink-secondary)",
                      }}
                    >
                      // 준비 중
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {group.items.map((project, i) => {
                      const { accent, soft, bright } =
                        getProjectAppearance(project);
                      return (
                        <motion.div
                          key={`${project.id}-${i}`}
                          id={`project-${project.id}`}
                          initial={{ opacity: 0, y: 30 }}
                          animate={isInView ? { opacity: 1, y: 0 } : {}}
                          transition={{
                            duration: 0.6,
                            delay: gi * 0.1 + i * 0.12 + 0.2,
                          }}
                          className="paper-card project-card rounded-[4px] overflow-hidden cursor-pointer group"
                          style={
                            {
                              "--project-accent": accent,
                              "--project-bright": bright,
                              background: `color-mix(in srgb, ${soft} 50%, var(--surface))`,
                            } as CSSProperties
                          }
                          onClick={() => navigate(`/project/${project.id}`)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={e =>
                            e.key === "Enter" &&
                            navigate(`/project/${project.id}`)
                          }
                        >
                          <div className="p-6 md:p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              {/* Left: Number + Title */}
                              <div className="lg:col-span-1">
                                <div
                                  className="text-6xl mb-3 select-none"
                                  style={{
                                    letterSpacing: "normal",
                                    fontWeight: 800,
                                    fontFamily: "var(--font-display)",
                                    color: bright,
                                    lineHeight: 1,
                                  }}
                                >
                                  {project.number}
                                </div>
                                <div className="flex items-start justify-between">
                                  <h3
                                    style={{
                                      letterSpacing: "normal",
                                      fontFamily: "'Nunito Sans', sans-serif",
                                      fontSize: "1.1rem",
                                      fontWeight: 600,
                                      marginBottom: "0.5rem",
                                      transition: "color 0.2s",
                                    }}
                                    className="text-[var(--ink)] group-hover:text-[var(--project-accent)]"
                                  >
                                    {project.title}
                                  </h3>
                                </div>
                                {/* Tags */}
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                  {project.tags.map(tag => (
                                    <span
                                      key={tag}
                                      style={{
                                        fontFamily: "'Nunito Sans', sans-serif",
                                        background: soft,
                                        border: `1px solid ${bright}`,
                                        color: accent,
                                        fontSize: "0.68rem",
                                        padding: "2px 8px",
                                        borderRadius: "2px",
                                      }}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Right: Description + Role */}
                              <div className="lg:col-span-2 space-y-4">
                                <div className="flex justify-end">
                                  <p
                                    style={{
                                      fontFamily: "'Nunito Sans', sans-serif",
                                      fontSize: "0.8rem",
                                      color: accent,
                                    }}
                                  >
                                    클릭하여 자세히 보기 →
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Bottom accent line */}
                          <div
                            className="h-0.5 transition-all"
                            style={{
                              background: bright,
                            }}
                          />
                        </motion.div>
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
