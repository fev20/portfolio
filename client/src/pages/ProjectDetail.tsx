import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Github,
  Globe,
  BookOpen,
  Tag,
  Folder,
  FileText,
} from "lucide-react";
import { useProjects, type Project, type ProjectFolder } from "@/data/projects";
import {
  getProjectAccent,
  getProjectAppearance,
} from "@/lib/projectAppearance";
import ProtectedDownload from "@/components/ProtectedDownload";
import PageTransition from "@/components/PageTransition";
import ProjectMedia from "@/components/ProjectMedia";
import { projectAssetUrl } from "@/lib/projectMedia";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const projects = useProjects();
  const project = projects.find(p => p.id === id);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [id]);

  function backToProjects() {
    sessionStorage.setItem("pendingScroll", "projects");
    navigate("/");
  }

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
          <button
            type="button"
            onClick={backToProjects}
            className="mt-4 btn-outline"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProjectDetailContent
      key={project.id}
      project={project}
      onBack={backToProjects}
    />
  );
}

function ProjectDetailContent({
  project,
  onBack,
}: {
  project: Project;
  onBack: () => void;
}) {
  const accent = getProjectAccent(project);
  const { soft, bright, number } = getProjectAppearance(project);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<ProjectFolder | null>(null);

  const metadata = [
    { label: "소속", value: project.organization },
    { label: "역할", value: project.role },
    { label: "기간", value: project.period },
    { label: "상태", value: project.status },
  ].filter(field => field.value?.trim());
  const links = [
    { href: project.links.site, label: "사이트 보기", Icon: Globe },
    { href: project.links.github, label: "GitHub 보기", Icon: Github },
    { href: project.links.report, label: "보고서 보기", Icon: BookOpen },
  ]
    .map(link => ({ ...link, href: projectAssetUrl(link.href ?? "") }))
    .filter(link => link.href);
  const sections = project.sections?.filter(
    section => section.paragraphs?.length || section.items?.length
  );

  const visibleFiles = selectedFolder ? selectedFolder.files : project.files;
  const previewFile = project.files?.find(
    file =>
      file.type !== "folder" &&
      !file.protection &&
      /^\/(?!\/).*\.pdf$/i.test(file.url) &&
      projectAssetUrl(file.url)
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
            `$ loading ${project.tags[0]?.toLowerCase() || "project"} modules...`,
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
          <div className="relative z-10 max-w-3xl mx-auto px-6 pt-16 pb-28 lg:pl-24 lg:pb-16">
            {/* Back button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              type="button"
              onClick={onBack}
              className="flex min-h-11 items-center gap-2 mb-10 group"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.8rem",
                color: "var(--ink-secondary)",
              }}
            >
              <ArrowLeft
                size={14}
                aria-hidden="true"
                className="transition-transform group-hover:-translate-x-1"
              />
              프로젝트 목록으로
            </motion.button>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div
                className="text-7xl mb-4 select-none"
                style={{
                  fontFamily: "var(--font-mono-label)",
                  color: number,
                  lineHeight: 1,
                }}
              >
                {project.number}
              </div>
              <h1
                className="[overflow-wrap:anywhere]"
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

              {metadata.length > 0 && (
                <dl className="mb-5 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                  {metadata.map(field => (
                    <div key={field.label} className="flex min-w-0 gap-2">
                      <dt className="w-10 shrink-0 text-muted-foreground">
                        {field.label}
                      </dt>
                      <dd className="[overflow-wrap:anywhere] font-semibold">
                        {field.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center gap-1"
                    style={{
                      fontFamily: "var(--font-mono-label)",
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
                    className="whitespace-pre-wrap [overflow-wrap:anywhere]"
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
              {links.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {links.map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline min-h-11"
                      style={{
                        borderColor: accent,
                        color: accent,
                        background: `color-mix(in srgb, ${soft} 50%, var(--surface))`,
                      }}
                    >
                      <Icon size={14} aria-hidden="true" />
                      {label}
                    </a>
                  ))}
                </div>
              )}

              {sections?.map(section => (
                <section key={section.title}>
                  <h2
                    className="mb-3 text-lg font-bold tracking-normal"
                    style={{ fontFamily: "var(--font-body)", color: accent }}
                  >
                    {section.title}
                  </h2>
                  <div className="space-y-3 leading-relaxed text-muted-foreground">
                    {section.paragraphs?.map(paragraph => (
                      <p
                        key={paragraph}
                        className="whitespace-pre-wrap [overflow-wrap:anywhere]"
                      >
                        {paragraph}
                      </p>
                    ))}
                    {section.items && section.items.length > 0 && (
                      <ul className="list-disc space-y-1.5 pl-5">
                        {section.items.map(item => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              ))}

              <ProjectMedia
                project={project}
                accent={accent}
                borderColor={bright}
              />

              {/* Preview */}
              {previewFile && previewFile.type !== "folder" && (
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
                      src={`${projectAssetUrl(previewFile.url)}#toolbar=0&navpanes=0&scrollbar=0&page=1&view=FitH`}
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
                    visibleFiles.map((file, i) =>
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
                          onClick={() => {
                            const url = projectAssetUrl(file.url);
                            if (url) {
                              window.open(url, "_blank", "noopener,noreferrer");
                            }
                          }}
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
