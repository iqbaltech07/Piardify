"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import LeaderboardSection from "./components/LeaderboardSection";
import PricingSection from "./components/PricingSection";
import CtaSection from "./components/CtaSection";
import Footer from "./components/Footer";
import ExamplePrdModal from "./components/ExamplePrdModal";

export default function HomePage() {
  const [showExample, setShowExample] = useState(false);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection onSeeExample={() => setShowExample(true)} />
        <FeaturesSection />
        <HowItWorksSection />
        <LeaderboardSection />
        <PricingSection />
        <CtaSection onSeeExample={() => setShowExample(true)} />
      </main>
      <Footer />
      {showExample && <ExamplePrdModal onClose={() => setShowExample(false)} />}
    </>
  );
}
