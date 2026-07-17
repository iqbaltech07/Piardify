"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Gauge, Target, FileText } from "lucide-react";

/* A decorative mock PRD card shown on the hero */
function MockPrdCard() {
  return (
    <motion.div
      animate={{ y: [0, -15, 0] }}
      transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "420px",
        borderRadius: "20px",
        padding: "24px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}
    >
      {/* Window dots */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: "12px", height: "12px", borderRadius: "50%", background: c }} />
        ))}
      </div>

      <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", color: "var(--indigo-400)", marginBottom: "4px", textTransform: "uppercase" }}>
        Product Requirements Document
      </div>
      <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--fg-primary)", marginBottom: "4px" }}>
        TaskFlow — AI Task Manager
      </div>
      <div style={{ height: "1px", background: "var(--border-subtle)", margin: "12px 0 16px" }} />

      {[
        { label: "Overview", lines: 2 },
        { label: "Target Users", lines: 1 },
        { label: "Core Features", lines: 3 },
        { label: "Tech Stack", lines: 1 },
      ].map(({ label, lines }, idx) => (
        <motion.div
          key={label}
          style={{ marginBottom: "16px" }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 + idx * 0.15 }}
        >
          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--indigo-300)", marginBottom: "6px" }}>{label}</div>
          {Array.from({ length: lines }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ width: 0 }}
              animate={{ width: i === lines - 1 ? "65%" : "100%" }}
              transition={{ delay: 1 + idx * 0.15 + i * 0.1, duration: 0.8, type: "spring" }}
              style={{
                height: "8px",
                borderRadius: "4px",
                background: "var(--bg-elevated)",
                marginBottom: "6px",
              }}
            />
          ))}
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "12px", borderTop: "1px solid var(--border-subtle)" }}
      >
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }}
        />
        <span style={{ fontSize: "11px", color: "var(--fg-muted)" }}>Generated in 1m 42s · 100% complete</span>
      </motion.div>
    </motion.div>
  );
}



export default function HeroSection({ onSeeExample }: { onSeeExample: () => void }) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } }
  };

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: "100px",
        paddingBottom: "80px",
        overflow: "hidden",
      }}
      className="bg-grid"
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "64px",
          alignItems: "center",
        }}
      >
        {/* Left: Text */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 14px",
              borderRadius: "100px",
              background: "rgba(99,102,241,0.12)",
              border: "1px solid var(--border-subtle)",
              marginBottom: "24px",
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--indigo-500)", display: "inline-block" }}
            />
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--indigo-300)", letterSpacing: "0.02em" }}>
              AI-Powered · Anti-Hallucination · Structured
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            style={{
              fontSize: "clamp(2.5rem, 4vw, 3.75rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: "24px",
              color: "var(--fg-primary)",
            }}
          >
            Generate a{" "}
            <span className="gradient-text">professional PRD</span>{" "}
            in minutes
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={itemVariants}
            style={{
              fontSize: "1.125rem",
              lineHeight: 1.7,
              color: "var(--fg-secondary)",
              marginBottom: "36px",
              maxWidth: "520px",
            }}
          >
            Piardify turns your product idea into a complete, structured Product
            Requirements Document — with AI that actually understands your vision.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "40px" }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/generate"
                id="hero-cta-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 28px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, var(--indigo-500), var(--blue-500))",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "15px",
                  textDecoration: "none",
                  boxShadow: "0 0 32px rgba(99,102,241,0.35)",
                }}
              >
                <FileText size={18} strokeWidth={2.5} />
                Generate My PRD
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={onSeeExample}
                id="hero-cta-secondary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 28px",
                  borderRadius: "12px",
                  color: "var(--fg-primary)",
                  fontWeight: 600,
                  fontSize: "15px",
                  border: "1px solid var(--border-default)",
                  background: "rgba(255,255,255,0.03)",
                  cursor: "pointer",
                }}
              >
                See Example
                <ArrowRight size={16} strokeWidth={2} />
              </button>
            </motion.div>
          </motion.div>

          {/* Social proof */}
          <motion.div variants={itemVariants} style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
            {[
              { icon: <Gauge size={16} className="text-amber-500" />, text: "< 3 min generation" },
              { icon: <Target size={16} className="text-emerald-500" />, text: "7-step personalization" },
              { icon: <FileText size={16} className="text-blue-500" />, text: "Export to Markdown" },
            ].map((item, idxx) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + idxx * 0.1 }}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>{item.icon}</span>
                <span style={{ fontSize: "13px", color: "var(--fg-secondary)" }}>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: PRD Card mockup */}
        <motion.div
          initial={{ opacity: 0, x: 50, rotateY: -15, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", delay: 0.3 }}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            perspective: "1000px"
          }}
        >
          <div style={{ position: "relative" }}>
            <MockPrdCard />
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
