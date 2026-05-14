// ExperienceSection.tsx — 활동 경험 섹션
// Design: Nebula Hacker — clickable timeline cards

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useLocation } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { experiences } from "@/data/portfolio";

export default function ExperienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [, navigate] = useLocation();

  return (
    <section id="experience" className="relative py-28" ref={ref}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 10% 50%, rgba(100,255,218,0.03) 0%, transparent 70%)",
        }}
      />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-14"
        >
          <span className="section-number">04.</span>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 700,
              color: "#ccd6f6",
            }}
          >
            Experience
          </h2>
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(100,255,218,0.15)", maxWidth: "200px" }}
          />
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-0 top-0 bottom-0 w-px hidden md:block"
            style={{
              background: "linear-gradient(to bottom, transparent, rgba(100,255,218,0.2), transparent)",
              left: "7px",
            }}
          />

          <div className="space-y-5 md:pl-10">
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                id={`experience-${i}`}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div
                  className="absolute hidden md:block w-3.5 h-3.5 rounded-full"
                  style={{
                    left: "-2.75rem",
                    top: "1.1rem",
                    background: "#050b18",
                    border: "2px solid rgba(100,255,218,0.4)",
                    boxShadow: "0 0 8px rgba(100,255,218,0.2)",
                  }}
                />

                <div
                  className="nebula-card rounded-xl p-5 cursor-pointer group"
                  onClick={() => navigate(`/experience/${i}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/experience/${i}`)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: "1rem",
                            fontWeight: 600,
                            color: "#ccd6f6",
                            transition: "color 0.2s",
                          }}
                          className="group-hover:text-[#64ffda]"
                        >
                          {exp.title}
                        </h3>
                        <ArrowUpRight
                          size={13}
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          style={{ color: "#64ffda" }}
                        />
                      </div>
                      <div
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.75rem",
                          color: "#64ffda",
                          marginTop: "2px",
                        }}
                      >
                        {exp.role}
                      </div>
                    </div>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.72rem",
                        color: "#4a5568",
                        whiteSpace: "nowrap",
                        paddingTop: "2px",
                      }}
                    >
                      {exp.period}
                    </span>
                  </div>

                  <p
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "0.88rem",
                      color: "#8892b0",
                      lineHeight: 1.7,
                      marginBottom: "0.75rem",
                    }}
                  >
                    {exp.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.65rem",
                          padding: "2px 8px",
                          borderRadius: "3px",
                          background: "rgba(100,255,218,0.05)",
                          border: "1px solid rgba(100,255,218,0.15)",
                          color: "#64ffda",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
