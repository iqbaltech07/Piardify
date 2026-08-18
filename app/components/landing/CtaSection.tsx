"use client";

import Link from "next/link";
import { FileText } from "lucide-react";

export default function CtaSection({ onSeeExample }: { onSeeExample: () => void }) {
  const stats = [
    { value: "< 3 MIN", label: "PRD synthesis time" },
    { value: "10 MS", label: "Agent API latency" },
    { value: "FREE", label: "No credit card required" },
  ];

  return (
    <section
      id="about"
      style={{
        padding: "112px 32px 128px",
        position: "relative",
        background: "var(--bg-surface)",
        overflow: "hidden",
      }}
    >
      {/* Grid background */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Card */}
        <div
          style={{
            border: "1px solid var(--border-hairline)",
            borderRadius: "var(--radius-lg)",
            padding: "64px 56px",
            textAlign: "center",
            background: "var(--bg-base)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top signal accent */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: "var(--color-signal)",
            }}
          />

          {/* Annotation label */}
          <div
            style={{
              display: "inline-block",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-signal)",
              border: "1px solid var(--border-hairline)",
              borderRadius: "var(--radius-xs)",
              padding: "3px 10px",
              marginBottom: 22,
            }}
          >
            Developer Onboarding
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              color: "var(--fg-primary)",
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            Ready to provision your{" "}
            <span style={{ color: "var(--color-signal)" }}>first AI Agent Skill?</span>
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              color: "var(--color-mist)",
              marginBottom: 36,
              maxWidth: 480,
              margin: "0 auto 36px",
              lineHeight: 1.7,
            }}
          >
            Synthesize production-ready PRDs, visual mindmaps, and NPX CLI agent skills in under 3 minutes.
          </p>

          {/* CTAs */}
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 48,
            }}
          >
            <Link
              href="/generate"
              id="cta-generate"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-signal)",
                background: "var(--color-signal)",
                color: "var(--color-graphite)",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: "12px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.opacity = "0.88")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.opacity = "1")
              }
            >
              <FileText size={14} strokeWidth={2.5} />
              Create PRD Blueprint
            </Link>

            <button
              onClick={onSeeExample}
              id="cta-preview"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-strong)",
                background: "transparent",
                color: "var(--fg-secondary)",
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
                fontSize: "12px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "border-color 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--color-mist)";
                el.style.color = "var(--fg-primary)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--border-strong)";
                el.style.color = "var(--fg-secondary)";
              }}
            >
              Explore Sample PRD
            </button>
          </div>

          {/* Stats strip */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 0,
              paddingTop: 32,
              borderTop: "1px solid var(--border-hairline)",
            }}
          >
            {stats.map(({ value, label }, i) => (
              <div
                key={label}
                style={{
                  flex: 1,
                  textAlign: "center",
                  maxWidth: 180,
                  borderRight: i < stats.length - 1 ? "1px solid var(--border-hairline)" : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "var(--color-signal)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                    marginBottom: 5,
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    fontWeight: 500,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--fg-muted)",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
