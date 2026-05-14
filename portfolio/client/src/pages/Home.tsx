// Home.tsx — 메인 포트폴리오 페이지
// Design: Nebula Hacker — sidebar navigation (Navbar removed)

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import StarField from "@/components/StarField";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import EducationSection from "@/components/sections/EducationSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  const handleLoadComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ background: "#050b18", color: "#ccd6f6" }}
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
            {/* Star particle background */}
            <StarField />

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
              <ContactSection />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
