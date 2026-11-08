// SkillsSection.tsx — 기술 스택 섹션
// Design: warm paper and restrained pastel accents — category cards with soft skill tags

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Code2, Cpu, Wrench } from "lucide-react";
import { skills } from "@/data/portfolio";
import AnimalBackground from "@/components/AnimalBackground";

const ICONS: Record<string, React.ElementType> = {
  shield: Shield,
  code: Code2,
  cpu: Cpu,
  wrench: Wrench,
};

export default function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="skills" className="relative py-28" ref={ref}>
      <AnimalBackground animal="capybara" placement="skills" />
      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-14"
        >
          <span className="section-number">02.</span>
          <h2
            style={{
              letterSpacing: "normal",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 3vw, 2.6rem)",
              fontWeight: 800,
              color: "var(--ink)",
            }}
          >
            Skills
          </h2>
          <div
            className="flex-1 h-px"
            style={{
              background: "color-mix(in srgb, var(--sage) 15%, transparent)",
              maxWidth: "200px",
            }}
          />
        </motion.div>

        {/* Skill categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:auto-rows-fr gap-6">
          {skills.map((category, i) => {
            const Icon = ICONS[category.icon] || Shield;
            const accent = i % 2 === 0 ? "var(--sage)" : "var(--rose)";
            return (
              <motion.div
                key={category.category}
                id={`skill-${category.category}`}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="paper-card rounded-[var(--radius)] px-6 pt-3 pb-6"
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center"
                    style={{
                      background: `color-mix(in srgb, ${accent} 8%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${accent} 19%, transparent)`,
                    }}
                  >
                    <Icon size={16} style={{ color: accent }} />
                  </div>
                  <h3
                    style={{
                      letterSpacing: "normal",
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "var(--ink)",
                    }}
                  >
                    {category.category}
                  </h3>
                </div>

                {/* Skill tags */}
                <div className="flex flex-wrap gap-2.5">
                  {category.items.map((skill, j) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{
                        duration: 0.3,
                        delay: i * 0.15 + j * 0.05 + 0.3,
                      }}
                      className="skill-tag"
                      style={{
                        fontSize: "0.8125rem",
                        padding: "0.25rem 0.875rem",
                        borderColor: `color-mix(in srgb, ${accent} 19%, transparent)`,
                        color: accent,
                        background: `color-mix(in srgb, ${accent} 3%, transparent)`,
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
