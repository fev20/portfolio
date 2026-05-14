// PageTransition.tsx — 페이지 전환 시 터미널 로딩 화면
// Design: Nebula Hacker — 각 페이지 타입에 맞는 짧은 부팅 시퀀스

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PageTransitionProps {
  title: string;       // 페이지 제목
  subtitle?: string;   // 부제목 (예: 프로젝트 번호)
  color?: string;      // 포인트 컬러
  lines?: string[];    // 터미널 출력 라인
  onComplete: () => void;
}

export default function PageTransition({
  title,
  subtitle,
  color = "#64ffda",
  lines,
  onComplete,
}: PageTransitionProps) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const bootLines = lines ?? [
    `$ accessing ${title.toLowerCase().replace(/\s+/g, "_")}...`,
    `$ decrypting data...`,
    `> loaded.`,
  ];

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    bootLines.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines((prev) => [...prev, i]);
        }, i * 280)
      );
    });

    // 마지막 라인 후 짧게 대기 후 완료
    timers.push(
      setTimeout(() => {
        setDone(true);
        setTimeout(onComplete, 400);
      }, bootLines.length * 280 + 200)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="page-transition"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: "#050b18" }}
        >
          {/* 배경 글로우 */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 50% 40% at 50% 50%, ${color}06 0%, transparent 70%)`,
            }}
          />

          <div className="relative z-10 w-full max-w-md px-6">
            {/* 상단 타이틀 */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 text-center"
            >
              {subtitle && (
                <div
                  className="mb-1"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.65rem",
                    color: `${color}88`,
                    letterSpacing: "0.2em",
                  }}
                >
                  {subtitle}
                </div>
              )}
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
                  fontWeight: 700,
                  color: "#ccd6f6",
                }}
              >
                {title}
              </div>
            </motion.div>

            {/* 터미널 창 */}
            <div
              className="rounded-lg overflow-hidden"
              style={{
                background: "rgba(15,23,42,0.95)",
                border: `1px solid ${color}20`,
                boxShadow: `0 0 30px ${color}08`,
              }}
            >
              {/* 타이틀바 */}
              <div
                className="flex items-center gap-2 px-4 py-2"
                style={{
                  background: `${color}06`,
                  borderBottom: `1px solid ${color}10`,
                }}
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ffbd2e" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
                <span
                  className="ml-2"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.65rem",
                    color: "#4a5568",
                  }}
                >
                  bash — portfolio.sh
                </span>
              </div>

              {/* 터미널 바디 */}
              <div className="p-4 min-h-[90px]">
                {bootLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={
                      visibleLines.includes(i)
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: -8 }
                    }
                    transition={{ duration: 0.2 }}
                    className="mb-0.5"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.78rem",
                      color: line.startsWith(">") ? color : "#64748b",
                      lineHeight: "1.6",
                    }}
                  >
                    {line}
                    {i === visibleLines[visibleLines.length - 1] && !done && (
                      <span
                        className="inline-block w-1.5 h-3.5 ml-1"
                        style={{
                          background: color,
                          verticalAlign: "middle",
                          animation: "blink 1s step-end infinite",
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 하단 진행 바 */}
            <div className="mt-3">
              <motion.div
                className="h-px rounded-full"
                style={{ background: `${color}20` }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${color}, ${color}66)` }}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: bootLines.length * 0.28 + 0.2, ease: "linear" }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
