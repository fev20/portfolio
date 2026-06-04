// ProjectsSection.tsx — 프로젝트 섹션
// Design: Nebula Hacker — category headers → clickable cards

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useLocation } from "wouter";
import { ArrowUpRight, Shield, Terminal, BookOpen, Globe, Settings, Cpu } from "lucide-react";
import { projects } from "@/data/portfolio";

const CATEGORY_META: Record<string, { icon: React.ElementType; subtitle: string; color: string }> = {
  "Security Research":              { icon: Shield,   subtitle: "연구/분석형",         color: "#f59e0b" },
  "CTF & Security Activities":      { icon: Terminal, subtitle: "보안 활동형",          color: "#64ffda" },
  "Security Education":             { icon: BookOpen, subtitle: "교육/발표형",          color: "#a78bfa" },
  "Interactive Web Projects":       { icon: Globe,    subtitle: "인터랙션/웹 제작형",   color: "#38bdf8" },
  "Embedded & Hardware Security":{ icon: Settings, subtitle: "하드웨어 실습형",          color: "#34d399" },
  "Leadership & Community":   { icon: Cpu,      subtitle: "리더십/커뮤니티형",      color: "#fb923c" },
};

// 카테고리 순서 고정
const CATEGORY_ORDER = [
  "Security Research",
  "CTF & Security Activities",
  "Security Education",
  "Interactive Web Projects",
  "Embedded & Hardware Security",
  "Leadership & Community",
];

export default function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [, navigate] = useLocation();

  // 카테고리별로 프로젝트 그룹핑
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: projects.filter((p) => p.category === cat),
  }));

  return (
    <section id="projects" className="relative py-28" ref={ref}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(56,189,248,0.04) 0%, transparent 70%)",
        }}
      />

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
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 700,
              color: "#ccd6f6",
            }}
          >
            Projects
          </h2>
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(100,255,218,0.15)", maxWidth: "200px" }}
          />
        </motion.div>

        {/* Category groups */}
        <div className="space-y-16">
          {grouped.map((group, gi) => {
            const meta = CATEGORY_META[group.category];
            const Icon = meta.icon;
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
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `${meta.color}15`,
                      border: `1px solid ${meta.color}30`,
                    }}
                  >
                    <Icon size={15} style={{ color: meta.color }} />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.65rem",
                          color: meta.color,
                          opacity: 0.6,
                        }}
                      >
                        {String(gi + 1).padStart(2, "0")}.
                      </span>
                      <h3
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: "1.15rem",
                          fontWeight: 700,
                          color: "#ccd6f6",
                        }}
                      >
                        {group.category}
                      </h3>
                    </div>
                    <p
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.7rem",
                        color: "#4a5568",
                        marginTop: "2px",
                      }}
                    >
                      {meta.subtitle}
                    </p>
                  </div>
                  <div
                    className="flex-1 h-px ml-2"
                    style={{ background: `${meta.color}15` }}
                  />
                </div>

                {/* Cards in this category */}
                {group.items.length === 0 ? (
                  <div
                    className="rounded-xl p-5"
                    style={{
                      border: `1px dashed ${meta.color}20`,
                      background: `${meta.color}04`,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.72rem",
                        color: "#4a5568",
                      }}
                    >
                      // 준비 중
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {group.items.map((project, i) => (
                      <motion.div
                        key={project.id}
                        id={`project-${project.id}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: gi * 0.1 + i * 0.12 + 0.2 }}
                        className="nebula-card rounded-xl overflow-hidden cursor-pointer group"
                        onClick={() => navigate(`/project/${project.id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) =>
                          e.key === "Enter" && navigate(`/project/${project.id}`)
                        }
                      >
                        <div className="p-6 md:p-8">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left: Number + Title */}
                            <div className="lg:col-span-1">
                              <div
                                className="text-6xl font-bold mb-3 select-none"
                                style={{
                                  fontFamily: "'JetBrains Mono', monospace",
                                  color: `${project.color}60`,
                                  lineHeight: 1,
                                }}
                              >
                                {project.number}
                              </div>
                              <div className="flex items-start justify-between">
                                <h3
                                  style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontSize: "1.1rem",
                                    fontWeight: 700,
                                    color: "#ccd6f6",
                                    marginBottom: "0.5rem",
                                    transition: "color 0.2s",
                                  }}
                                  className="group-hover:text-[#64ffda]"
                                >
                                  {project.title}
                                </h3>
                                <ArrowUpRight
                                  size={16}
                                  className="flex-shrink-0 mt-1 transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                  style={{ color: project.color }}
                                />
                              </div>
                              {/* Tags */}
                              <div className="flex flex-wrap gap-1.5 mt-3">
                                {project.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    style={{
                                      fontFamily: "'JetBrains Mono', monospace",
                                      background: `${project.color}10`,
                                      border: `1px solid ${project.color}25`,
                                      color: project.color,
                                      fontSize: "0.68rem",
                                      padding: "2px 8px",
                                      borderRadius: "3px",
                                    }}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Right: Description + Role */}
                            <div className="lg:col-span-2 space-y-4">
                              <p
                                style={{
                                  fontFamily: "'Space Grotesk', sans-serif",
                                  fontSize: "0.95rem",
                                  color: "#8892b0",
                                  lineHeight: 1.7,
                                }}
                              >
                                {project.description}
                              </p>
                              <div
                                className="p-3 rounded-lg"
                                style={{
                                  background: "rgba(100,255,218,0.03)",
                                  border: "1px solid rgba(100,255,218,0.08)",
                                }}
                              >
                                {/* <div
                                  style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: "0.62rem",
                                    color: "#64ffda",
                                    letterSpacing: "0.1em",
                                    marginBottom: "4px",
                                  }}
                                >
                                  ROLE
                                </div> */}
                                <div
                                  style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontSize: "0.85rem",
                                    color: "#ccd6f6",
                                  }}
                                >
                                  {project.role}
                                </div>
                              </div>
                              <p
                                style={{
                                  fontFamily: "'JetBrains Mono', monospace",
                                  fontSize: "0.72rem",
                                  color: project.color,
                                  opacity: 0.6,
                                }}
                              >
                                클릭하여 자세히 보기 →
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Bottom accent line */}
                        <div
                          className="h-0.5 transition-all"
                          style={{
                            background: `linear-gradient(90deg, ${project.color}40, transparent)`,
                          }}
                        />
                      </motion.div>
                    ))}
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