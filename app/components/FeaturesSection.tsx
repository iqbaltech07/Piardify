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
          All Features
        </div>
        <h2 className="feat-heading">
          Built for teams that{" "}
          <span className="feat-heading-accent">refuse to slow down</span>
        </h2>
        <p className="feat-subheading">
          Every tool you need, from ideation to export, wired into one seamless AI workflow.
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
