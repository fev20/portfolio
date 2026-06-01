// Sidebar.tsx — 하나의 큰 터미널 창 사이드바
// Design: Nebula Hacker × Retro Terminal
// Layout: [profile.exe 이미지] → [components.exe 섹션 목록] → [contact.exe 고정]

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useRouter } from "wouter";
import {
  profile,
  skills,
  projects,
  experiences,
  education,
  certifications,
} from "@/data/portfolio";

const SIDEBAR_WIDTH = "240px";

const NAV_ITEMS = [
  { id: "hero",       label: "Home",       num: "00", sub: [] as string[] },
  { id: "about",      label: "About",      num: "01", sub: [] as string[] },
  { id: "skills",     label: "Skills",     num: "02", sub: [] as string[] },
  { id: "projects",   label: "Projects",   num: "03", sub: [] as string[] },
  { id: "experience", label: "Experience", num: "04", sub: [] as string[] },
  { id: "education",  label: "Education & Certifications",  num: "05", sub: [] as string[] },
];

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [location] = useLocation();
  const router = useRouter();
  const isMainPage = location === "/";

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleCollapse = (id: string) => {
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  // 하위 항목 채우기 (label + path)
  type SubItem = { label: string; path: string | null; scrollId?: string };
  const navItems = NAV_ITEMS.map((item) => {
    if (item.id === "skills") return {
      ...item,
      subItems: skills.map((s): SubItem => ({ label: s.category, path: null, scrollId: `skill-${s.category}` })),
    };
    if (item.id === "projects") return {
      ...item,
      subItems: projects.map((p): SubItem => ({ label: p.title, path: `/project/${p.id}`, scrollId: `project-${p.id}` })),
    };
    if (item.id === "experience") return {
      ...item,
      subItems: experiences.map((e, i): SubItem => ({ label: e.title, path: `/experience/${i}`, scrollId: `experience-${i}` })),
    };
    if (item.id === "education") return {
      ...item,
      subItems: [
        { label: "── Education ──", path: null },
        ...education.map((e, i): SubItem => ({ label: e.title, path: `/education/edu/${i}` })),
        { label: "── Certifications ──", path: null },
        ...certifications.map((c, i): SubItem => ({ label: c.title, path: `/education/cert/${i}` })),
      ],
    };
    return { ...item, subItems: [] as SubItem[] };
  });

  useEffect(() => {
    if (!isMainPage) return;
    const getActive = () => {
      const scrollY = window.scrollY;
      const windowH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      if (scrollY + windowH >= docH - 60) { setActiveSection("contact"); return; }
      const trigger = scrollY + windowH * 0.3;
      let current = "hero";
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= trigger) current = item.id;
      }
      const contactEl = document.getElementById("contact");
      if (contactEl && contactEl.offsetTop <= trigger) current = "contact";
      setActiveSection(current);
    };
    window.addEventListener("scroll", getActive, { passive: true });
    getActive();
    return () => window.removeEventListener("scroll", getActive);
  }, [isMainPage]);

  const scrollTo = (id: string) => {
    if (!isMainPage) { window.location.hash = `/`; return; }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const displayName = profile.name === "이름" ? "fev20" : profile.name;

  return (
    <>
      {/* ── Desktop: 하나의 큰 터미널 창 ── */}
      <motion.aside
        initial={{ x: -260, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="fixed left-0 top-0 bottom-0 z-40 hidden lg:flex flex-col"
        style={{
          width: SIDEBAR_WIDTH,
          background: "rgba(8, 14, 28, 0.98)",
          border: "1px solid rgba(100,255,218,0.15)",
          borderLeft: "none",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* ── 최상단 타이틀바 ── */}
        <div
          className="flex items-center justify-between px-3 py-2 flex-shrink-0"
          style={{
            background: "rgba(100,255,218,0.06)",
            borderBottom: "1px solid rgba(100,255,218,0.1)",
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm" style={{ background: "rgba(100,255,218,0.5)" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "#64ffda", letterSpacing: "0.1em" }}>
              portfolio.exe
            </span>
          </div>
          <div className="flex items-center gap-1">
            {["—", "□", "×"].map((s) => (
              <span key={s} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "#2d3748", padding: "0 2px" }}>{s}</span>
            ))}
          </div>
        </div>

        {/* ── profile.exe 블록 ── */}
        <div
          className="flex-shrink-0 px-4 py-4"
          style={{ borderBottom: "1px solid rgba(100,255,218,0.08)" }}
        >
          <div
            className="mb-2"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#64ffda44", letterSpacing: "0.1em" }}
          >
            profile.exe
          </div>
          <div className="flex justify-center mb-3">
            <div
              className="rounded-lg overflow-hidden"
              style={{
                width: "120px",
                height: "120px",
                border: "1px solid rgba(100,255,218,0.2)",
                boxShadow: "0 0 16px rgba(100,255,218,0.06)",
              }}
            >
              <img
                src="/Me.jpg"
                alt="profile"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", filter: "brightness(0.9) contrast(1.05)" }}
              />
            </div>
          </div>
          <div className="text-center">
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#f1f5f9" }}>
              {displayName}
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.68rem", color: "#94a3b8", marginTop: "4px", lineHeight: 1.6 }}>
              건국대학교 글로컬캠퍼스<br />컴퓨터공학과
            </div>
          </div>
        </div>

        {/* ── 구분선 ── */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(100,255,218,0.25), transparent)", flexShrink: 0 }} />

        {/* ── components.exe 블록 (스크롤 가능) ── */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div
            className="px-4 pt-3 pb-1"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#64ffda44", letterSpacing: "0.1em" }}
          >
            components.exe
          </div>
          <nav className="px-2 pb-2">
            {navItems.map((item) => {
              const isActive = isMainPage
                ? activeSection === item.id
                : item.id === "education"
                  ? location.startsWith("/education")
                  : location.startsWith(`/${item.id}`);
              return (
                <div key={item.id} className="mb-1" style={{ borderBottom: "1px solid rgba(100,255,218,0.15)", paddingBottom: "8px" }}>
                  <button
                    onClick={() => scrollTo(item.id)}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded transition-all relative"
                    style={{ background: isActive ? "rgba(100,255,218,0.07)" : "transparent" }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full"
                        style={{ background: "#64ffda" }}
                      />
                    )}
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: isActive ? "#64ffda" : "#475569", minWidth: "18px" }}>
                      {item.num}
                    </span>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.82rem", color: isActive ? "#e2e8f0" : "#94a3b8", fontWeight: isActive ? 600 : 400, flex: 1, textAlign: "left" }}>
                      {item.label}
                    </span>
                    {item.subItems.length > 0 && (
                      <span
                        onClick={(e) => { e.stopPropagation(); toggleCollapse(item.id); }}
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.85rem",
                          color: isActive ? "#64ffda" : "#64748b",
                          display: "inline-block",
                          transform: collapsed[item.id] ? "rotate(-90deg)" : "rotate(0deg)",
                          transition: "transform 0.2s",
                          padding: "2px 6px",
                          lineHeight: 1,
                          cursor: "pointer",
                        }}
                      >
                        ▾
                      </span>
                    )}
                  </button>

                  {item.subItems.length > 0 && !collapsed[item.id] && (
                    <div className="ml-8 mt-0.5 space-y-0" style={{ borderTop: "1px solid rgba(100,255,218,0.1)", paddingTop: "4px", marginBottom: "8px" }}>
                      {item.subItems.map((sub, si) => (
                        <div
                          key={si}
                          onClick={() => {
                            if (sub.scrollId) {
                              if (!isMainPage) {
                                window.location.href = "/";
                                setTimeout(() => {
                                  document.getElementById(sub.scrollId!)?.scrollIntoView({ behavior: "smooth" });
                                }, 600);
                              } else {
                                document.getElementById(sub.scrollId)?.scrollIntoView({ behavior: "smooth" });
                              }
                            } else if (sub.path) {
                              navigate(sub.path);
                            }
                          }}
                          className="flex items-center gap-1.5 py-0.5 pl-2 transition-all"
                          style={{
                            borderLeft: `1px solid ${isActive ? "rgba(100,255,218,0.18)" : "rgba(100,255,218,0.05)"}`,
                            cursor: sub.path || sub.scrollId ? "pointer" : "default",
                            marginTop: sub.label === "── Certifications ──" ? "10px" : undefined,
                          }}
                          onMouseEnter={(e) => { if (sub.path) (e.currentTarget.querySelector('span') as HTMLElement).style.color = "#64ffda"; }}
                          onMouseLeave={(e) => { if (sub.path) (e.currentTarget.querySelector('span') as HTMLElement).style.color = isActive ? "#64ffda" : "#64748b"; }}
                        >
                          <span
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: "0.6rem",
                              color: isActive ? "#64ffda" : "#64748b",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "145px",
                              transition: "color 0.2s",
                            }}
                          >
                            {sub.path ? "> " : ""}{sub.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* ── 구분선 ── */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(100,255,218,0.25), transparent)", flexShrink: 0 }} />

        {/* ── contact.exe 블록 ── */}
        <div className="flex-shrink-0 pb-4">
          <div
            style={{
              padding: "10px 16px 8px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.62rem",
              color: "#64ffda55",
              letterSpacing: "0.12em",
            }}
          >
            contact.exe
          </div>
          <div className="flex items-center justify-around px-4">
            {/* GitHub */}
            <a
              href="https://github.com/fev20"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="flex items-center justify-center transition-all"
              style={{
                width: "36px", height: "36px", borderRadius: "50%",
                border: "1px solid rgba(100,255,218,0.15)",
                background: "rgba(100,255,218,0.04)",
                color: "#64748b",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(100,255,218,0.5)";
                e.currentTarget.style.color = "#64ffda";
                e.currentTarget.style.background = "rgba(100,255,218,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(100,255,218,0.15)";
                e.currentTarget.style.color = "#64748b";
                e.currentTarget.style.background = "rgba(100,255,218,0.04)";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            {/* Blog */}
            <a
              href={profile.blog}
              target="_blank"
              rel="noopener noreferrer"
              title="Blog"
              className="flex items-center justify-center transition-all"
              style={{
                width: "36px", height: "36px", borderRadius: "50%",
                border: "1px solid rgba(100,255,218,0.15)",
                background: "rgba(100,255,218,0.04)",
                color: "#64748b",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(100,255,218,0.5)";
                e.currentTarget.style.color = "#64ffda";
                e.currentTarget.style.background = "rgba(100,255,218,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(100,255,218,0.15)";
                e.currentTarget.style.color = "#64748b";
                e.currentTarget.style.background = "rgba(100,255,218,0.04)";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </a>
            {/* Email */}
            <a
              href="mailto:isemy0317@kku.ac.kr"
              title="Email"
              className="flex items-center justify-center transition-all"
              style={{
                width: "36px", height: "36px", borderRadius: "50%",
                border: "1px solid rgba(100,255,218,0.15)",
                background: "rgba(100,255,218,0.04)",
                color: "#64748b",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(100,255,218,0.5)";
                e.currentTarget.style.color = "#64ffda";
                e.currentTarget.style.background = "rgba(100,255,218,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(100,255,218,0.15)";
                e.currentTarget.style.color = "#64748b";
                e.currentTarget.style.background = "rgba(100,255,218,0.04)";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </a>
          </div>
        </div>
      </motion.aside>

      {/* ── Mobile bottom nav ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden flex items-center justify-around py-2"
        style={{ background: "rgba(5,11,24,0.97)", borderTop: "1px solid rgba(100,255,218,0.08)", backdropFilter: "blur(16px)" }}
      >
        {[...navItems, { id: "contact", label: "Contact", num: "06", sub: [], subItems: [] }]
          .filter((i) => i.id !== "hero")
          .map((item) => {
            const isActive = activeSection === item.id && isMainPage;
            return (
              <button key={item.id} onClick={() => scrollTo(item.id)} className="flex flex-col items-center gap-0.5 px-2 py-1">
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: isActive ? "#64ffda" : "#4a5568", fontWeight: 600 }}>{item.num}</span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", color: isActive ? "#ccd6f6" : "#4a5568" }}>{item.label}</span>
              </button>
            );
          })}
      </div>
    </>
  );
}
