// AboutSection.tsx ??About ?뱀뀡
// Design: warm paper and restrained pastel accents ??asymmetric layout with security visual

import { motion } from "framer-motion";
import AnimalBackground from "@/components/AnimalBackground";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { about } from "@/data/portfolio";
import { ShieldCheck, LockKeyhole, Code2, Cpu } from "lucide-react";

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-28" ref={ref}>
      <AnimalBackground animal="dog" placement="about" />
      <div className="container relative z-10">
        {/* Introduction and visual */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            {/* Section label */}
            <div className="flex items-center gap-3 mb-6">
              <span className="section-number">01.</span>
              <h2
                style={{
                  letterSpacing: "normal",
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 3vw, 2.6rem)",
                  fontWeight: 800,
                  color: "var(--ink)",
                }}
              >
                About Me
              </h2>
              <div
                className="flex-1 h-px"
                style={{
                  background:
                    "color-mix(in srgb, var(--sage) 15%, transparent)",
                  maxWidth: "120px",
                }}
              />
            </div>

            {/* Quote */}
            {about.quote && (
              <motion.blockquote
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="mb-6 pl-4"
                style={{
                  borderLeft: "2px solid var(--sage)",
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontSize: "0.88rem",
                  color: "var(--sage)",
                  fontStyle: "italic",
                }}
              >
                "{about.quote}"
              </motion.blockquote>
            )}

            {/* Paragraphs */}
            <div className="space-y-4">
              {about.paragraphs.map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.15 }}
                  style={{
                    fontFamily: "'Nunito Sans', sans-serif",
                    fontSize: "0.97rem",
                    color: "var(--ink-secondary)",
                    lineHeight: 1.8,
                  }}
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2 mt-8"
            >
              {[
                { value: "seKUrity", label: "Security Club" },
                { value: "CTF", label: "Player" },
                { value: "Web Pentest", label: "Security Testing" },
                { value: "Fault Injection", label: "HW Security" },
                { value: "Vice President", label: "Leadership" },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="text-center p-2 rounded-[var(--radius-sm)]"
                  style={{
                    background:
                      "color-mix(in srgb, var(--sage) 4%, transparent)",
                    border:
                      "1px solid color-mix(in srgb, var(--sage) 10%, transparent)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: "var(--sage)",
                      marginBottom: "2px",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontSize: "0.65rem",
                      color: "var(--ink-secondary)",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div
              className="relative w-full max-w-[420px] rounded-[var(--radius)] p-7 sm:p-9"
              role="img"
              aria-label="Security research illustration"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
                boxShadow: "none",
              }}
            >
              <div
                className="flex items-center justify-between pb-4"
                style={{ borderBottom: "1px solid var(--line)" }}
              >
                <span
                  className="text-xs"
                  style={{ color: "var(--ink-secondary)" }}
                >
                  Security notes
                </span>
                <div className="flex gap-1.5" aria-hidden="true">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: "var(--sage-soft)" }}
                  />
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: "var(--rose-soft)" }}
                  />
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: "var(--surface-muted)" }}
                  />
                </div>
              </div>
              <div
                className="flex items-center justify-center gap-5 py-10"
                aria-hidden="true"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-sm)]"
                  style={{
                    background: "var(--rose-soft)",
                    color: "var(--rose)",
                  }}
                >
                  <Code2 size={24} strokeWidth={1.5} />
                </div>
                <div
                  className="flex h-28 w-24 items-center justify-center rounded-[var(--radius)]"
                  style={{
                    background: "var(--sage-soft)",
                    color: "var(--sage)",
                  }}
                >
                  <ShieldCheck size={64} strokeWidth={1.3} />
                </div>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-sm)]"
                  style={{
                    background: "var(--surface-muted)",
                    color: "var(--ink-secondary)",
                  }}
                >
                  <Cpu size={24} strokeWidth={1.5} />
                </div>
              </div>
              <div className="space-y-2.5" aria-hidden="true">
                <div
                  className="h-2 w-3/4 rounded-[var(--radius-sm)]"
                  style={{ background: "var(--surface-muted)" }}
                />
                <div
                  className="h-2 w-full rounded-[var(--radius-sm)]"
                  style={{ background: "var(--surface-muted)" }}
                />
                <div
                  className="h-2 w-1/2 rounded-[var(--radius-sm)]"
                  style={{ background: "var(--sage-soft)" }}
                />
              </div>
              <div
                className="mt-7 flex items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2.5"
                style={{
                  background: "var(--rose-soft)",
                  color: "var(--rose-deep)",
                }}
              >
                <LockKeyhole size={14} strokeWidth={1.5} />
                <span className="text-xs">Security researcher</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
