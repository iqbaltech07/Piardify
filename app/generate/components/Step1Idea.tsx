import React from "react";

interface Step1IdeaProps {
  appName: string;
  appIdea: string;
  setAppName: (val: string) => void;
  setAppIdea: (val: string) => void;
}

export default function Step1Idea({ appName, appIdea, setAppName, setAppIdea }: Step1IdeaProps) {
  return (
    <div>
      <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--fg-primary)", marginBottom: "8px" }}>What&apos;s your app idea?</h2>
      <p style={{ fontSize: "14px", color: "var(--fg-secondary)", marginBottom: "32px" }}>Give us a brief description of the product you want to build.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--indigo-400)", marginBottom: "8px" }}>
            App Name *
          </label>
          <input
            id="input-app-name" type="text"
            placeholder="e.g. TaskFlow, BudgetBuddy, LearnAI..."
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            style={{
              width: "100%", padding: "13px 16px", borderRadius: "12px", fontSize: "14px",
              outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
              background: "var(--bg-elevated)",
              border: `1px solid ${appName ? "var(--indigo-500)" : "var(--border-subtle)"}`,
              color: "var(--fg-primary)", boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--indigo-400)", marginBottom: "8px" }}>
            Describe Your Idea *
          </label>
          <textarea
            id="input-app-idea" rows={5}
            placeholder="e.g. An AI-powered task manager that helps developers prioritize their daily work, integrates with GitHub, and uses ML to predict task completion time..."
            value={appIdea}
            onChange={(e) => setAppIdea(e.target.value)}
            style={{
              width: "100%", padding: "13px 16px", borderRadius: "12px", fontSize: "14px",
              outline: "none", resize: "none", transition: "border-color 0.2s",
              background: "var(--bg-elevated)",
              border: `1px solid ${appIdea.length >= 20 ? "var(--indigo-500)" : "var(--border-subtle)"}`,
              color: "var(--fg-primary)", lineHeight: 1.6, boxSizing: "border-box",
              fontFamily: "inherit",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
            <span style={{ fontSize: "12px", color: appIdea.length < 20 ? "var(--fg-muted)" : "var(--indigo-400)" }}>
              {appIdea.length < 20 ? `${20 - appIdea.length} more characters needed` : "✓ Great description!"}
            </span>
            <span style={{ fontSize: "12px", color: "var(--fg-muted)" }}>{appIdea.length} / 500</span>
          </div>
        </div>
      </div>
    </div>
  );
}
