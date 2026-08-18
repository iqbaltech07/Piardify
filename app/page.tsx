"use client";

import { useState } from "react";
import { Navbar, Footer } from "./components/layout";
import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  LeaderboardSection,
  PricingSection,
  CtaSection,
} from "./components/landing";
import { ExamplePrdModal } from "./components/modals";

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
