// ExperienceDetail.tsx — 경험 상세 페이지
// Design: Warm paper and soft pastel accents

import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { experiences } from "@/data/portfolio";
import PageTransition from "@/components/PageTransition";

export default function ExperienceDetail() {
  const { index } = useParams<{ index: string }>();
  const [, navigate] = useLocation();
  const exp = experiences[Number(index)];
  const [loading, setLoading] = useState(true);

  if (!exp) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--paper)" }}>
        <div className="text-center">
          <p style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--sage)" }}>
            $ experience not found
          </p>
          <button onClick={() => navigate("/")} className="mt-4 btn-outline">← Back</button>
        </div>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <PageTransition
          title={exp.title}
          subtitle={`EXPERIENCE · ${exp.period}`}
          color="var(--sage)"
          lines={[
            `$ cd ./experience/${exp.title.toLowerCase().replace(/\s+/g, "_")}`,
            `$ cat activity.log`,
            `> ${exp.role}`,
            `> record loaded.`,
          ]}
          onComplete={() => setLoading(false)}
        />
      )}
      {!loading && (
      <div className="min-h-screen" style={{ background: "var(--paper)", color: "var(--ink)" }}>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 lg:pl-24">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-10 group"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color: "var(--ink-secondary)" }}
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          cd ../experience
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-block mb-3 px-3 py-1 rounded-[var(--radius-sm)]"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.72rem",
              background: "var(--sage-soft)",
              border: "1px solid var(--line)",
              color: "var(--sage)",
            }}
          >
            {exp.period}
          </div>

          <h1
            style={{
              letterSpacing: "normal",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 800,
              color: "var(--ink)",
              marginBottom: "0.5rem",
            }}
          >
            {exp.title}
          </h1>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.85rem",
              color: "var(--sage)",
              marginBottom: "1.5rem",
            }}
          >
            {exp.role}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {exp.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.68rem",
                  padding: "3px 10px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--sage-soft)",
                  border: "1px solid var(--line)",
                  color: "var(--sage)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="h-px mb-8" style={{ background: "var(--line)" }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2
            className="mb-3"
            style={{
              fontWeight: 700,
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "0.72rem",
              color: "var(--sage)",
              letterSpacing: "normal",
            }}
          >
            OVERVIEW
          </h2>
          <p
            style={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "1rem",
              color: "var(--ink-secondary)",
              lineHeight: 1.8,
            }}
          >
            {exp.description}
          </p>
        </motion.div>
      </div>
    </div>
      )}
    </>
  );
}
