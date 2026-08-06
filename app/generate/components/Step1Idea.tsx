import React from "react";

interface Step1IdeaProps {
  appName: string;
  appIdea: string;
  designData?: string;
  setAppName: (val: string) => void;
  setAppIdea: (val: string) => void;
  setDesignData?: (val: string) => void;
}

export default function Step1Idea({ appName, appIdea, designData, setAppName, setAppIdea, setDesignData }: Step1IdeaProps) {
  const ideaValid = appIdea.length >= 20;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && setDesignData) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        if (text) setDesignData(text);
      };
      reader.readAsText(file);
    }
  };

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

        {/* Optional design.md Upload */}
        <div style={{
          padding: "16px",
          borderRadius: "var(--radius-md)",
          border: "1px dashed var(--border-hairline)",
          background: "rgba(255,255,255,0.02)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <label style={{
              fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: designData ? "var(--color-signal)" : "var(--fg-muted)",
            }}>
              Design Guidelines (design.md) — Opsional
            </label>
            <label style={{
              fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 700,
              padding: "3px 8px", borderRadius: "var(--radius-xs)",
              background: "rgba(79,209,197,0.1)", color: "var(--color-circuit)",
              cursor: "pointer", border: "1px solid rgba(79,209,197,0.3)",
            }}>
              ↑ Upload File .md
              <input
                type="file"
                accept=".md,.txt"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
            </label>
          </div>
          <textarea
            rows={3}
            placeholder="Atau paste isi file design.md di sini (Color Tokens, Typography, Layout, Components)..."
            value={designData || ""}
            onChange={(e) => setDesignData && setDesignData(e.target.value)}
            style={{
              width: "100%", padding: "10px 12px",
              borderRadius: "var(--radius-sm)", fontSize: "12px",
              fontFamily: "var(--font-mono)",
              outline: "none", resize: "vertical",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-hairline)",
              color: "var(--fg-primary)", lineHeight: 1.5,
              boxSizing: "border-box",
            }}
          />
          {designData && (
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--color-circuit)", marginTop: 6, margin: 0 }}>
              ✓ design.md loaded ({designData.length} chars)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
