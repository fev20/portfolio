// SkillsSection.tsx — 기술 스택 섹션
// Design: Nebula Hacker — category cards with glowing skill tags

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Code2, Wrench } from "lucide-react";
import { skills } from "@/data/portfolio";

const ICONS: Record<string, React.ElementType> = {
  shield: Shield,
  code: Code2,
  wrench: Wrench,
};

export default function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="skills" className="relative py-28" ref={ref}>
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663647836067/boFjbtwQQCT7GcN6J2dXvF/skills-bg-DdjRLhDoavV7TZoFdCdkGE.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.06,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 20% 50%, rgba(100,255,218,0.04) 0%, transparent 70%)",
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
          <span className="section-number">02.</span>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 700,
              color: "#ccd6f6",
            }}
          >
            Skills
          </h2>
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(100,255,218,0.15)", maxWidth: "200px" }}
          />
        </motion.div>

        {/* Skill categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skills.map((category, i) => {
            const Icon = ICONS[category.icon] || Shield;
            return (
              <motion.div
                key={category.category}
                id={`skill-${category.category}`}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="nebula-card rounded-xl p-6"
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{
                      background: `${category.color}15`,
                      border: `1px solid ${category.color}30`,
                    }}
                  >
                    <Icon size={16} style={{ color: category.color }} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#ccd6f6",
                    }}
                  >
                    {category.category}
                  </h3>
                </div>

                {/* Skill tags */}
                <div className="flex flex-wrap gap-2">
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
                        borderColor: `${category.color}30`,
                        color: category.color,
                        background: `${category.color}08`,
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
