"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, ArrowRight } from "lucide-react";

/* ── Registration / crop marks ─────────────── */
function CropMark({ corner }: { corner: "tl" | "tr" | "bl" | "br" }) {
  const styles: Record<string, React.CSSProperties> = {
    tl: { top: -10, left: -10 },
    tr: { top: -10, right: -10 },
    bl: { bottom: -10, left: -10 },
    br: { bottom: -10, right: -10 },
  };

  const hStyles: Record<string, React.CSSProperties> = {
    tl: { top: 10, left: 0 },
    tr: { top: 10, right: 0 },
    bl: { bottom: 10, left: 0 },
    br: { bottom: 10, right: 0 },
  };

  const vStyles: Record<string, React.CSSProperties> = {
    tl: { top: 0, left: 10 },
    tr: { top: 0, right: 10 },
    bl: { bottom: 0, left: 10 },
    br: { bottom: 0, right: 10 },
  };

  return (
    <span
      aria-hidden="true"
      style={{ position: "absolute", ...styles[corner], width: 20, height: 20 }}
    >
      {/* horizontal arm */}
      <span
        style={{
          position: "absolute",
          ...hStyles[corner],
          width: 12,
          height: 1,
          background: "rgba(255,182,39,0.55)",
        }}
      />
      {/* vertical arm */}
      <span
        style={{
          position: "absolute",
          ...vStyles[corner],
          width: 1,
          height: 12,
          background: "rgba(255,182,39,0.55)",
        }}
      />
    </span>
  );
}

/* ── PRD Document card — the signature hero element ── */
function MockPrdCard({ onSeeExample }: { onSeeExample: () => void }) {
  const sections = [
    { label: "01 / Architecture Overview", lines: [100, 100, 70] },
    { label: "02 / Target Users & Scopes", lines: [100, 55] },
    { label: "03 / Core Functional Specs", lines: [100, 100, 100, 68] },
    { label: "04 / Tech Stack & Directives", lines: [100, 48] },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotateX: 4 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.7, type: "spring", stiffness: 80, delay: 0.35 }}
      style={{ position: "relative", maxWidth: 400, width: "100%" }}
    >
      {/* Crop marks */}
      <CropMark corner="tl" />
      <CropMark corner="tr" />
      <CropMark corner="bl" />
      <CropMark corner="br" />

      {/* Document card */}
      <div
        style={{
          background: "var(--color-paper)",
          border: "1px solid rgba(255,182,39,0.25)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
      >
        {/* Header bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            background: "rgba(29,35,51,0.06)",
            borderBottom: "1px solid rgba(29,35,51,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FileText
              size={13}
              style={{ color: "var(--color-graphite)", opacity: 0.6 }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-graphite)",
                opacity: 0.7,
              }}
            >
              SYSTEM PRD BLUEPRINT
            </span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              color: "var(--color-mist)",
              letterSpacing: "0.06em",
            }}
          >
            v1.0.0
          </span>
        </div>

        {/* Document body */}
        <div style={{ padding: "20px 20px 16px" }}>
          {/* Title */}
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-mist)",
              marginBottom: 6,
            }}
          >
            REF: PRD-2026-0042
          </div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "20px",
              fontWeight: 800,
              color: "var(--color-graphite)",
              lineHeight: 1.2,
              marginBottom: 14,
            }}
          >
            TaskFlow: AI Engine Architecture
          </h3>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "rgba(29,35,51,0.12)",
              marginBottom: 16,
            }}
          />

          {/* Sections */}
          {sections.map(({ label, lines }, si) => (
            <motion.div
              key={label}
              style={{ marginBottom: 14 }}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + si * 0.12 }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-circuit)",
                  marginBottom: 6,
                  opacity: 0.85,
                }}
              >
                {label}
              </div>
              {lines.map((w, li) => (
                <motion.div
                  key={li}
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    delay: 0.75 + si * 0.12 + li * 0.06,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 120,
                  }}
                  style={{
                    height: 7,
                    borderRadius: 2,
                    background: "rgba(29,35,51,0.1)",
                    width: `${w}%`,
                    marginBottom: 5,
                  }}
                />
              ))}
            </motion.div>
          ))}
        </div>

        {/* Progress annotation strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px",
            background: "rgba(29,35,51,0.05)",
            borderTop: "1px solid rgba(29,35,51,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22c55e",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                fontWeight: 500,
                color: "var(--color-graphite)",
                opacity: 0.65,
                letterSpacing: "0.06em",
              }}
            >
              Synthesized in 1m 42s · Agent Skill Ready
            </span>
          </div>
          <button
            onClick={onSeeExample}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-circuit)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              opacity: 0.85,
            }}
          >
            Preview →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Hero Section ─────────────────────────── */
export default function HeroSection({ onSeeExample }: { onSeeExample: () => void }) {
  const stats = [
    { value: "< 3 MIN", label: "PRD synthesis" },
    { value: "10 MS", label: "Agent API sync" },
    { value: "ZERO", label: "AI drift" },
  ];

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: "96px",
        paddingBottom: "80px",
        overflow: "hidden",
      }}
      className="bg-grid-dense"
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "72px",
          alignItems: "center",
        }}
        className="hero-grid"
      >
        {/* ── Left: copy ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {/* Category annotation */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            style={{ marginBottom: 20 }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 12px",
                border: "1px solid var(--border-hairline)",
                borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--color-signal)",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "var(--color-signal)",
                }}
              />
              Developer Infrastructure · Agent Skill Provisioning
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.6rem, 4.5vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.08,
              color: "var(--fg-primary)",
              letterSpacing: "-0.02em",
              marginBottom: 24,
            }}
          >
            Build System PRDs.{" "}
            <span style={{ color: "var(--color-signal)" }}>
              Provision AI Agent
            </span>{" "}
            Skills.
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: "var(--color-mist)",
              marginBottom: 36,
              maxWidth: 480,
            }}
          >
            Piardify converts raw product ideas into structured PRDs, visual mindmaps, and NPX CLI skills (<code style={{ color: "var(--color-circuit)" }}>npx piardify init</code>) for autonomous AI Agent execution.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 48 }}
          >
            <Link
              href="/generate"
              id="hero-cta-primary"
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
              id="hero-cta-secondary"
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
              <ArrowRight size={13} strokeWidth={2} />
            </button>
          </motion.div>

          {/* Stat strip */}
          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            style={{
              display: "flex",
              gap: 0,
              borderTop: "1px solid var(--border-hairline)",
              paddingTop: 24,
            }}
          >
            {stats.map(({ value, label }, i) => (
              <div
                key={value}
                style={{
                  flex: 1,
                  paddingRight: 24,
                  borderRight: i < stats.length - 1 ? "1px solid var(--border-hairline)" : "none",
                  paddingLeft: i > 0 ? 24 : 0,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "var(--fg-primary)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                    marginBottom: 4,
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
                    color: "var(--color-mist)",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Right: document card ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
          <MockPrdCard onSeeExample={onSeeExample} />
        </div>
      </div>
    </section>
  );
}
