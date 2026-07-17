import React from "react";
import { Step } from "../types";
import { Check } from "lucide-react";

export default function ProgressBar({ step }: { step: Step }) {
  const steps = [{ n: 1, label: "Your Idea" }, { n: 2, label: "Tech Stack" }, { n: 3, label: "Personalize" }];
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "40px", position: "relative" }}>
      {steps.map((s, i) => (
        <React.Fragment key={s.n}>
          {/* Step Circle & Label */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flexShrink: 0, width: "60px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "14px",
                transition: "all 0.3s",
                background: step >= s.n ? "linear-gradient(135deg, var(--indigo-500), var(--blue-500))" : "var(--bg-elevated)",
                color: step >= s.n ? "white" : "var(--fg-muted)",
                border: step < s.n ? "1px solid var(--border-subtle)" : "none",
                boxShadow: step === s.n ? "0 0 20px rgba(99,102,241,0.5)" : "none",
              }}
            >
              {step > s.n ? (
                <Check size={14} strokeWidth={3} color="currentColor" />
              ) : s.n}
            </div>
            <span style={{ fontSize: "12px", fontWeight: 500, color: step >= s.n ? "var(--fg-primary)" : "var(--fg-muted)", whiteSpace: "nowrap" }}>
              {s.label}
            </span>
          </div>

          {/* Connector Line */}
          {i < steps.length - 1 && (
            <div
              style={{
                flex: 1,
                height: "2px",
                margin: "19px 12px 0", // roughly middle of 40px circle
                background: step > s.n ? "linear-gradient(90deg, var(--indigo-500), var(--blue-500))" : "var(--border-subtle)",
                transition: "background 0.5s",
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
