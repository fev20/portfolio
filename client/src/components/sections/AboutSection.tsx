// AboutSection.tsx ??About ?뱀뀡
// Design: Nebula Hacker ??asymmetric layout with security visual

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { about } from "@/data/portfolio";

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-28" ref={ref}>
      {/* Section background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 80% 50%, rgba(167,139,250,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="container relative z-10">
        {/* ?곷떒 2而щ읆: ?띿뒪??+ ?대?吏 */}
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
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                  fontWeight: 700,
                  color: "#ccd6f6",
                }}
              >
                About Me
              </h2>
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(100,255,218,0.15)", maxWidth: "120px" }}
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
                  borderLeft: "2px solid #64ffda",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.88rem",
                  color: "#64ffda",
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
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "0.97rem",
                    color: "#8892b0",
                    lineHeight: 1.8,
                  }}
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* Quick stats ???꾩껜 ?덈퉬 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-5 gap-2 mt-8"
            >
              {[
                { value: "seKUrity", label: "Security Club" },
                { value: "CTF", label: "Player" },
                { value: "Web Pentest", label: "Security Testing" },
                { value: "Fault Injection", label: "HW Security" },
                { value: "Vice President", label: "Leadership" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-2 rounded-lg"
                  style={{
                    background: "rgba(100,255,218,0.04)",
                    border: "1px solid rgba(100,255,218,0.1)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: "#64ffda",
                      marginBottom: "2px",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "0.65rem",
                      color: "#4a5568",
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
            <div className="relative">
              {/* Glow ring */}
              <div
                className="absolute inset-0 rounded-2xl animate-pulse-glow"
                style={{
                  background: "rgba(100,255,218,0.03)",
                  border: "1px solid rgba(100,255,218,0.15)",
                  transform: "scale(1.04)",
                  borderRadius: "16px",
                }}
              />
              {/* Image */}
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663647836067/boFjbtwQQCT7GcN6J2dXvF/about-visual-ggmbHKHv4siR6FhDvFT2h9.webp"
                alt="Security concept"
                className="relative rounded-2xl"
                style={{
                  width: "100%",
                  maxWidth: "420px",
                  aspectRatio: "4/3",
                  objectFit: "cover",
                  filter: "saturate(0.85) brightness(0.9)",
                }}
              />
              {/* Corner decorations */}
              <div
                className="absolute top-3 left-3 w-6 h-6"
                style={{
                  borderTop: "2px solid #64ffda",
                  borderLeft: "2px solid #64ffda",
                  borderRadius: "2px 0 0 0",
                }}
              />
              <div
                className="absolute bottom-3 right-3 w-6 h-6"
                style={{
                  borderBottom: "2px solid #64ffda",
                  borderRight: "2px solid #64ffda",
                  borderRadius: "0 0 2px 0",
                }}
              />
              {/* Floating badge */}
              <div
                className="absolute -bottom-4 -right-4 px-4 py-2 rounded-lg"
                style={{
                  background: "rgba(15,23,42,0.95)",
                  border: "1px solid rgba(100,255,218,0.2)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.75rem",
                    color: "#64ffda",
                  }}
                >
                  $ security_researcher
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


