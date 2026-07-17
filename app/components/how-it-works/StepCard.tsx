"use client";

import { useEffect, useRef, useState } from "react";
import { StepType } from "./HowItWorksData";

export function StepCard({ step, index }: { step: StepType; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const isEven = index % 2 === 1;

  return (
    <div
      ref={ref}
      className={`hiw-step ${visible ? "hiw-step--visible" : ""} ${isEven ? "hiw-step--flip" : ""}`}
      style={{ "--hiw-accent": step.accent, "--hiw-accent-rgb": step.accentRgb, "--hiw-delay": `${index * 120}ms` } as React.CSSProperties}
    >
      {/* Step number — large background */}
      <div className="hiw-step-num">{step.number}</div>

      {/* Card body */}
      <div className="hiw-card">
        {/* Glow */}
        <div className="hiw-card-glow" />

        {/* Icon + header */}
        <div className="hiw-card-header">
          <div className="hiw-card-icon">{step.icon}</div>
          <div className="hiw-card-meta">
            <span className="hiw-card-badge">{step.number}</span>
            <span className="hiw-card-detail">{step.detail}</span>
          </div>
        </div>

        {/* Text */}
        <h3 className="hiw-card-title">{step.title}</h3>
        <p className="hiw-card-desc">{step.desc}</p>

        {/* Mockup visual */}
        <div className="hiw-card-mockup">{step.mockup}</div>

        {/* Accent line */}
        <div className="hiw-card-line" />
      </div>

      {/* Connector dot for timeline */}
      <div className="hiw-connector-dot" />
    </div>
  );
}
