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
          <span className="hiw-pulse-dot" aria-hidden="true" />
          How It Works
        </div>
        <h2 className="hiw-heading">
          From raw idea to{" "}
          <span className="hiw-heading-accent">shipped PRD in 4 steps</span>
        </h2>
        <p className="hiw-subheading">
          A guided, AI-powered workflow: zero guesswork, zero blank-page anxiety.
        </p>
      </div>

      {/* Steps track */}
      <div className="hiw-track">
        <div className="hiw-spine" aria-hidden="true" />
        {STEPS.map((step, i) => (
          <StepCard key={step.number} step={step} index={i} />
        ))}
      </div>

      <HowItWorksStyles />
    </section>
  );
}
