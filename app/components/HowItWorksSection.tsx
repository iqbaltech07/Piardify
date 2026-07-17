"use client";

import { STEPS } from "./how-it-works/HowItWorksData";
import { StepCard } from "./how-it-works/StepCard";
import HowItWorksStyles from "./how-it-works/HowItWorksStyles";

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="hiw-section">
      {/* Header */}
      <div className="hiw-header">
        <div className="hiw-header-pill">
          <span className="hiw-pulse-dot" />
          How It Works
        </div>
        <h2 className="hiw-heading">
          From raw idea to
          <br />
          <span className="gradient-text">shipped PRD in 4 steps</span>
        </h2>
        <p className="hiw-subheading">
          A guided, AI-powered workflow — no guesswork, no blank-page anxiety.
        </p>
      </div>

      {/* Steps */}
      <div className="hiw-track">
        {/* Central vertical line */}
        <div className="hiw-spine" />

        {STEPS.map((step, i) => (
          <StepCard key={step.number} step={step} index={i} />
        ))}
      </div>

      <HowItWorksStyles />
    </section>
  );
}
