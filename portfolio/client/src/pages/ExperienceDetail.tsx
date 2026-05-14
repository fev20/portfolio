// ExperienceDetail.tsx — 경험 상세 페이지
// Design: Nebula Hacker

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050b18" }}>
        <div className="text-center">
          <p style={{ fontFamily: "'JetBrains Mono', monospace", color: "#64ffda" }}>
            $ experience not found
          </p>
          <button onClick={() => navigate("/")} className="mt-4 btn-neon">← Back</button>
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
          color="#64ffda"
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
      <div className="min-h-screen" style={{ background: "#050b18", color: "#ccd6f6" }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(100,255,218,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 lg:pl-24">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-10 group"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color: "#8892b0" }}
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
            className="inline-block mb-3 px-3 py-1 rounded"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.72rem",
              background: "rgba(100,255,218,0.08)",
              border: "1px solid rgba(100,255,218,0.2)",
              color: "#64ffda",
            }}
          >
            {exp.period}
          </div>

          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              fontWeight: 700,
              color: "#ccd6f6",
              marginBottom: "0.5rem",
            }}
          >
            {exp.title}
          </h1>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.85rem",
              color: "#64ffda",
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
                  borderRadius: "3px",
                  background: "rgba(100,255,218,0.06)",
                  border: "1px solid rgba(100,255,218,0.2)",
                  color: "#64ffda",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="h-px mb-8" style={{ background: "linear-gradient(90deg, rgba(100,255,218,0.3), transparent)" }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2
            className="mb-3"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.72rem",
              color: "#64ffda",
              letterSpacing: "0.15em",
            }}
          >
            OVERVIEW
          </h2>
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1rem",
              color: "#8892b0",
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
