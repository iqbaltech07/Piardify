"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, X, CreditCard } from "lucide-react";

const FREE_FEATURES = [
  { text: "1 PRD generation per month", included: true },
  { text: "7-step personalization flow", included: true },
  { text: "Markdown export (.md)", included: true },
  { text: "AI tech stack suggestions", included: true },
  { text: "PRD preview & editor", included: true },
  { text: "3 PRD generations per month", included: false },
  { text: "Priority AI processing", included: false },
  { text: "PDF & DOCX export (coming soon)", included: false },
  { text: "Version history", included: false },
];

const PRO_FEATURES = [
  { text: "3 PRD generations per month", included: true },
  { text: "7-step personalization flow", included: true },
  { text: "Markdown export (.md)", included: true },
  { text: "AI tech stack suggestions", included: true },
  { text: "PRD preview & editor", included: true },
  { text: "Priority AI processing", included: true },
  { text: "PDF & DOCX export (coming soon)", included: true },
  { text: "Version history", included: true },
];

function FeatureRow({ text, included, accent = false }: { text: string; included: boolean; accent?: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "10px",
      padding: "8px 0",
      borderBottom: "1px solid rgba(99,102,241,0.07)",
    }}>
      <div style={{ flexShrink: 0, width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {included ? <Check size={16} strokeWidth={2.5} color={accent ? "#a5b4fc" : "var(--indigo-400)"} /> : <X size={16} strokeWidth={2} color="var(--fg-muted)" />}
      </div>
      <span style={{
        fontSize: "13.5px",
        color: included ? (accent ? "var(--fg-primary)" : "var(--fg-secondary)") : "var(--fg-muted)",
        lineHeight: 1.5,
      }}>
        {text}
      </span>
    </div>
  );
}

export default function PricingSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 20 } },
  };

  return (
    <section id="pricing" style={{ padding: "112px 32px", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "64px" }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "4px 16px", borderRadius: "100px",
            background: "rgba(99,102,241,0.12)", border: "1px solid var(--border-subtle)",
            marginBottom: "20px",
          }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--indigo-300)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Pricing
            </span>
          </div>

          <h2 style={{
            fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, lineHeight: 1.15,
            color: "var(--fg-primary)", marginBottom: "16px",
          }}>
            Simple, transparent{" "}
            <span className="gradient-text">pricing</span>
          </h2>
          <p style={{ fontSize: "17px", color: "var(--fg-secondary)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
            Start for free and upgrade when you need more power. No credit card required.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "28px",
            alignItems: "stretch",
          }}
        >
          {/* FREE CARD */}
          <motion.div variants={cardVariants}>
            <motion.div
              whileHover={{ y: -6, boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={{
                height: "100%",
                padding: "36px 32px",
                borderRadius: "24px",
                background: "var(--glass-bg)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid var(--glass-border)",
                display: "flex", flexDirection: "column",
              }}
            >
              {/* Tier label */}
              <div style={{ marginBottom: "28px", minHeight: "160px" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  padding: "4px 12px", borderRadius: "8px",
                  background: "rgba(99,102,241,0.1)", border: "1px solid var(--border-subtle)",
                  marginBottom: "16px",
                }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--fg-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Free</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "44px", fontWeight: 800, color: "var(--fg-primary)", lineHeight: 1 }}>Rp 0</span>
                  <span style={{ fontSize: "14px", color: "var(--fg-muted)", fontWeight: 500 }}>/forever</span>
                </div>
                <p style={{ fontSize: "13.5px", color: "var(--fg-muted)", lineHeight: 1.55 }}>
                  Perfect for trying out Piardify. Generate your first PRD with no strings attached.
                </p>
              </div>

              {/* CTA */}
              <Link
                href="/login"
                id="pricing-free-cta"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  padding: "13px 24px", borderRadius: "12px",
                  border: "1px solid var(--border-default)",
                  background: "rgba(255,255,255,0.03)",
                  color: "var(--fg-primary)", fontWeight: 600, fontSize: "14px",
                  textDecoration: "none", marginBottom: "28px",
                  transition: "all 0.2s",
                }}
              >
                Get Started Free
              </Link>

              {/* Feature list */}
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--fg-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
                  What's included
                </p>
                {FREE_FEATURES.map((f) => (
                  <FeatureRow key={f.text} text={f.text} included={f.included} />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* PRO CARD */}
          <motion.div variants={cardVariants}>
            <motion.div
              whileHover={{ y: -6, boxShadow: "0 32px 80px rgba(99,102,241,0.25)" }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={{
                height: "100%",
                padding: "36px 32px",
                borderRadius: "24px",
                background: "linear-gradient(145deg, rgba(99,102,241,0.18) 0%, rgba(59,130,246,0.12) 100%)",
                border: "1px solid var(--border-strong)",
                display: "flex", flexDirection: "column",
                position: "relative", overflow: "hidden",
                boxShadow: "0 0 0 1px rgba(99,102,241,0.15), 0 20px 60px rgba(0,0,0,0.4)",
              }}
            >
              {/* Inner glow */}
              <div style={{
                position: "absolute", top: "-60px", right: "-60px",
                width: "220px", height: "220px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)",
                pointerEvents: "none",
              }} />

              {/* Popular badge */}
              <div style={{
                position: "absolute", top: "20px", right: "20px",
                padding: "4px 12px", borderRadius: "100px",
                background: "linear-gradient(135deg, var(--indigo-500), var(--blue-500))",
                fontSize: "11px", fontWeight: 700, color: "white", letterSpacing: "0.05em",
              }}>
                ✦ Most Popular
              </div>

              {/* Tier label */}
              <div style={{ marginBottom: "28px", minHeight: "160px" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  padding: "4px 12px", borderRadius: "8px",
                  background: "rgba(99,102,241,0.2)", border: "1px solid var(--border-default)",
                  marginBottom: "16px",
                }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--indigo-300)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Pro</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "44px", fontWeight: 800, lineHeight: 1 }} className="gradient-text">Rp 49k</span>
                  <span style={{ fontSize: "14px", color: "var(--fg-muted)", fontWeight: 500 }}>/month</span>
                </div>
                <p style={{ fontSize: "13.5px", color: "var(--fg-secondary)", lineHeight: 1.55 }}>
                  For power users, founders, and teams who generate PRDs regularly.
                </p>
              </div>

              {/* CTA */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ marginBottom: "28px" }}>
                <Link
                  href="/login"
                  id="pricing-pro-cta"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    padding: "13px 24px", borderRadius: "12px",
                    background: "linear-gradient(135deg, var(--indigo-500), var(--blue-500))",
                    color: "white", fontWeight: 600, fontSize: "14px",
                    textDecoration: "none",
                    boxShadow: "0 0 28px rgba(99,102,241,0.4)",
                    transition: "all 0.2s",
                  }}
                >
                  <CreditCard size={15} strokeWidth={2.5} />
                  Upgrade to Pro
                </Link>
              </motion.div>

              {/* Feature list */}
              <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--indigo-400)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
                  Everything in Free, plus
                </p>
                {PRO_FEATURES.map((f) => (
                  <FeatureRow key={f.text} text={f.text} included={f.included} accent />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{
            textAlign: "center", marginTop: "40px",
            fontSize: "13px", color: "var(--fg-muted)", lineHeight: 1.6,
          }}
        >
          🔒 Secure payment · Cancel anytime · No hidden fees
        </motion.p>
      </div>
    </section>
  );
}
