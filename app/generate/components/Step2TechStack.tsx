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
  const selectedStacksCount = Object.values(stacks).filter(v => v !== "").length;

  return (
    <div>
      <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--fg-primary)", marginBottom: "8px" }}>Choose your tech stack</h2>
      <p style={{ fontSize: "14px", color: "var(--fg-secondary)", marginBottom: "32px" }}>Select the technologies you&apos;ll use, or let AI recommend the best fit.</p>

      {/* Mode tabs */}
      <div style={{ display: "flex", padding: "4px", borderRadius: "12px", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", marginBottom: "24px" }}>
        {(["manual", "ai"] as const).map((mode) => (
          <button key={mode} id={`stack-mode-${mode}`}
            onClick={() => setStackMode(mode)}
            style={{
              flex: 1, padding: "10px", borderRadius: "9px", fontSize: "14px", fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s",
              background: stackMode === mode ? "linear-gradient(135deg, var(--indigo-500), var(--blue-500))" : "transparent",
              color: stackMode === mode ? "white" : "var(--fg-muted)",
              border: "none",
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px"
            }}
          >
            {mode === "manual" ? (
              "Manual Selection"
            ) : (
              <>
                <Bot size={15} />
                AI Recommend
              </>
            )}
          </button>
        ))}
      </div>

      {stackMode === "manual" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "14px", color: "var(--fg-secondary)", fontWeight: 500 }}>
              Choose technologies for each layer
            </span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: selectedStacksCount === 4 ? "#f97316" : "var(--fg-muted)" }}>
              {selectedStacksCount}/4 selected
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="layer-grid">
            {TECH_CATEGORIES.map((cat) => (
              <div key={cat.id} style={{
                background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
                borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: cat.bg, color: cat.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {cat.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--fg-primary)", marginBottom: "2px" }}>{cat.title}</div>
                    <div style={{ fontSize: "13px", color: "var(--fg-muted)" }}>{cat.subtitle}</div>
                  </div>
                </div>
                
                <div style={{ position: "relative" }}>
                  {stacks[cat.id] && (
                    <div style={{
                      position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
                      width: "16px", height: "16px", borderRadius: "50%", background: "rgba(249,115,22,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none"
                    }}>
                      <Check size={10} color="#f97316" strokeWidth={3} />
                    </div>
                  )}
                  <select
                    value={stacks[cat.id]}
                    onChange={(e) => setStack(cat.id, e.target.value)}
                    style={{
                      width: "100%", padding: stacks[cat.id] ? "12px 36px 12px 40px" : "12px 36px 12px 14px", borderRadius: "10px",
                      background: "var(--bg-base)", border: "1px solid var(--border-subtle)",
                      color: stacks[cat.id] ? "var(--fg-primary)" : "var(--fg-muted)",
                      fontSize: "14px", fontWeight: 500, outline: "none", appearance: "none", cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    <option value="" disabled>Select {cat.title}...</option>
                    {cat.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <div style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--fg-muted)" }}>
                    <ChevronDown size={16} strokeWidth={2} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ borderRadius: "12px", padding: "32px", textAlign: "center", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 700, color: "#fbbf24", background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.25)", marginBottom: "12px" }}><Construction size={12} /> Coming Soon</span>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--fg-primary)", marginBottom: "6px" }}>AI Stack Recommendation</p>
          <p style={{ fontSize: "13px", color: "var(--fg-muted)" }}>Our AI will analyze your idea and recommend the optimal tech stack. Use Manual Selection for now.</p>
        </div>
      )}
    </div>
  );
}
