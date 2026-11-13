import { motion } from "framer-motion";
import AnimalBackground from "@/components/AnimalBackground";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useLocation } from "wouter";
import { GraduationCap, Award, Terminal, ArrowUpRight } from "lucide-react";
import { education, certifications } from "@/data/portfolio";

const ICONS: Record<string, React.ElementType> = {
  "graduation-cap": GraduationCap,
  award: Award,
  terminal: Terminal,
};

export default function EducationSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [, navigate] = useLocation();

  return (
    <section id="education" className="relative py-12 sm:py-16 lg:py-20" ref={ref}>
      <AnimalBackground animal="otter" placement="education" />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-7 sm:mb-9"
        >
          <span className="section-number">05.</span>
          <h2
            style={{
              letterSpacing: "normal",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 3vw, 2.6rem)",
              fontWeight: 800,
              color: "var(--ink)",
            }}
          >
            Education & Certification
          </h2>
          <div
            className="flex-1 h-px"
            style={{
              background: "color-mix(in srgb, var(--sage) 15%, transparent)",
              maxWidth: "200px",
            }}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3
              className="mb-5"
              style={{
                fontWeight: 600,
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                color: "var(--sage)",
                letterSpacing: "normal",
              }}
            >
              EDUCATION
            </h3>
            <div className="space-y-4">
              {education.map((edu, i) => {
                const Icon = ICONS[edu.icon] || GraduationCap;
                return (
                  <motion.div
                    key={i}
                    id={`education-edu-${i}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                    className="paper-card rounded-[var(--radius)] p-5 flex items-start gap-4 cursor-pointer group"
                    onClick={() => navigate(`/education/edu/${i}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e =>
                      e.key === "Enter" && navigate(`/education/edu/${i}`)
                    }
                  >
                    <div
                      className="w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center flex-shrink-0"
                      style={{
                        background:
                          "color-mix(in srgb, var(--sage) 8%, transparent)",
                        border:
                          "1px solid color-mix(in srgb, var(--sage) 20%, transparent)",
                      }}
                    >
                      <Icon size={18} style={{ color: "var(--sage)" }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div
                          style={{
                            letterSpacing: "normal",
                            fontFamily: "var(--font-body)",
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            color: "var(--ink)",
                            transition: "color 0.2s",
                          }}
                          className="group-hover:text-[var(--sage-deep)]"
                        >
                          {edu.title}
                        </div>
                        <ArrowUpRight
                          size={13}
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          style={{ color: "var(--sage)" }}
                        />
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.85rem",
                          color: "var(--ink-secondary)",
                          marginTop: "2px",
                        }}
                      >
                        {edu.subtitle}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.7rem",
                          color: "var(--ink-secondary)",
                          marginTop: "4px",
                        }}
                      >
                        {edu.period}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3
              className="mb-5"
              style={{
                fontWeight: 600,
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                color: "var(--rose)",
                letterSpacing: "normal",
              }}
            >
              CERTIFICATIONS
            </h3>
            <div className="space-y-3">
              {certifications.map((cert, i) => {
                const Icon = ICONS[cert.icon] || Award;
                return (
                  <motion.div
                    key={i}
                    id={`education-cert-${i}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                    className="paper-card rounded-[var(--radius)] p-4 flex items-center gap-4 cursor-pointer group"
                    style={{
                      borderColor:
                        "color-mix(in srgb, var(--rose) 10%, transparent)",
                    }}
                    onClick={() => navigate(`/education/cert/${i}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e =>
                      e.key === "Enter" && navigate(`/education/cert/${i}`)
                    }
                  >
                    <div
                      className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center flex-shrink-0"
                      style={{
                        background:
                          "color-mix(in srgb, var(--rose) 8%, transparent)",
                        border:
                          "1px solid color-mix(in srgb, var(--rose) 20%, transparent)",
                      }}
                    >
                      <Icon size={14} style={{ color: "var(--rose)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        style={{
                          letterSpacing: "normal",
                          fontFamily: "var(--font-body)",
                          fontSize: "0.88rem",
                          fontWeight: 600,
                          color: "var(--ink)",
                          transition: "color 0.2s",
                        }}
                        className="group-hover:text-[var(--rose-deep)]"
                      >
                        {cert.title}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.68rem",
                          color: "var(--ink-secondary)",
                          marginTop: "2px",
                        }}
                      >
                        {cert.issuer}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.68rem",
                          color: "var(--rose)",
                        }}
                      >
                        {cert.year}
                      </span>
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: "var(--rose)" }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
