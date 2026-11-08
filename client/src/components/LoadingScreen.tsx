import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sprout } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setDone(true), 450);
    const completeTimer = setTimeout(onComplete, 650);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "var(--paper)" }}
        >
          <div
            className="w-64 text-center"
            role="status"
            aria-label="포트폴리오를 불러오는 중"
          >
            <Sprout
              className="mx-auto mb-4"
              size={32}
              strokeWidth={1.4}
              style={{ color: "var(--sage)" }}
            />
            <p
              className="display-font mb-2 text-2xl"
              style={{ color: "var(--ink)" }}
            >
              작은 배움의 기록
            </p>
            <p
              className="mb-6 text-xs"
              style={{ color: "var(--ink-secondary)" }}
            >
              잠시만 기다려 주세요
            </p>
            <div
              className="h-1 overflow-hidden rounded-sm"
              style={{ background: "var(--surface-muted)" }}
            >
              <motion.div
                className="h-full"
                style={{ background: "var(--sage)" }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.45 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
