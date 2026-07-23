import React from "react";
import { StackCategory, FormData } from "../types";
import { TECH_CATEGORIES } from "../constants";
import { Check, ChevronDown, Bot, Construction } from "lucide-react";

interface Step2TechStackProps {
  stackMode: FormData["stackMode"];
  stacks: FormData["stacks"];
  setStackMode: (mode: FormData["stackMode"]) => void;
  setStack: (category: StackCategory, label: string) => void;
}

export default function Step2TechStack({ stackMode, stacks, setStackMode, setStack }: Step2TechStackProps) {
  const selectedCount = Object.values(stacks).filter((v) => v !== "").length;

  return (
    <div>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "3px 10px",
        border: "1px solid var(--border-hairline)",
        borderRadius: "var(--radius-xs)",
        fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 700,
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: "var(--color-circuit)", marginBottom: 14,
      }}>
        Step 02 / Tech Stack
      </div>
      <h2 style={{
        fontFamily: "var(--font-display)",
        fontSize: "1.75rem", fontWeight: 800,
        color: "var(--fg-primary)", marginBottom: 8,
        letterSpacing: "-0.02em",
      }}>
        Choose your tech stack
      </h2>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-mist)", marginBottom: 28, lineHeight: 1.6 }}>
        Select the technologies you'll use, or let AI recommend the best fit.
      </p>

      {/* Mode selector */}
      <div style={{
        display: "flex",
        border: "1px solid var(--border-hairline)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        marginBottom: 24,
      }}>
        {(["manual", "ai"] as const).map((mode, i) => (
          <button
            key={mode}
            id={`stack-mode-${mode}`}
            onClick={() => setStackMode(mode)}
            style={{
              flex: 1,
              padding: "10px 16px",
              fontFamily: "var(--font-mono)",
              fontSize: "11px", fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase",
              cursor: "pointer",
              background: stackMode === mode ? "var(--color-signal)" : "var(--bg-elevated)",
              color: stackMode === mode ? "var(--color-graphite)" : "var(--fg-muted)",
              border: "none",
              borderLeft: i > 0 ? "1px solid var(--border-hairline)" : "none",
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
              transition: "all 0.15s",
            }}
          >
            {mode === "ai" && <Bot size={12} />}
            {mode === "manual" ? "Manual" : "AI Recommend"}
          </button>
        ))}
      </div>

      {stackMode === "manual" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Selection counter */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--fg-secondary)" }}>
              Select one technology per layer
            </span>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700,
              color: selectedCount === 4 ? "var(--color-signal)" : "var(--fg-muted)",
              letterSpacing: "0.08em",
            }}>
              {selectedCount}/4 selected
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="layer-grid">
            {TECH_CATEGORIES.map((cat) => (
              <div key={cat.id} style={{
                background: "var(--bg-elevated)",
                border: `1px solid ${stacks[cat.id] ? "var(--color-circuit)" : "var(--border-hairline)"}`,
                borderRadius: "var(--radius-lg)",
                padding: "16px",
                display: "flex", flexDirection: "column", gap: 14,
                transition: "border-color 0.15s",
              }}>
                {/* Category header */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 34, height: 34,
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-hairline)",
                    background: "var(--bg-base)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--color-circuit)",
                  }}>
                    {cat.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 700, color: "var(--fg-primary)", marginBottom: 1 }}>
                      {cat.title}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--fg-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      {cat.subtitle}
                    </div>
                  </div>
                </div>

                {/* Select */}
                <div style={{ position: "relative" }}>
                  {stacks[cat.id] && (
                    <Check
                      size={11}
                      strokeWidth={3}
                      style={{
                        position: "absolute", left: 12, top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--color-circuit)",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                  <select
                    value={stacks[cat.id]}
                    onChange={(e) => setStack(cat.id, e.target.value)}
                    style={{
                      width: "100%",
                      padding: stacks[cat.id] ? "10px 32px 10px 30px" : "10px 32px 10px 12px",
                      borderRadius: "var(--radius-md)",
                      background: "var(--bg-base)",
                      border: "1px solid var(--border-hairline)",
                      color: stacks[cat.id] ? "var(--fg-primary)" : "var(--fg-muted)",
                      fontFamily: "var(--font-body)",
                      fontSize: "13px", fontWeight: 500,
                      outline: "none", appearance: "none", cursor: "pointer",
                      transition: "border-color 0.15s",
                    }}
                  >
                    <option value="" disabled>Select {cat.title}…</option>
                    {cat.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={13}
                    style={{
                      position: "absolute", right: 10, top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--fg-muted)", pointerEvents: "none",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          padding: "32px",
          border: "1px solid var(--border-hairline)",
          borderRadius: "var(--radius-lg)",
          textAlign: "center",
          background: "var(--bg-elevated)",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "3px 10px",
            border: "1px solid var(--border-hairline)",
            borderRadius: "var(--radius-xs)",
            fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "var(--color-signal)", marginBottom: 12,
          }}>
            <Construction size={10} />
            Coming Soon
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "var(--fg-primary)", marginBottom: 6 }}>
            AI Stack Recommendation
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-mist)" }}>
            Our AI will analyze your idea and recommend the optimal tech stack. Use Manual Selection for now.
          </p>
        </div>
      )}
    </div>
  );
}
