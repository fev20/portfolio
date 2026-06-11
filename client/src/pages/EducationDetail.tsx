import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, Award, Terminal, ExternalLink } from "lucide-react";
import { education, certifications } from "@/data/portfolio";
import PageTransition from "@/components/PageTransition";

const ICONS: Record<string, React.ElementType> = {
  "graduation-cap": GraduationCap,
  "award": Award,
  "terminal": Terminal,
  "external-link": ExternalLink,
};

export default function EducationDetail() {
  const { type, index } = useParams<{ type: string; index: string }>();
  const [, navigate] = useLocation();

  const isEdu = type === "edu";
  const item = isEdu ? education[Number(index)] : certifications[Number(index)];
  const color = isEdu ? "#64ffda" : "#a78bfa";
  const [loading, setLoading] = useState(true);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050b18" }}>
        <div className="text-center">
          <p style={{ fontFamily: "'JetBrains Mono', monospace", color: "#64ffda" }}>
            $ record not found
          </p>
          <button onClick={() => navigate("/")} className="mt-4 btn-neon">← Back</button>
        </div>
      </div>
    );
  }

  const Icon = ICONS[item.icon] || Award;

  const pageLines = isEdu
    ? [
        `$ cd ./education/${item.title.replace(/\s+/g, "_")}`,
        `$ cat enrollment.log`,
        `> university record loaded.`,
      ]
    : [
        `$ verify --cert "${item.title}"`,
        `$ checking issuer: ${(item as typeof certifications[0]).issuer}`,
        `> certification verified.`,
      ];

  // 자격증/수료증 설명 텍스트
  const description = isEdu
    ? (item as typeof education[0]).description
    : `${(item as typeof certifications[0]).issuer} 자격증으로, 관련 분야의 전문 역량을 인증받았습니다.`;

  return (
    <>
      {loading && (
        <PageTransition
          title={item.title}
          subtitle={isEdu ? "EDUCATION" : "CERTIFICATION"}
          color={color}
          lines={pageLines}
          onComplete={() => setLoading(false)}
        />
      )}
      {!loading && (
    <div className="min-h-screen" style={{ background: "#050b18", color: "#ccd6f6" }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 20%, ${color}06 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 lg:pl-24">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-10 group"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color: "#8892b0" }}
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          cd ../education
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-start gap-6"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `${color}10`,
              border: `1px solid ${color}30`,
            }}
          >
            <Icon size={28} style={{ color }} />
          </div>

          <div>
            <div
              className="inline-block mb-2 px-3 py-1 rounded text-xs"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                background: `${color}08`,
                border: `1px solid ${color}20`,
                color,
              }}
            >
              {isEdu ? "EDUCATION" : "CERTIFICATION"}
            </div>

            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
                fontWeight: 700,
                color: "#ccd6f6",
                marginBottom: "0.4rem",
              }}
            >
              {item.title}
            </h1>

            {isEdu && "subtitle" in item && (
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem", color: "#8892b0" }}>
                {(item as typeof education[0]).subtitle}
              </p>
            )}
            {!isEdu && "issuer" in item && (
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color }}>
                {(item as typeof certifications[0]).issuer}
              </p>
            )}

            <p
              className="mt-2"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: "#4a5568" }}
            >
              {"period" in item ? (item as typeof education[0]).period : (item as typeof certifications[0]).year}
            </p>
          </div>
        </motion.div>

        <div className="h-px my-8" style={{ background: `linear-gradient(90deg, ${color}30, transparent)` }} />

        {description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-6 rounded-xl mb-6"
            style={{
              background: "rgba(15,23,42,0.8)",
              border: `1px solid ${color}12`,
            }}
          >
            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.95rem",
                color: "#8892b0",
                lineHeight: 1.8,
              }}
            >
              {description}
            </p>
          </motion.div>
        )}

        {"pdfFile" in item && item.pdfFile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-6"
          >
          <a
            href={item.pdfFile}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:opacity-80"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              background: `${color}10`,
              border: `1px solid ${color}40`,
              color,
            }}
          >
      <ExternalLink size={14} />
      수료증 / 자격증 PDF 보기
    </a>
  </motion.div>
)}

        {"image" in item && (item as any).image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-xl overflow-hidden mb-6"
            style={{ border: `1px solid ${color}12` }}
          >
            <img src={(item as any).image} alt={item.title} className="w-full h-auto" />
          </motion.div>
        )}
      </div>
    </div>
      )}
    </>
  );
}