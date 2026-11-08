// ContactSection.tsx — 연락처 섹션
// Design: warm paper and restrained pastel accents — simple contact cards

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Github, ExternalLink, BookOpen, Linkedin } from "lucide-react";
import { profile } from "@/data/portfolio";
import AnimalBackground from "@/components/AnimalBackground";

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const contacts = [
    {
      icon: Mail,
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
      color: "var(--sage)",
      show: !!profile.email,
    },
    {
      icon: Github,
      label: "GitHub",
      value: profile.github?.replace("https://github.com/", "@"),
      href: profile.github,
      color: "var(--ink)",
      show: !!profile.github,
    },
    {
      icon: BookOpen,
      label: "Blog",
      value: "블로그 방문하기",
      href: profile.blog,
      color: "var(--rose)",
      show: !!profile.blog,
    },
    {
      icon: ExternalLink,
      label: "Notion",
      value: "노션 페이지",
      href: profile.notion,
      color: "var(--sage)",
      show: !!profile.notion,
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "LinkedIn 프로필",
      href: profile.linkedin,
      color: "var(--sage)",
      show: !!profile.linkedin,
    },
  ].filter(c => c.show);

  return (
    <section id="contact" className="relative py-28 pb-40" ref={ref}>
      <AnimalBackground animal="hamster" placement="contact" />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-1 mb-14"
        >
          <span
            style={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "0.62rem",
              color: "var(--sage)",
              letterSpacing: "0.12em",
            }}
          >
            SAY HELLO
          </span>
          <div className="flex items-center gap-3">
            <h2
              style={{
                letterSpacing: "normal",
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 3vw, 2.6rem)",
                fontWeight: 800,
                color: "var(--ink)",
              }}
            >
              Contact
            </h2>
            <div
              className="flex-1 h-px"
              style={{
                background: "color-mix(in srgb, var(--sage) 15%, transparent)",
                maxWidth: "200px",
              }}
            />
          </div>
        </motion.div>

        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "1rem",
              color: "var(--ink-secondary)",
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
                target={
                  contact.href?.startsWith("mailto") ? undefined : "_blank"
                }
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="paper-card rounded-[4px] p-4 flex items-center gap-4 group"
                style={{ textDecoration: "none" }}
              >
                <div
                  className="w-10 h-10 rounded-[2px] flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: `color-mix(in srgb, ${contact.color} 6%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${contact.color} 15%, transparent)`,
                  }}
                >
                  <contact.icon size={16} style={{ color: contact.color }} />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Nunito Sans', sans-serif",
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
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontSize: "0.85rem",
                      color: "var(--ink)",
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
          borderTop:
            "1px solid color-mix(in srgb, var(--sage) 6%, transparent)",
        }}
      >
        <p
          style={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: "0.7rem",
            color: "var(--ink-muted)",
          }}
        >
          유수민 · 건국대학교 글로컬캠퍼스 컴퓨터공학과 &nbsp;·&nbsp;{" "}
          {new Date().getFullYear()}
        </p>
      </div>
    </section>
  );
}
