import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Github, BookOpen, Tag } from "lucide-react";
import { projects } from "@/data/portfolio";
import ProtectedDownload from "@/components/ProtectedDownload";
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
              {project.description && (
                <div>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "rgba(100,255,218,0.4)", marginBottom: "0.5rem" }}>
                    OVERVIEW
                  </p>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem", color: "#8892b0", lineHeight: 1.8 }}>
                    {project.description}
                  </p>
                </div>
              )}

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

              {/* Preview */}
              {project.files && project.files.length > 0 && !project.files[0].protection && (
                <div>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "rgba(100,255,218,0.4)", marginBottom: "0.5rem" }}>
                    PREVIEW
                  </p>
                  <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${project.color}20`, aspectRatio: "1 / 1.4142" }}>
                    <iframe
                      src={`${project.files[0].url}#toolbar=0&navpanes=0&scrollbar=0&page=1&view=FitH`}
                      title={project.files[0].name}
                      className="w-full h-full"
                      style={{ border: "none" }}
                      scrolling="no"
                    />
                  </div>
                </div>
              )}

              {/* Files */}
              {project.files && project.files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "rgba(100,255,218,0.4)", marginBottom: "0.5rem" }}>
                    $ ls ./files
                  </p>
                  {project.files.map((file: any, i: number) => (
                    file.protection ? (
                      <ProtectedDownload
                        key={i}
                        url={file.url}
                        filename={file.name}
                        label={file.name}
                        protection={file.protection}
                      />
                    ) : (
                      <button
                        key={i}
                        onClick={() => window.open(file.url, "_blank", "noopener,noreferrer")}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 w-full text-left"
                        style={{
                          background: "rgba(100,255,218,0.03)",
                          border: "1px solid rgba(100,255,218,0.1)",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = "rgba(100,255,218,0.07)";
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(100,255,218,0.25)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = "rgba(100,255,218,0.03)";
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(100,255,218,0.1)";
                        }}
                      >
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: "rgba(100,255,218,0.5)" }}>📄</span>
                        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.85rem", color: "#a8b2d8", flex: 1 }}>{file.name}</span>
                      </button>
                    )
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
}
