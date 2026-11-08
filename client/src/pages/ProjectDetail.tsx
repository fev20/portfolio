import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Github,
  BookOpen,
  Tag,
  Folder,
  FileText,
} from "lucide-react";
import { projects } from "@/data/portfolio";
import {
  getProjectAccent,
  getProjectAppearance,
} from "@/lib/projectAppearance";
import ProtectedDownload from "@/components/ProtectedDownload";
import PageTransition from "@/components/PageTransition";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const project = projects.find(p => p.id === id);
  const accent = getProjectAccent(project);
  const { soft, bright, number } = getProjectAppearance(project);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<any | null>(null);

  if (!project) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--paper)" }}
      >
        <div className="text-center">
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: "var(--sage)",
            }}
          >
            $ project not found
          </p>
          <button onClick={() => navigate("/")} className="mt-4 btn-outline">
            ← Back
          </button>
        </div>
      </div>
    );
  }

  const visibleFiles = (
    selectedFolder ? selectedFolder.files : project.files
  ) as any[] | undefined;
  const previewFile = (project.files as any[] | undefined)?.find(
    file => file.type !== "folder" && !file.protection && file.url
  );

  return (
    <>
      {loading && (
        <PageTransition
          title={project.title}
          subtitle={`PROJECT ${project.number}`}
          color={accent}
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
        <div
          className="min-h-screen"
          style={{ background: "var(--paper)", color: "var(--ink)" }}
        >
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
                color: "var(--ink-secondary)",
              }}
            >
              <ArrowLeft
                size={14}
                className="transition-transform group-hover:-translate-x-1"
              />
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
                  color: number,
                  lineHeight: 1,
                }}
              >
                {project.number}
              </div>
              <h1
                style={{
                  letterSpacing: "normal",
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 4vw, 2.75rem)",
                  fontWeight: 800,
                  color: "var(--ink)",
                  marginBottom: "1rem",
                }}
              >
                {project.title}
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center gap-1"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.72rem",
                      padding: "4px 10px",
                      borderRadius: "var(--radius-sm)",
                      background: soft,
                      border: `1px solid ${bright}`,
                      color: accent,
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
              style={{
                background: bright,
              }}
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
                  <p
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.7rem",
                      color: accent,
                      marginBottom: "0.5rem",
                    }}
                  >
                    OVERVIEW
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "1rem",
                      color: "var(--ink-secondary)",
                      lineHeight: 1.8,
                    }}
                  >
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
                      className="btn-outline flex items-center gap-2"
                      style={{
                        borderColor: accent,
                        color: accent,
                        background: `color-mix(in srgb, ${soft} 50%, var(--surface))`,
                      }}
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
                      className="btn-outline flex items-center gap-2"
                      style={{
                        borderColor: accent,
                        color: accent,
                        background: `color-mix(in srgb, ${soft} 50%, var(--surface))`,
                      }}
                    >
                      <BookOpen size={14} />
                      보고서 보기
                    </a>
                  )}
                </div>
              )}

              {/* Photos */}
              {(project as any).photos &&
                (project as any).photos.length > 0 && (
                  <div>
                    <p
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.7rem",
                        color: accent,
                        marginBottom: "0.5rem",
                      }}
                    >
                      PHOTO
                    </p>

                    <div
                      className="rounded-[var(--radius)] overflow-hidden"
                      style={{
                        border: `1px solid ${bright}`,
                        marginBottom: "2rem",
                      }}
                    >
                      <img
                        src={(project as any).photos[0]}
                        alt={`${project.title} photo`}
                        className="w-full"
                        style={{
                          display: "block",
                          width: "100%",
                          maxHeight: "520px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </div>
                )}

              {/* Preview */}
              {previewFile && (
                <div>
                  <p
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.7rem",
                      color: accent,
                      marginBottom: "0.5rem",
                    }}
                  >
                    PREVIEW
                  </p>
                  <div
                    className="rounded-[var(--radius)] overflow-hidden"
                    style={{
                      border: `1px solid ${bright}`,
                      aspectRatio: "1 / 1.4142",
                    }}
                  >
                    <iframe
                      src={`${previewFile.url}#toolbar=0&navpanes=0&scrollbar=0&page=1&view=FitH`}
                      title={previewFile.name}
                      className="w-full h-full"
                      style={{ border: "none" }}
                      scrolling="no"
                    />
                  </div>
                </div>
              )}

              {/* Files */}
              {((visibleFiles && visibleFiles.length > 0) ||
                selectedFolder) && (
                <div className="mt-4 space-y-2">
                  <p
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.7rem",
                      color: accent,
                      marginBottom: "0.5rem",
                    }}
                  >
                    {selectedFolder
                      ? `$ ls ./files/${selectedFolder.name}`
                      : "$ ls ./files"}
                  </p>

                  {selectedFolder && (
                    <button
                      onClick={() => setSelectedFolder(null)}
                      className="btn-outline mb-4"
                      style={{
                        borderColor: accent,
                        color: accent,
                        background: `color-mix(in srgb, ${soft} 50%, var(--surface))`,
                      }}
                    >
                      <ArrowLeft size={12} /> back
                    </button>
                  )}

                  {visibleFiles && visibleFiles.length > 0 ? (
                    visibleFiles.map((file: any, i: number) =>
                      file.type === "folder" ? (
                        <button
                          key={i}
                          onClick={() => setSelectedFolder(file)}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-sm)] transition-all duration-200 w-full text-left"
                          style={{
                            background: `color-mix(in srgb, ${soft} 50%, var(--surface))`,
                            border: "1px solid var(--line)",
                            cursor: "pointer",
                          }}
                        >
                          <Folder
                            size={16}
                            style={{ color: accent, flexShrink: 0 }}
                          />
                          <span
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "0.85rem",
                              color: "var(--ink)",
                              flex: 1,
                            }}
                          >
                            {file.name}
                          </span>
                        </button>
                      ) : file.protection ? (
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
                          onClick={() =>
                            window.open(
                              file.url,
                              "_blank",
                              "noopener,noreferrer"
                            )
                          }
                          className="flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-sm)] transition-all duration-200 w-full text-left"
                          style={{
                            background: `color-mix(in srgb, ${soft} 50%, var(--surface))`,
                            border: "1px solid var(--line)",
                            cursor: "pointer",
                          }}
                        >
                          <FileText
                            size={16}
                            style={{ color: accent, flexShrink: 0 }}
                          />
                          <span
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "0.85rem",
                              color: "var(--ink)",
                              flex: 1,
                            }}
                          >
                            {file.name}
                          </span>
                        </button>
                      )
                    )
                  ) : (
                    <p
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.8rem",
                        color: "var(--ink-secondary)",
                      }}
                    >
                      empty folder
                    </p>
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
