import { motion } from "framer-motion";
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
    <section id="education" className="relative py-28" ref={ref}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 80% 50%, rgba(167,139,250,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-14"
        >
          <span className="section-number">05.</span>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 700,
              color: "#ccd6f6",
            }}
          >
            Education & Certification
          </h2>
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(100,255,218,0.15)", maxWidth: "200px" }}
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
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.75rem",
                color: "#64ffda",
                letterSpacing: "0.15em",
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
                    className="nebula-card rounded-xl p-5 flex items-start gap-4 cursor-pointer group"
                    onClick={() => navigate(`/education/edu/${i}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && navigate(`/education/edu/${i}`)}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "rgba(100,255,218,0.08)",
                        border: "1px solid rgba(100,255,218,0.2)",
                      }}
                    >
                      <Icon size={18} style={{ color: "#64ffda" }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            color: "#ccd6f6",
                            transition: "color 0.2s",
                          }}
                          className="group-hover:text-[#64ffda]"
                        >
                          {edu.title}
                        </div>
                        <ArrowUpRight
                          size={13}
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          style={{ color: "#64ffda" }}
                        />
                      </div>
                      <div
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: "0.85rem",
                          color: "#8892b0",
                          marginTop: "2px",
                        }}
                      >
                        {edu.subtitle}
                      </div>
                      <div
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.7rem",
                          color: "#4a5568",
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
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.75rem",
                color: "#a78bfa",
                letterSpacing: "0.15em",
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
                    className="nebula-card rounded-xl p-4 flex items-center gap-4 cursor-pointer group"
                    style={{ borderColor: "rgba(167,139,250,0.1)" }}
                    onClick={() => navigate(`/education/cert/${i}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && navigate(`/education/cert/${i}`)}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "rgba(167,139,250,0.08)",
                        border: "1px solid rgba(167,139,250,0.2)",
                      }}
                    >
                      <Icon size={14} style={{ color: "#a78bfa" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: "0.88rem",
                          fontWeight: 500,
                          color: "#ccd6f6",
                          transition: "color 0.2s",
                        }}
                        className="group-hover:text-[#a78bfa]"
                      >
                        {cert.title}
                      </div>
                      <div
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.68rem",
                          color: "#4a5568",
                          marginTop: "2px",
                        }}
                      >
                        {cert.issuer}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.68rem",
                          color: "#a78bfa",
                          opacity: 0.7,
                        }}
                      >
                        {cert.year}
                      </span>
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: "#a78bfa" }}
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