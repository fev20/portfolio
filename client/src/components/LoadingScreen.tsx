// LoadingScreen.tsx — 터미널 부팅 시퀀스 로딩 화면
// Design: Nebula Hacker — space terminal boot sequence

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  { text: "$ initializing secure connection...", delay: 0 },
  { text: "$ loading kernel modules...", delay: 180 },
  { text: "$ mounting encrypted filesystem...", delay: 360 },
  { text: "$ establishing neural link...", delay: 540 },
  { text: "$ scanning for vulnerabilities...", delay: 720 },
  { text: "> all systems nominal.", delay: 900, highlight: true },
  { text: "> welcome to the void.", delay: 1050, highlight: true },
];

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, i]);
        setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100));
      }, line.delay);
    });

    // Complete after last line + short pause
    setTimeout(() => {
      setDone(true);
      setTimeout(onComplete, 300);
    }, 1300);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: "#050b18" }}
        >
          {/* Nebula glow background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(100,255,218,0.04) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 w-full max-w-lg px-6">
            {/* Logo / Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 text-center"
            >
              <div
                className="inline-block text-xs tracking-widest mb-2"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "#64ffda",
                  letterSpacing: "0.3em",
                }}
              >
                SECURITY PORTFOLIO
              </div>
              <div
                className="text-4xl font-bold"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: "#ccd6f6",
                  textShadow: "0 0 30px rgba(100,255,218,0.2)",
                }}
              >
                &gt;_
              </div>
            </motion.div>

            {/* Terminal window */}
            <div
              className="rounded-lg overflow-hidden"
              style={{
                background: "rgba(15,23,42,0.9)",
                border: "1px solid rgba(100,255,218,0.15)",
                boxShadow: "0 0 40px rgba(100,255,218,0.05)",
              }}
            >
              {/* Terminal title bar */}
              <div
                className="flex items-center gap-2 px-4 py-2.5"
                style={{
                  background: "rgba(100,255,218,0.05)",
                  borderBottom: "1px solid rgba(100,255,218,0.1)",
                }}
              >
                <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
                <span
                  className="ml-2 text-xs"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "#8892b0",
                  }}
                >
                  bash — portfolio.sh
                </span>
              </div>

              {/* Terminal body */}
              <div className="p-5 min-h-[180px]">
                {BOOT_LINES.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={
                      visibleLines.includes(i)
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: -10 }
                    }
                    transition={{ duration: 0.3 }}
                    className="mb-1"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.8rem",
                      color: line.highlight ? "#64ffda" : "#8892b0",
                      lineHeight: "1.6",
                    }}
                  >
                    {line.text}
                    {i === visibleLines[visibleLines.length - 1] && !done && (
                      <span
                        className="inline-block w-2 h-4 ml-1 cursor-blink"
                        style={{
                          background: "#64ffda",
                          verticalAlign: "middle",
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div
                className="flex justify-between mb-1"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                  color: "#4a5568",
                }}
              >
                <span>loading</span>
                <span style={{ color: "#64ffda" }}>{progress}%</span>
              </div>
              <div
                className="h-0.5 rounded-full overflow-hidden"
                style={{ background: "rgba(100,255,218,0.1)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #64ffda, #a78bfa)" }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
