import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen } from "lucide-react";

interface PageTransitionProps {
  title: string;
  subtitle?: string;
  color?: string;
  lines?: string[];
  onComplete: () => void;
}

export default function PageTransition({
  title,
  subtitle,
  color = "var(--sage)",
  onComplete,
}: PageTransitionProps) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setDone(true), 400);
    const completeTimer = setTimeout(onComplete, 600);
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
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: "var(--paper)" }}
        >
          <div
            className="paper-card w-full max-w-sm p-7 text-center"
            role="status"
            aria-label="페이지를 불러오는 중"
          >
            <BookOpen
              className="mx-auto mb-4"
              size={28}
              strokeWidth={1.4}
              style={{ color }}
            />
            {subtitle && (
              <p
                className="mb-2 text-xs tracking-widest"
                style={{ color: "var(--ink-secondary)" }}
              >
                {subtitle}
              </p>
            )}
            <p
              className="display-font text-2xl"
              style={{ color: "var(--ink)" }}
            >
              {title}
            </p>
            <div
              className="mt-6 h-1 overflow-hidden rounded-sm"
              style={{ background: "var(--surface-muted)" }}
            >
              <motion.div
                className="h-full"
                style={{ background: color }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
