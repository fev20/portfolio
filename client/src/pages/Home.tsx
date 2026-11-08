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
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  const handleLoadComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) window.dispatchEvent(new Event("portfolio:ready"));
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
            <main className="relative pb-20 lg:pb-0" style={{ zIndex: 1 }}>
              <div id="hero">
                <HeroSection />
              </div>
              <AboutSection />
              <SkillsSection />
              <ProjectsSection />
              <ExperienceSection />
              <EducationSection />
              <DemosSection />
              <ContactSection />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
