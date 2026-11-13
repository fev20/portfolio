// Home.tsx — 메인 포트폴리오 페이지
// Warm paper layout with sidebar navigation.

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import EducationSection from "@/components/sections/EducationSection";
import DemosSection from "@/components/sections/DemosSection";
import AiDevelopmentSection from "@/components/sections/AiDevelopmentSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  const handleLoadComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const hasPendingScroll = Boolean(sessionStorage.getItem("pendingScroll"));
    window.dispatchEvent(new Event("portfolio:ready"));
    if (!hasPendingScroll && new URLSearchParams(window.location.search).get("section") === "ai-development") {
      document.getElementById("ai-development")?.scrollIntoView({ behavior: "instant" });
    }
  }, [loaded]);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--paper)", color: "var(--ink)" }}
    >
      {/* Loading screen */}
      <LoadingScreen onComplete={handleLoadComplete} />

      {/* Main content */}
      <AnimatePresence>
        {loaded && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main content — no top Navbar, sidebar handles navigation */}
            <main className="relative pb-28 sm:pb-16 lg:pb-0" style={{ zIndex: 1 }}>
              <div id="hero">
                <HeroSection />
              </div>
              <AboutSection />
              <SkillsSection />
              <ProjectsSection />
              <ExperienceSection />
              <EducationSection />
              <DemosSection />
              <AiDevelopmentSection />
              <ContactSection />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
