// AboutSection.tsx — About 섹션
// Design: Nebula Hacker — asymmetric layout with security visual

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useLocation } from "wouter";
import { about, nowActivities } from "@/data/portfolio";

// ──────────────────────────────────────────
// 나는 지금 토글 블록
// ──────────────────────────────────────────
function NowBlock({
  isInView,
  navigate,
}: {
  isInView: boolean;
  navigate: (path: string) => void;
}) {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.65 }}
      className="mt-20"
    >
      {/* 헤더 */}
      <div className="mb-6">
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
            fontWeight: 800,
            color: "#64ffda",
            letterSpacing: "-0.01em",
          }}
        >
          나는 지금
        </div>
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "0.9rem",
            color: "#4a5568",
            paddingLeft: "1.5rem",
          }}
        >
          이런 걸 하고 있어요
        </div>
      </div>

      {/* 카테고리 목록 */}
      <div className="space-y-2">
        {nowActivities.map((cat, ci) => {
          const isOpen = openIds.includes(cat.id);
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.7 + ci * 0.08 }}
            >
              {/* 카테고리 헤더 버튼 */}
              <button
                onClick={() => toggle(cat.id)}
                className="w-full text-left"
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
              >
                <div
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200"
                  style={{
                    background: isOpen ? "rgba(100,255,218,0.07)" : "rgba(100,255,218,0.03)",
                    border: `1px solid ${isOpen ? "rgba(100,255,218,0.3)" : "rgba(100,255,218,0.1)"}`,
                    marginLeft: "1rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.75rem",
                      color: "rgba(100,255,218,0.6)",
                      flexShrink: 0,
                      display: "inline-block",
                      transition: "transform 0.2s",
                      transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                    }}
                  >
                    ▸
                  </span>
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "0.92rem",
                      fontWeight: 600,
                      color: "#ccd6f6",
                      flex: 1,
                    }}
                  >
                    {cat.label}
                  </span>
                  {cat.items.length > 0 && (
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.68rem",
                        color: "rgba(100,255,218,0.35)",
                      }}
                    >
                      {cat.items.length}
                    </span>
                  )}
                </div>
              </button>

              {/* 서브 아이템 */}
              {isOpen && cat.items.length > 0 && (
                <div className="mt-1 space-y-1">
                  {cat.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.path)}
                      className="w-full text-left group"
                      style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                    >
                      <div
                        className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200"
                        style={{
                          background: "rgba(100,255,218,0.02)",
                          border: "1px solid rgba(100,255,218,0.06)",
                          marginLeft: "2.5rem",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLDivElement).style.background = "rgba(100,255,218,0.06)";
                          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(100,255,218,0.2)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLDivElement).style.background = "rgba(100,255,218,0.02)";
                          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(100,255,218,0.06)";
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.65rem",
                            color: "rgba(100,255,218,0.3)",
                            flexShrink: 0,
                          }}
                        >
                          —
                        </span>
                        <span
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: "0.83rem",
                            color: "#8892b0",
                            flex: 1,
                          }}
                        >
                          {item.label}
                        </span>
                        <span
                          className="group-hover:opacity-100"
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.65rem",
                            color: "rgba(100,255,218,0.3)",
                            opacity: 0,
                            transition: "opacity 0.2s",
                          }}
                        >
                          →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ──────────────────────────────────────────
// 메인 AboutSection
// ──────────────────────────────────────────
export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [, navigate] = useLocation();

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
        {/* 상단 2컬럼: 텍스트 + 이미지 */}
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

            {/* Quick stats — 전체 너비 */}
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
                      fontSize: "0.8rem",
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
                      fontSize: "0.6rem",
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

        {/* 나는 지금 블록 — grid 아래 독립 배치 */}
        <NowBlock isInView={isInView} navigate={navigate} />
      </div>
    </section>
  );
}