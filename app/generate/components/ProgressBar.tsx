import React from "react";
import { Step } from "../types";
import { Check } from "lucide-react";

export default function ProgressBar({ step }: { step: Step }) {
  const steps = [
    { n: 1, label: "Your Idea" },
    { n: 2, label: "Tech Stack" },
    { n: 3, label: "Personalize" },
  ];

  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 40, position: "relative" }}>
      {steps.map((s, i) => (
        <React.Fragment key={s.n}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0, width: 64 }}>
            {/* Circle */}
            <div style={{
              width: 36, height: 36,
              borderRadius: "var(--radius-md)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-mono)",
              fontWeight: 700, fontSize: "13px",
              transition: "all 0.3s",
              background: step >= s.n ? "var(--color-signal)" : "var(--bg-elevated)",
              color: step >= s.n ? "var(--color-graphite)" : "var(--fg-muted)",
              border: step < s.n ? "1px solid var(--border-hairline)" : "none",
            }}>
              {step > s.n ? <Check size={14} strokeWidth={3} /> : s.n}
            </div>
            {/* Label */}
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px", fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: step >= s.n ? "var(--fg-primary)" : "var(--fg-muted)",
              whiteSpace: "nowrap",
            }}>
              {s.label}
            </span>
          </div>

          {/* Connector */}
          {i < steps.length - 1 && (
            <div style={{
              flex: 1, height: 1,
              margin: "17px 8px 0",
              background: step > s.n ? "var(--color-signal)" : "var(--border-hairline)",
              transition: "background 0.5s",
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
