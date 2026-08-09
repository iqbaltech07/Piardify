"use client";

import { FEATURES } from "./features/FeaturesData";
import { FeatureCard } from "./features/FeatureCard";
import FeaturesStyles from "./features/FeaturesStyles";

export default function FeaturesSection() {
  return (
    <section id="features" className="feat-section">
      {/* Section header */}
      <div className="feat-header">
        <div className="feat-header-pill">
          <span className="feat-header-dot" aria-hidden="true" />
          System Capabilities
        </div>
        <h2 className="feat-heading">
          Engineered for{" "}
          <span className="feat-heading-accent">production engineering teams</span>
        </h2>
        <p className="feat-subheading">
          From system specs to autonomous AI Agent execution, managed in one integrated pipeline.
        </p>
      </div>

      {/* Bento grid */}
      <div className="feat-bento" role="list" aria-label="Feature list">
        {FEATURES.map((f, i) => (
          <FeatureCard key={f.id} f={f} index={i} />
        ))}
      </div>

      <FeaturesStyles />
    </section>
  );
}
