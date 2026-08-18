"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";

const FREE_FEATURES = [
  { text: "1 Project per month (PRD, Mindmap, Tasks)",  included: true },
  { text: "5x AI Chat revision per project",             included: true },
  { text: "Interactive Visual Mindmap (React Flow)",     included: true },
  { text: "6-Phase Kanban Task Tracker",                 included: true },
  { text: "MCP Agent IDE Integration (Cursor/Windsurf)",  included: true },
  { text: "3 Projects per month",                        included: false },
  { text: "20x AI Chat with Multi-Model AI",             included: false },
  { text: "Markdown (.md) & JSON Export",                included: false },
  { text: "Priority AI Speed & Zero-Wait Queue",         included: false },
];

const PRO_FEATURES = [
  { text: "3 Projects per month (PRD, Mindmap, Tasks)",  included: true },
  { text: "20x AI Chat revision per project",            included: true },
  { text: "Multi-Model AI (Gemini 2.5/3.7 & OpenRouter)",included: true },
  { text: "Priority AI Speed & Zero-Wait Queue",         included: true },
  { text: "Interactive Visual Mindmap (React Flow)",     included: true },
  { text: "6-Phase Kanban Task Tracker (Live Sync)",     included: true },
  { text: "High-Quota MCP Agent IDE Integration",        included: true },
  { text: "Markdown (.md) & JSON Export",                included: true },
];

function FeatureRow({
  text,
  included,
  accent = false,
}: {
  text: string;
  included: boolean;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 0",
        borderBottom: "1px solid var(--border-hairline)",
      }}
    >
      <div style={{ flexShrink: 0, width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {included ? (
          <Check
            size={13}
            strokeWidth={2.5}
            style={{ color: accent ? "var(--color-signal)" : "var(--color-circuit)" }}
          />
        ) : (
          <X size={13} strokeWidth={2} style={{ color: "var(--fg-muted)" }} />
        )}
      </div>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          color: included ? "var(--fg-secondary)" : "var(--fg-muted)",
          lineHeight: 1.5,
        }}
      >
        {text}
      </span>
    </div>
  );
}

export default function PricingSection() {
  return (
    <section
      id="pricing"
      style={{
        padding: "112px 32px 128px",
        position: "relative",
        background: "var(--bg-base)",
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

      <div style={{ maxWidth: "960px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 12px",
              border: "1px solid var(--border-hairline)",
              borderRadius: "var(--radius-sm)",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-signal)",
              marginBottom: 18,
            }}
          >
            Pricing
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
              fontWeight: 800,
              lineHeight: 1.12,
              color: "var(--fg-primary)",
              letterSpacing: "-0.02em",
              marginBottom: 14,
            }}
          >
            Simple, transparent{" "}
            <span style={{ color: "var(--color-signal)" }}>pricing</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              color: "var(--color-mist)",
              maxWidth: 440,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Start for free and upgrade when you need more power. No credit card required.
          </p>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 1,
            border: "1px solid var(--border-hairline)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}
        >
          {/* FREE CARD */}
          <div
            style={{
              padding: "36px 32px",
              background: "var(--bg-base)",
              borderRight: "1px solid var(--border-hairline)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Tier label */}
            <div style={{ marginBottom: 28 }}>
              <span
                style={{
                  display: "inline-block",
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--color-mist)",
                  border: "1px solid var(--border-hairline)",
                  borderRadius: "var(--radius-xs)",
                  padding: "2px 8px",
                  marginBottom: 16,
                }}
              >
                Free
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 6,
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "42px",
                    fontWeight: 700,
                    color: "var(--fg-primary)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  Rp 0
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "var(--fg-muted)",
                    letterSpacing: "0.06em",
                  }}
                >
                  /forever
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  color: "var(--color-mist)",
                  lineHeight: 1.55,
                }}
              >
                Perfect for trying out Piardify. Generate your first PRD with no strings attached.
              </p>
            </div>

            {/* CTA */}
            <Link
              href="/login"
              id="pricing-free-cta"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "11px 20px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-strong)",
                background: "transparent",
                color: "var(--fg-primary)",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: "11px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
                marginBottom: 24,
                transition: "border-color 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--color-mist)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--border-strong)";
              }}
            >
              Get Started Free
            </Link>

            {/* Feature list */}
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "var(--fg-muted)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                What&apos;s included
              </p>
              {FREE_FEATURES.map((f) => (
                <FeatureRow key={f.text} text={f.text} included={f.included} />
              ))}
            </div>
          </div>

          {/* PRO CARD */}
          <div
            style={{
              padding: "36px 32px",
              background: "var(--bg-elevated)",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {/* Top signal accent bar */}
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

            {/* Popular badge */}
            <div
              style={{
                position: "absolute",
                top: 18,
                right: 20,
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-graphite)",
                background: "var(--color-signal)",
                padding: "3px 10px",
                borderRadius: "var(--radius-xs)",
              }}
            >
              Most Popular
            </div>

            {/* Tier label */}
            <div style={{ marginBottom: 28 }}>
              <span
                style={{
                  display: "inline-block",
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--color-signal)",
                  border: "1px solid var(--color-signal)",
                  borderRadius: "var(--radius-xs)",
                  padding: "2px 8px",
                  marginBottom: 16,
                  marginTop: 20,
                }}
              >
                Pro
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 6,
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "42px",
                    fontWeight: 700,
                    color: "var(--color-signal)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  Rp 49k
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "var(--fg-muted)",
                    letterSpacing: "0.06em",
                  }}
                >
                  /month
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  color: "var(--color-mist)",
                  lineHeight: 1.55,
                }}
              >
                For power users, founders, and teams who generate PRDs regularly.
              </p>
            </div>

            {/* CTA */}
            <Link
              href="/login"
              id="pricing-pro-cta"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "11px 20px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-signal)",
                background: "var(--color-signal)",
                color: "var(--color-graphite)",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: "11px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
                marginBottom: 24,
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.opacity = "0.88")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.opacity = "1")
              }
            >
              Upgrade to Pro
            </Link>

            {/* Feature list */}
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "var(--color-signal)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                  opacity: 0.8,
                }}
              >
                Everything in Free, plus
              </p>
              {PRO_FEATURES.map((f) => (
                <FeatureRow key={f.text} text={f.text} included={f.included} accent />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p
          style={{
            textAlign: "center",
            marginTop: 24,
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--fg-muted)",
            letterSpacing: "0.06em",
            lineHeight: 1.6,
          }}
        >
          Secure payment · Cancel anytime · No hidden fees
        </p>
      </div>
    </section>
  );
}
