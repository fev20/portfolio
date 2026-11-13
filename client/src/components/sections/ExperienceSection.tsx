// ExperienceSection.tsx — 활동 경험 섹션
// Design: warm paper and restrained pastel accents — clickable timeline cards

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, type CSSProperties } from "react";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { orderedExperiences } from "@/lib/experienceNavigation";
import AnimalBackground from "@/components/AnimalBackground";

export default function ExperienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" className="relative py-28" ref={ref}>
      <AnimalBackground animal="squirrel" placement="experience" />
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
              letterSpacing: "normal",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 3vw, 2.6rem)",
              fontWeight: 800,
              color: "var(--ink)",
            }}
          >
            Experience
          </h2>
          <div
            className="flex-1 h-px"
            style={{
              background: "color-mix(in srgb, var(--sage) 15%, transparent)",
              maxWidth: "200px",
            }}
          />
        </motion.div>

        <div
          className="relative"
          style={
            {
              "--timeline-axis": "8px",
              "--timeline-gutter": "40px",
            } as CSSProperties
          }
        >
          {/* Timeline line */}
          <div
            className="pointer-events-none absolute top-0 bottom-0 w-px hidden md:block"
            data-timeline-rail
            aria-hidden="true"
            style={{
              background: "var(--line)",
              left: "var(--timeline-axis)",
              transform: "translateX(-50%)",
            }}
          />

          <div className="space-y-5">
            {orderedExperiences.map(
              ({ experience: exp, routeId, index }, i) => (
                <div
                  key={routeId}
                  id={`experience-${routeId}`}
                  className="relative md:pl-[var(--timeline-gutter)]"
                  data-timeline-entry={index}
                >
                  {/* Timeline dot */}
                  <div
                    className="pointer-events-none absolute z-10 hidden md:block w-3.5 h-3.5 rounded-full"
                    data-timeline-dot={index}
                    aria-hidden="true"
                    style={{
                      left: "var(--timeline-axis)",
                      transform: "translateX(-50%)",
                      top: "1.1rem",
                      background: "var(--paper)",
                      border:
                        "2px solid color-mix(in srgb, var(--sage) 40%, transparent)",
                    }}
                  />

                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    data-timeline-card={index}
                  >
                    <Link
                      href={`/experience/${encodeURIComponent(routeId)}`}
                      className="paper-card block rounded-[var(--radius)] p-5 group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3
                              style={{
                                letterSpacing: "normal",
                                fontFamily: "var(--font-body)",
                                fontSize: "1rem",
                                fontWeight: 600,
                                color: "var(--ink)",
                                transition: "color 0.2s",
                              }}
                              className="group-hover:text-[var(--sage-deep)]"
                            >
                              {exp.title}
                            </h3>
                            <ArrowUpRight
                              size={13}
                              className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                              style={{ color: "var(--sage)" }}
                            />
                          </div>
                          <div
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "0.75rem",
                              color: "var(--sage)",
                              marginTop: "2px",
                            }}
                          >
                            {exp.role}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-start gap-2">
                          <span
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "0.72rem",
                              color: "var(--ink-secondary)",
                              whiteSpace: "nowrap",
                              paddingTop: "2px",
                            }}
                          >
                            {exp.period}
                          </span>
                          {exp.status && (
                            <span className="skill-tag">{exp.status}</span>
                          )}
                        </div>
                      </div>

                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.88rem",
                          color: "var(--ink-secondary)",
                          lineHeight: 1.7,
                          marginBottom: "0.75rem",
                        }}
                      >
                        {exp.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {exp.tags.map(tag => (
                          <span
                            key={tag}
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "0.65rem",
                              padding: "2px 8px",
                              borderRadius: "var(--radius-sm)",
                              background:
                                "color-mix(in srgb, var(--sage) 5%, transparent)",
                              border:
                                "1px solid color-mix(in srgb, var(--sage) 15%, transparent)",
                              color: "var(--sage)",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Link>
                  </motion.div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
