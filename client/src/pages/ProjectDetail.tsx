// ProjectDetail.tsx — 프로젝트 상세 페이지
// Design: Nebula Hacker — full detail view with page transition loading

import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Github, BookOpen, Tag } from "lucide-react";
import { projects } from "@/data/portfolio";
import PageTransition from "@/components/PageTransition";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const project = projects.find((p) => p.id === id);
  const [loading, setLoading] = useState(true);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050b18" }}>
        <div className="text-center">
          <p style={{ fontFamily: "'JetBrains Mono', monospace", color: "#64ffda" }}>
            $ project not found
          </p>
          <button onClick={() => navigate("/")} className="mt-4 btn-neon">
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <PageTransition
          title={project.title}
          subtitle={`PROJECT ${project.number}`}
          color={project.color}
          lines={[
            `$ cd ./projects/${project.id}`,
            `$ cat README.md`,
            `$ loading ${project.tags[0].toLowerCase()} modules...`,
            `> project data loaded.`,
          ]}
          onComplete={() => setLoading(false)}
        />
      )}

      {!loading && (
        <div className="min-h-screen" style={{ background: "#050b18", color: "#ccd6f6" }}>
          {/* Background glow */}
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 50% 20%, ${project.color}08 0%, transparent 70%)`,
            }}
          />

          <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 lg:pl-24">
            {/* Back button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => navigate("/")}
              className="flex items-center gap-2 mb-10 group"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.8rem",
                color: "#8892b0",
              }}
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              cd ../projects
            </motion.button>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div
                className="text-7xl font-bold mb-4 select-none"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: `${project.color}55`,
                  lineHeight: 1,
                }}
              >
                {project.number}
              </div>
              <h1
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                  fontWeight: 700,
                  color: "#ccd6f6",
                  marginBottom: "1rem",
                }}
              >
                {project.title}
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.72rem",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      background: `${project.color}10`,
                      border: `1px solid ${project.color}30`,
                      color: project.color,
                    }}
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Divider */}
            <div
              className="h-px mb-8"
              style={{ background: `linear-gradient(90deg, ${project.color}40, transparent)` }}
            />

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Description */}
              <section>
                <h2
                  className="mb-3"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.72rem",
                    color: project.color,
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
                  {project.description}
                </p>
              </section>

              {/* Role & Learned */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className="p-5 rounded-xl"
                  style={{
                    background: "rgba(15,23,42,0.8)",
                    border: `1px solid ${project.color}15`,
                  }}
                >
                  <h3
                    className="mb-2"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.65rem",
                      color: project.color,
                      letterSpacing: "0.15em",
                    }}
                  >
                    MY ROLE
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "0.92rem",
                      color: "#ccd6f6",
                      lineHeight: 1.6,
                    }}
                  >
                    {project.role}
                  </p>
                </div>
                <div
                  className="p-5 rounded-xl"
                  style={{
                    background: "rgba(15,23,42,0.8)",
                    border: "1px solid rgba(167,139,250,0.15)",
                  }}
                >
                  <h3
                    className="mb-2"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.65rem",
                      color: "#a78bfa",
                      letterSpacing: "0.15em",
                    }}
                  >
                    WHAT I LEARNED
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "0.92rem",
                      color: "#ccd6f6",
                      lineHeight: 1.6,
                    }}
                  >
                    {project.learned}
                  </p>
                </div>
              </div>

              {/* Links */}
              {(project.links.github || project.links.report) && (
                <div className="flex gap-4 pt-2">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-neon flex items-center gap-2"
                    >
                      <Github size={14} />
                      GitHub 보기
                    </a>
                  )}
                  {project.links.report && (
                    <a
                      href={project.links.report}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-neon flex items-center gap-2"
                      style={{ borderColor: "#a78bfa", color: "#a78bfa" }}
                    >
                      <BookOpen size={14} />
                      보고서 보기
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
}
