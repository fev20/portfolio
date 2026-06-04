// HeroSection.tsx — 첫 화면 히어로 섹션
// Design: Nebula Hacker — full-screen hero with typing effect and nebula background

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Mail, ExternalLink, FileDown, BookOpen } from "lucide-react";
import { profile, files } from "@/data/portfolio";

const TYPING_TEXTS = [
  "Hardware Security",
  "Web Security",
  "CTF Player",
  "Secure Systems",
];

function useTypingEffect(texts: string[], speed = 80, pause = 1800) {
  const [displayed, setDisplayed] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex((c) => c + 1), speed);
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((c) => c - 1), speed / 2);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setTextIndex((i) => (i + 1) % texts.length);
    }

    setDisplayed(current.slice(0, charIndex));
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, textIndex, texts, speed, pause]);

  return displayed;
}

export default function HeroSection() {
  const typedText = useTypingEffect(TYPING_TEXTS);

  const handleFileAction = (file: (typeof files)[0]) => {
    if (!file.url) return;
    if (file.type === "download") {
      const a = document.createElement("a");
      a.href = file.url;
      a.download = file.label;
      a.click();
    } else {
      window.open(file.url, "_blank", "noopener noreferrer");
    }
  };

  const resumeFile = files.find((f) => f.id === "resume");

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: profile.github,
      show: !!profile.github,
    },
    {
      icon: Mail,
      label: "Email",
      href: `mailto:${profile.email}`,
      show: !!profile.email,
    },
    {
      icon: BookOpen,
      label: "Blog",
      href: profile.blog,
      show: !!profile.blog,
    },
    {
      icon: ExternalLink,
      label: "Notion",
      href: profile.notion,
      show: !!profile.notion,
    },
  ].filter((l) => l.show);

  return (
    <>
      {/* 모바일 전용 안내 문구 */}
      <div
  className="lg:hidden fixed top-0 left-0 right-0 z-50 w-full text-center py-1.5"
        style={{
          background: "rgba(100,255,218,0.03)",
          borderBottom: "1px solid rgba(100,255,218,0.06)",
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem",
            color: "#4a5568",
            letterSpacing: "0.05em",
          }}
        >
          데스크탑 환경에 최적화된 포트폴리오입니다
        </span>
      </div>
      <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ paddingTop: "80px" }}
    >
      {/* Nebula hero background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663647836067/boFjbtwQQCT7GcN6J2dXvF/hero-bg-Sx9XijuVXGx4SLWLNi89Mv.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.35,
        }}
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(5,11,24,0.85) 0%, rgba(5,11,24,0.6) 50%, rgba(5,11,24,0.85) 100%)",
        }}
      />
      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: "linear-gradient(to bottom, transparent, #050b18)",
        }}
      />

      <div className="container relative z-10">
        <div className="max-w-3xl">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4"
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: "#64ffda",
                fontSize: "0.9rem",
                letterSpacing: "0.08em",
              }}
            >
              $ whoami
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(2.8rem, 7vw, 5rem)",
              fontWeight: 700,
              color: "#ccd6f6",
              lineHeight: 1.1,
              marginBottom: "0.5rem",
            }}
          >
            {profile.name}
          </motion.h1>

          {/* Typing effect subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-6"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
              fontWeight: 500,
              color: "#64ffda",
              minHeight: "2.5rem",
              display: "flex",
              alignItems: "center",
              gap: "2px",
            }}
          >
            {typedText}
            <span
              className="cursor-blink"
              style={{
                display: "inline-block",
                width: "3px",
                height: "1.4em",
                background: "#64ffda",
                marginLeft: "2px",
                verticalAlign: "middle",
              }}
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1rem",
              color: "#8892b0",
              lineHeight: 1.7,
              maxWidth: "560px",
              marginBottom: "2.5rem",
            }}
          >
            {profile.tagline}
          </motion.p>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            {/* Social links */}
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="btn-neon flex items-center gap-2"
              >
                <link.icon size={14} />
                {link.label}
              </a>
            ))}


          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex items-center gap-3"
          >
            <div
              className="w-px h-12"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, #64ffda, transparent)",
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                color: "#4a5568",
                letterSpacing: "0.15em",
                writingMode: "horizontal-tb",
              }}
            >
              scroll to explore
            </span>
          </motion.div>
        </div>
      </div>
    </section>
    </>
  );
}
