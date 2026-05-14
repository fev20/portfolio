// ContactSection.tsx — 연락처 섹션
// Design: Nebula Hacker — centered with glowing contact cards

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Github, ExternalLink, BookOpen, Linkedin } from "lucide-react";
import { profile } from "@/data/portfolio";

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const contacts = [
    {
      icon: Mail,
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
      color: "#64ffda",
      show: !!profile.email,
    },
    {
      icon: Github,
      label: "GitHub",
      value: profile.github?.replace("https://github.com/", "@"),
      href: profile.github,
      color: "#ccd6f6",
      show: !!profile.github,
    },
    {
      icon: BookOpen,
      label: "Blog",
      value: "블로그 방문하기",
      href: profile.blog,
      color: "#a78bfa",
      show: !!profile.blog,
    },
    {
      icon: ExternalLink,
      label: "Notion",
      value: "노션 페이지",
      href: profile.notion,
      color: "#38bdf8",
      show: !!profile.notion,
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "LinkedIn 프로필",
      href: profile.linkedin,
      color: "#0ea5e9",
      show: !!profile.linkedin,
    },
  ].filter((c) => c.show);

  return (
    <section id="contact" className="relative py-28 pb-40" ref={ref}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(100,255,218,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-14"
        >
          <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem",
            color: "#64ffda66",
            letterSpacing: "0.12em",
            marginBottom: "4px",
          }}
        >
          contact.exe
        </div>
        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            fontWeight: 700,
            color: "#ccd6f6",
          }}
        >
          Contact
        </h2>
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(100,255,218,0.15)", maxWidth: "200px" }}
          />
        </motion.div>

        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1rem",
              color: "#8892b0",
              lineHeight: 1.8,
              marginBottom: "2.5rem",
            }}
          >
            보안, 개발, 또는 협업에 관심이 있으시다면 언제든지 연락해 주세요.
            새로운 기회와 도전을 항상 환영합니다.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contacts.map((contact, i) => (
              <motion.a
                key={contact.label}
                href={contact.href}
                target={contact.href?.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="nebula-card rounded-xl p-4 flex items-center gap-4 group"
                style={{ textDecoration: "none" }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: `${contact.color}10`,
                    border: `1px solid ${contact.color}25`,
                  }}
                >
                  <contact.icon size={16} style={{ color: contact.color }} />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.65rem",
                      color: contact.color,
                      letterSpacing: "0.1em",
                      marginBottom: "2px",
                    }}
                  >
                    {contact.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "0.85rem",
                      color: "#ccd6f6",
                    }}
                  >
                    {contact.value}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="absolute bottom-0 left-0 right-0 py-6 text-center"
        style={{
          borderTop: "1px solid rgba(100,255,218,0.06)",
        }}
      >
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.7rem",
            color: "#2d3748",
          }}
        >
          유수민 · 건국대학교 글로컬캠퍼스 컴퓨터공학과 &nbsp;·&nbsp; {new Date().getFullYear()}
        </p>
      </div>
    </section>
  );
}
