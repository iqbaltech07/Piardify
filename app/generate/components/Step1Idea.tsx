import React from "react";

interface Step1IdeaProps {
  appName: string;
  appIdea: string;
  setAppName: (val: string) => void;
  setAppIdea: (val: string) => void;
}

export default function Step1Idea({ appName, appIdea, setAppName, setAppIdea }: Step1IdeaProps) {
  const ideaValid = appIdea.length >= 20;

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
        Step 01 / Idea
      </div>
      <h2 style={{
        fontFamily: "var(--font-display)",
        fontSize: "1.75rem", fontWeight: 800,
        color: "var(--fg-primary)", marginBottom: 8,
        letterSpacing: "-0.02em",
      }}>
        What's your app idea?
      </h2>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-mist)", marginBottom: 28, lineHeight: 1.6 }}>
        Give us a brief description of the product you want to build.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* App Name */}
        <div>
          <label style={{
            display: "block",
            fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: appName ? "var(--color-signal)" : "var(--color-mist)",
            marginBottom: 8,
          }}>
            App Name *
          </label>
          <input
            id="input-app-name"
            type="text"
            placeholder="e.g. TaskFlow, BudgetBuddy, LearnAI..."
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            style={{
              width: "100%", padding: "12px 14px",
              borderRadius: "var(--radius-md)", fontSize: "14px",
              fontFamily: "var(--font-body)",
              outline: "none",
              background: "var(--bg-elevated)",
              border: `1px solid ${appName ? "var(--color-signal)" : "var(--border-hairline)"}`,
              color: "var(--fg-primary)", boxSizing: "border-box",
              transition: "border-color 0.15s",
            }}
          />
        </div>

        {/* Describe Idea */}
        <div>
          <label style={{
            display: "block",
            fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: ideaValid ? "var(--color-circuit)" : "var(--color-mist)",
            marginBottom: 8,
          }}>
            Describe Your Idea *
          </label>
          <textarea
            id="input-app-idea"
            rows={4}
            placeholder="e.g. An AI-powered task manager that helps developers prioritize their daily work..."
            value={appIdea}
            onChange={(e) => setAppIdea(e.target.value)}
            style={{
              width: "100%", padding: "12px 14px",
              borderRadius: "var(--radius-md)", fontSize: "14px",
              fontFamily: "var(--font-body)",
              outline: "none", resize: "none",
              background: "var(--bg-elevated)",
              border: `1px solid ${ideaValid ? "var(--color-circuit)" : "var(--border-hairline)"}`,
              color: "var(--fg-primary)", lineHeight: 1.6,
              boxSizing: "border-box",
              transition: "border-color 0.15s",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "10px",
              color: ideaValid ? "var(--color-circuit)" : "var(--fg-muted)",
              letterSpacing: "0.06em",
            }}>
              {ideaValid ? "✓ Great description!" : `${20 - appIdea.length} more chars needed`}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--fg-muted)", letterSpacing: "0.04em" }}>
              {appIdea.length} / 500
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

