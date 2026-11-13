// ExperienceDetail.tsx — 경험 상세 페이지
// Design: Warm paper and soft pastel accents

import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects } from "@/data/portfolio";
import { findExperience } from "@/lib/experienceNavigation";
import PageTransition from "@/components/PageTransition";

export default function ExperienceDetail() {
  const { index } = useParams<{ index: string }>();
  const exp = findExperience(index);
  const [loading, setLoading] = useState(true);
  const relatedProject = projects.find(project => project.id === exp?.projectId);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [index]);

  const returnToExperience = () => {
    sessionStorage.setItem("pendingScroll", "experience");
  };

  if (!exp) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--paper)" }}>
        <div className="text-center">
          <p style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--sage)" }}>
            $ experience not found
          </p>
          <Link href="/" onClick={returnToExperience} className="mt-4 btn-outline">
            ← Back
          </Link>
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

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-16 pb-24 lg:pb-16 lg:pl-24">
        <Link
          href="/"
          onClick={returnToExperience}
          className="inline-flex items-center gap-2 mb-10 group"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color: "var(--ink-secondary)" }}
        >
          <ArrowLeft size={14} aria-hidden="true" className="transition-transform group-hover:-translate-x-1" />
          Experience 목록으로
        </Link>

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
          {exp.status && (
            <span className="skill-tag ml-2">{exp.status}</span>
          )}

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
          {exp.website && (
            <a
              href={exp.website.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline mt-2 mb-4"
            >
              {exp.website.label}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
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
              fontFamily: "var(--font-body)",
              fontSize: "0.72rem",
              color: "var(--sage)",
              letterSpacing: "normal",
            }}
          >
            OVERVIEW
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: "var(--ink-secondary)",
              lineHeight: 1.8,
            }}
          >
            {exp.description}
          </p>
          {relatedProject && (
            <Link
              href={`/project/${encodeURIComponent(relatedProject.id)}`}
              className="btn-outline mt-6"
            >
              관련 프로젝트 보기
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          )}
        </motion.div>
      </div>
    </div>
      )}
    </>
  );
}
