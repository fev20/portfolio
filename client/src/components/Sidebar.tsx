import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { verifyAuth, logout, UserRole } from "@/utils/auth";
import {
  profile,
  education,
  certifications,
} from "@/data/portfolio";
import { useProjects } from "@/data/projects";
import { orderedExperiences } from "@/lib/experienceNavigation";
import { PROJECT_CATEGORY_ORDER } from "@/lib/projectAppearance";

const SIDEBAR_WIDTH = "240px";

function jumpTo(scrollId: string) {
  document.getElementById(scrollId)?.scrollIntoView({ behavior: "instant", block: "start" });
}

const NAV_ITEMS = [
  { id: "hero",       label: "Home",       num: "00", sub: [] as string[] },
  { id: "about",      label: "About",      num: "01", sub: [] as string[] },
  { id: "skills",     label: "Skills",     num: "02", sub: [] as string[] },
  { id: "projects",   label: "Projects",   num: "03", sub: [] as string[] },
  { id: "experience", label: "Experience", num: "04", sub: [] as string[] },
  { id: "education",  label: "Education & Certifications", num: "05", sub: [] as string[] },
  { id: "demos",      label: "Demos",      num: "06", sub: [] as string[] },
  { id: "ai-development", label: "AI in Practice", num: "07", sub: [] as string[] },
];

function LoginBlock() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const check = () => {
      verifyAuth().then((res) => {
        if (res?.valid && res.role) setUserRole(res.role as UserRole);
        else setUserRole(null);
      });
    };
    check();
    window.addEventListener("focus", check);
    return () => window.removeEventListener("focus", check);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const roleLabel: Record<UserRole, string> = {
    admin: "admin",
    sekurity: "seKUrity",
    whs: "WHS",
  };

  const roleColor: Record<UserRole, string> = {
    admin: "var(--ink-secondary)",
    sekurity: "var(--sidebar-ink)",
    whs: "var(--rose)",
  };

  return (
    <div className="px-4 py-3">
      {userRole ? (
        <div
          className="flex items-center justify-between px-3 py-2 rounded-[var(--radius)]"
          style={{
            background: "var(--sidebar-tint)",
            border: "1px solid var(--sidebar-line)",
          }}
        >
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "var(--ink-secondary)", marginBottom: "1px" }}>
              logged in as
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", fontWeight: 600, color: roleColor[userRole] }}>
              {roleLabel[userRole]}
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "1px solid var(--sidebar-line)",
              borderRadius: "var(--radius-sm)",
              padding: "3px 8px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
              color: "var(--ink-secondary)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--sidebar-ink)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--sidebar-ink)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--ink-secondary)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--sidebar-line)";
            }}
          >
            logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => setLocation("/login")}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-[var(--radius-sm)] transition-all duration-200"
          style={{
            background: "var(--sidebar-tint)",
            border: "1px solid var(--sidebar-line)",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--sidebar-active)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--sidebar-ink)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--sidebar-tint)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--sidebar-line)";
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--sidebar-ink)" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "var(--sidebar-ink)" }}>
            login
          </span>
        </button>
      )}
    </div>
  );
}

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [location, setLocation] = useLocation();
  const isMainPage = location === "/";
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const projects = useProjects();

  const navigate = (path: string) => {
    setLocation(path);
  };

  type SubItem = {
    label: string;
    path: string | null;
    scrollId?: string;
    children?: { label: string; path: string }[];
  };

  const navItems = NAV_ITEMS.map((item) => {
    if (item.id === "projects") return {
      ...item,
      subItems: PROJECT_CATEGORY_ORDER.map((cat): SubItem => ({
        label: cat,
        path: null,
        scrollId: `project-cat-${cat.replace(/\s+/g, "-")}`,
        children: projects
          .filter((p) => p.category === cat)
          .map(p => ({ label: p.title, path: `/project/${encodeURIComponent(p.id)}` })),
      })),
    };
    if (item.id === "experience") return {
      ...item,
      subItems: orderedExperiences.map(({ experience, routeId }): SubItem => ({
        label: experience.title,
        path: null,
        scrollId: `experience-${routeId}`,
      })),
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
      if (!document.getElementById("hero")) {
        setActiveSection("hero");
        return;
      }
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
    window.addEventListener("resize", getActive);
    window.addEventListener("portfolio:ready", getActive);
    getActive();
    return () => {
      window.removeEventListener("scroll", getActive);
      window.removeEventListener("resize", getActive);
      window.removeEventListener("portfolio:ready", getActive);
    };
  }, [isMainPage]);

  useEffect(() => {
    if (!isMainPage) return;
    const consumePendingScroll = () => {
      const pending = sessionStorage.getItem("pendingScroll");
      if (!pending || !document.getElementById(pending)) return;
      sessionStorage.removeItem("pendingScroll");
      jumpTo(pending);
    };
    window.addEventListener("portfolio:ready", consumePendingScroll);
    consumePendingScroll();
    return () => window.removeEventListener("portfolio:ready", consumePendingScroll);
  }, [isMainPage]);

  const scrollToSection = (id: string) => {
    if (!isMainPage) {
      sessionStorage.setItem("pendingScroll", id);
      setLocation("/");
      return;
    }
    const section = document.getElementById(id);
    if (section) jumpTo(id);
    else sessionStorage.setItem("pendingScroll", id);
  };

  const handleSubClick = (scrollId?: string, path?: string | null) => {
    if (scrollId) {
      if (!isMainPage) {
        sessionStorage.setItem("pendingScroll", scrollId);
        setLocation("/");
      } else {
        jumpTo(scrollId);
      }
    } else if (path) {
      navigate(path);
    }
  };

  const displayName = profile.name === "이름" ? "fev20" : profile.name;
  const currentNavId = isMainPage
    ? activeSection
    : location.startsWith("/project/")
      ? "projects"
      : location.split("/")[1];

  return (
    <>
      {/* ── Desktop: 종이 노트 스타일 내비게이션 ── */}
      <motion.aside
        initial={{ x: -260, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="fixed left-0 top-0 bottom-0 z-40 hidden lg:flex flex-col"
        style={{
          width: SIDEBAR_WIDTH,
          background: "var(--surface)",
          border: "1px solid var(--sidebar-line)",
          borderLeft: "none",
          boxShadow: "4px 0 20px color-mix(in srgb, var(--ink) 3%, transparent)",
        }}
      >
        {/* ── 최상단 타이틀바 ── */}
        <div
          className="flex items-center gap-2.5 px-4 py-4 flex-shrink-0"
          style={{
            background: "var(--sidebar-tint)",
            borderBottom: "1px solid var(--sidebar-line)",
          }}
        >
          <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--sidebar-ink)" strokeWidth="1.6">
            <path d="M4 4h7a3 3 0 0 1 3 3v14a4 4 0 0 0-4-3H4z" />
            <path d="M14 7a3 3 0 0 1 3-3h3v14h-2a4 4 0 0 0-4 3" />
          </svg>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, fontSynthesis: "none", color: "var(--ink)", letterSpacing: "0.02em" }}>
            portfolio
          </span>
        </div>
        {/* ── login 블록 ── */}
        <LoginBlock />

        {/* ── profile 블록 ── */}
        <div
          className="flex-shrink-0 px-4 py-3"
          style={{ borderBottom: "1px solid var(--sidebar-line)" }}
        >
          <div
            className="mb-2"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "var(--ink-secondary)", letterSpacing: "0.1em" }}
          >
            profile
          </div>
          <div className="flex justify-center mb-3">
            <div
              className="rounded-[var(--radius)] overflow-hidden"
              style={{
                width: "96px",
                height: "96px",
                background: "var(--surface)",
                border: "1px solid var(--sidebar-line)",
              }}
            >
              <img
                src="/profile-soft.png"
                alt="프로필 일러스트"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%" }}
              />
            </div>
          </div>
          <div className="text-center">
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, fontSynthesis: "none", color: "var(--ink)" }}>
              {displayName}
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", color: "var(--ink-secondary)", marginTop: "4px", lineHeight: 1.6 }}>
              건국대학교 글로컬캠퍼스<br />컴퓨터공학과
            </div>
          </div>
        </div>

        {/* ── 구분선 ── */}
        <div style={{ height: "1px", background: "var(--sidebar-line)", flexShrink: 0 }} />

        {/* ── explore 블록 (스크롤 가능) ── */}
        <div className="min-h-0 flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
          <div
            className="px-4 pt-3 pb-1"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "var(--ink-secondary)", letterSpacing: "0.1em" }}
          >
            explore
          </div>
          <nav className="px-2 pb-2" aria-label="포트폴리오 섹션">
            {navItems.map((item) => {
              const isActive = currentNavId === item.id;
              return (
                <div key={item.id} className="border-b border-[var(--sidebar-line)] py-0.5">
                  <div className="flex items-stretch gap-1 rounded-[var(--radius-sm)]" style={{ background: isActive ? "var(--sidebar-active)" : "transparent" }}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      aria-current={isActive ? "location" : undefined}
                      className="relative flex min-h-8 min-w-0 flex-1 items-center gap-2 rounded-[var(--radius-sm)] px-3 py-1.5"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="nav-active"
                          className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full"
                          style={{ background: "var(--sidebar-ink)" }}
                        />
                      )}
                      <span style={{ fontFamily: "var(--font-mono-label)", fontSize: "0.6rem", color: isActive ? "var(--sidebar-ink)" : "var(--ink-secondary)", minWidth: "18px" }}>
                        {item.num}
                      </span>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: isActive ? "var(--ink)" : "var(--ink-secondary)", fontWeight: isActive ? 600 : 400, lineHeight: 1.4, flex: 1, textAlign: "left" }}>
                        {item.label}
                      </span>
                    </button>
                    {item.subItems.length > 0 && (
                      <button
                        type="button"
                        aria-label={`${item.label} 하위 메뉴`}
                        aria-expanded={expandedSection === item.id}
                        onClick={() => setExpandedSection(current => current === item.id ? null : item.id)}
                        className="group grid w-8 shrink-0 place-items-center rounded-[var(--radius-sm)] text-[var(--ink-secondary)] hover:bg-[var(--sidebar-tint)]"
                      >
                        <ChevronRight size={14} aria-hidden="true" className="transition-transform group-aria-expanded:rotate-90" />
                      </button>
                    )}
                  </div>

                  {item.subItems.length > 0 && expandedSection === item.id && (
                    <div className="ml-8 mt-0.5 space-y-0" style={{ borderTop: "1px solid var(--sidebar-line)", paddingTop: "4px", marginBottom: "8px" }}>
                      {item.subItems.map((sub, si) => (
                        <div key={si}>
                          {/* 상위 subItem 행 */}
                          <div
                            className="flex items-center gap-1.5 py-0.5 pl-2 transition-all"
                            style={{
                              borderLeft: `1px solid ${isActive ? "color-mix(in srgb, var(--sidebar-ink) 18%, transparent)" : "color-mix(in srgb, var(--sidebar-ink) 5%, transparent)"}`,
                              cursor: sub.path || sub.scrollId ? "pointer" : "default",
                              marginTop: sub.label === "── Certifications ──" ? "10px" : undefined,
                            }}
                          >
                            {/* 글자 클릭 → 스크롤 이동 */}
                            <button
                              type="button"
                              disabled={!sub.path && !sub.scrollId}
                              title={sub.label}
                              onClick={() => handleSubClick(sub.scrollId, sub.path)}
                              className="text-[var(--ink-secondary)] enabled:hover:text-[var(--sidebar-ink)] enabled:focus-visible:text-[var(--sidebar-ink)]"
                              style={{
                                fontFamily: "var(--font-mono-label)",
                                fontSize: "0.62rem",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "120px",
                                transition: "color 0.2s",
                                flex: 1,
                                textAlign: "left",
                                cursor: sub.path || sub.scrollId ? "pointer" : "default",
                              }}
                            >
                              {sub.path || sub.scrollId ? "> " : ""}{sub.label}
                            </button>

                            {/* 토글 버튼 클릭 → 토글만 */}
                            {sub.children && sub.children.length > 0 && (
                              <button
                                type="button"
                                aria-label={`${sub.label} 프로젝트 목록`}
                                aria-expanded={expandedCategory === sub.label}
                                onClick={() => setExpandedCategory(current => current === sub.label ? null : sub.label)}
                                className="group grid size-6 shrink-0 place-items-center rounded text-[var(--ink-secondary)] hover:bg-[var(--sidebar-tint)]"
                              >
                                <ChevronRight size={12} aria-hidden="true" className="transition-transform group-aria-expanded:rotate-90" />
                              </button>
                            )}
                          </div>

                          {/* children 프로젝트 목록 */}
                          {sub.children && sub.children.length > 0 && expandedCategory === sub.label && (
                            <div className="ml-3 mt-0.5" style={{ borderLeft: "1px solid var(--sidebar-line)" }}>
                              {sub.children.map((child, ci) => (
                                <Link
                                  key={ci}
                                  href={child.path}
                                  aria-label={child.label}
                                  title={child.label}
                                  className="flex items-center py-0.5 pl-3 text-[var(--ink-secondary)] transition-colors hover:text-[var(--sidebar-ink)] focus-visible:text-[var(--sidebar-ink)]"
                                >
                                  <span
                                    style={{
                                      fontFamily: "var(--font-mono-label)",
                                      fontSize: "0.6rem",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      maxWidth: "110px",
                                      transition: "color 0.2s",
                                    }}
                                  >
                                    {">> "}{child.label}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          )}
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
        <div style={{ height: "1px", background: "var(--sidebar-line)", flexShrink: 0 }} />

        {/* ── contact 블록 ── */}
        <div className="flex-shrink-0 pb-4">
          <div
            style={{
              padding: "10px 16px 8px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              color: "var(--ink-secondary)",
              letterSpacing: "0.12em",
            }}
          >
            contact
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
                width: "36px", height: "36px", borderRadius: "var(--radius-sm)",
                border: "1px solid var(--sidebar-line)",
                background: "var(--sidebar-tint)",
                color: "var(--ink-secondary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--sidebar-ink)";
                e.currentTarget.style.color = "var(--sidebar-ink)";
                e.currentTarget.style.background = "var(--sidebar-active)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--sidebar-line)";
                e.currentTarget.style.color = "var(--ink-secondary)";
                e.currentTarget.style.background = "var(--sidebar-tint)";
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
                width: "36px", height: "36px", borderRadius: "var(--radius-sm)",
                border: "1px solid var(--sidebar-line)",
                background: "var(--sidebar-tint)",
                color: "var(--ink-secondary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--sidebar-ink)";
                e.currentTarget.style.color = "var(--sidebar-ink)";
                e.currentTarget.style.background = "var(--sidebar-active)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--sidebar-line)";
                e.currentTarget.style.color = "var(--ink-secondary)";
                e.currentTarget.style.background = "var(--sidebar-tint)";
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
                width: "36px", height: "36px", borderRadius: "var(--radius-sm)",
                border: "1px solid var(--sidebar-line)",
                background: "var(--sidebar-tint)",
                color: "var(--ink-secondary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--sidebar-ink)";
                e.currentTarget.style.color = "var(--sidebar-ink)";
                e.currentTarget.style.background = "var(--sidebar-active)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--sidebar-line)";
                e.currentTarget.style.color = "var(--ink-secondary)";
                e.currentTarget.style.background = "var(--sidebar-tint)";
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
      <nav
        aria-label="모바일 포트폴리오 섹션"
        className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 px-1 pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] sm:grid-cols-8 lg:hidden"
        style={{
          background: "var(--surface)",
          borderTop: "1px solid var(--sidebar-line)",
          boxShadow: "0 -4px 20px color-mix(in srgb, var(--ink) 4%, transparent)",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = currentNavId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              aria-current={isActive ? "location" : undefined}
              className="flex min-h-11 min-w-0 flex-col items-center justify-center gap-0.5 rounded px-1 py-1 aria-[current=location]:bg-[var(--sidebar-active)]"
            >
              <span style={{ fontFamily: "var(--font-mono-label)", fontSize: "0.55rem", color: isActive ? "var(--sidebar-ink)" : "var(--ink-secondary)" }}>
                {item.num}
              </span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", color: isActive ? "var(--ink)" : "var(--ink-secondary)", fontWeight: isActive ? 600 : 400 }}>
                {item.id === "education" ? "Education" : item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
