import { motion } from "framer-motion";
import {
  ArrowDown,
  BookOpen,
  Cpu,
  Github,
  Mail,
  ShieldCheck,
  Sprout,
  ExternalLink,
} from "lucide-react";
import { profile } from "@/data/portfolio";
import AnimalBackground from "@/components/AnimalBackground";

const focusAreas = [
  {
    icon: Cpu,
    label: "Hardware Security",
    detail: "하드웨어부터 차근차근",
    color: "var(--sage-deep)",
    background: "var(--sage-soft)",
  },
  {
    icon: ShieldCheck,
    label: "Web Security",
    detail: "더 안전한 웹을 위한 공부",
    color: "var(--rose-deep)",
    background: "var(--rose-soft)",
  },
  {
    icon: BookOpen,
    label: "CTF & Secure Systems",
    detail: "직접 풀어보며 쌓는 경험",
    color: "var(--ink-secondary)",
    background: "var(--surface-muted)",
  },
];

export default function HeroSection() {
  const socialLinks = [
    { icon: Github, label: "GitHub", href: profile.github },
    {
      icon: Mail,
      label: "Email",
      href: profile.email ? `mailto:${profile.email}` : "",
    },
    { icon: BookOpen, label: "Blog", href: profile.blog },
    { icon: ExternalLink, label: "Notion", href: profile.notion },
  ].filter(link => link.href);

  return (
    <section
      className="relative flex min-h-screen items-center py-24 lg:py-20"
      aria-labelledby="hero-title"
    >
      <AnimalBackground animal="cat" placement="hero" />
      <div className="container relative z-10">
        <div className="grid items-center gap-16 xl:grid-cols-[1.3fr_0.85fr] xl:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="mb-7 inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold"
              style={{
                background: "var(--sage-soft)",
                color: "var(--sage-deep)",
                border:
                  "1px solid color-mix(in srgb, var(--sage) 20%, transparent)",
              }}
            >
              <Sprout size={15} strokeWidth={1.6} />
              안녕하세요, 반가워요
            </div>
            <h1
              id="hero-title"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(4rem, 7vw, 6rem)",
                fontWeight: 800,
                color: "var(--name-pink)",
                lineHeight: 1.35,
                marginBottom: "0.75rem",
              }}
            >
              {profile.name}
            </h1>
            <p
              className="mb-7 text-lg font-semibold tracking-wide"
              style={{ color: "var(--sage-deep)" }}
            >
              {profile.nameEn}
            </p>
            <p
              className="mb-8 max-w-lg text-base leading-loose"
              style={{ color: "var(--ink-secondary)", wordBreak: "keep-all" }}
            >
              {profile.tagline}
            </p>
            <div className="mb-12 flex flex-wrap gap-2.5">
              {socialLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target={
                    link.href.startsWith("mailto:") ? undefined : "_blank"
                  }
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  <link.icon size={15} strokeWidth={1.7} />
                  {link.label}
                </a>
              ))}
            </div>
            <button
              onClick={() =>
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center gap-3 text-xs"
              style={{ color: "var(--ink-secondary)" }}
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-md"
                style={{ border: "1px solid var(--line)" }}
              >
                <ArrowDown size={14} />
              </span>
              조금 더 알아보기
            </button>
          </motion.div>
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="hero-note mx-auto w-full max-w-sm"
            aria-label="관심 분야"
          >
            <div
              className="mb-6 flex items-center justify-between border-b pb-4"
              style={{ borderColor: "var(--line)" }}
            >
              <span
                className="text-xs font-semibold tracking-widest"
                style={{ color: "var(--rose)" }}
              >
                LEARNING NOTES
              </span>
              <Sprout
                size={20}
                strokeWidth={1.4}
                style={{ color: "var(--sage)" }}
              />
            </div>
            <p
              className="mb-6 text-[1.45rem] font-medium leading-loose"
              style={{ color: "var(--ink)", wordBreak: "keep-all" }}
            >
              좋아하는 것을 배우며,
              <br />
              꾸준히 자라는 중.
            </p>
            <div className="space-y-5">
              {focusAreas.map(area => (
                <div key={area.label} className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
                    style={{ background: area.background, color: area.color }}
                  >
                    <area.icon size={19} strokeWidth={1.5} />
                  </span>
                  <div>
                    <p
                      className="text-sm font-bold"
                      style={{ color: "var(--ink)" }}
                    >
                      {area.label}
                    </p>
                    <p
                      className="mt-0.5 text-xs"
                      style={{ color: "var(--ink-secondary)" }}
                    >
                      {area.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="mt-7 border-t pt-4 text-xs"
              style={{
                color: "var(--ink-secondary)",
                borderColor: "var(--line)",
              }}
            >
              작은 배움과 경험을 모아둔 포트폴리오
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
