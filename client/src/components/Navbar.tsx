// Navbar.tsx — 상단 고정 네비게이션
// Design: Nebula Hacker — frosted glass navbar with scroll indicator

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Detect active section
      const sections = NAV_ITEMS.map((item) => item.href.replace("#", ""));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-40"
      style={{
        background: scrolled
          ? "rgba(5, 11, 24, 0.92)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(100,255,218,0.08)"
          : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2"
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: "#64ffda",
                fontSize: "1.1rem",
                fontWeight: 600,
              }}
            >
              &gt;_
            </span>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "#ccd6f6",
                fontSize: "0.9rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              portfolio
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item, i) => {
              const id = item.href.replace("#", "");
              const isActive = activeSection === id;
              return (
                <button
                  key={item.label}
                  onClick={() => scrollTo(item.href)}
                  className="relative px-3 py-1.5 text-sm transition-colors"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: isActive ? "#64ffda" : "#8892b0",
                    fontSize: "0.78rem",
                  }}
                >
                  <span style={{ color: "#64ffda44", marginRight: "2px" }}>
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-3 right-3 h-px"
                      style={{ background: "#64ffda" }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span
              className="block w-5 h-px transition-all"
              style={{
                background: "#64ffda",
                transform: menuOpen ? "rotate(45deg) translate(2px, 2px)" : "none",
              }}
            />
            <span
              className="block w-5 h-px transition-all"
              style={{
                background: "#64ffda",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-5 h-px transition-all"
              style={{
                background: "#64ffda",
                transform: menuOpen ? "rotate(-45deg) translate(2px, -2px)" : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden"
          style={{
            background: "rgba(5,11,24,0.98)",
            borderBottom: "1px solid rgba(100,255,218,0.1)",
          }}
        >
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item.label}
              onClick={() => scrollTo(item.href)}
              className="flex items-center gap-3 w-full px-6 py-3 text-left"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.85rem",
                color: "#ccd6f6",
                borderBottom: "1px solid rgba(100,255,218,0.05)",
              }}
            >
              <span style={{ color: "#64ffda", fontSize: "0.7rem" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </motion.header>
  );
}
