"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function CtaSection({ onSeeExample }: { onSeeExample: () => void }) {
  return (
    <section id="about" style={{ padding: "112px 32px", overflow: "hidden" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", stiffness: 80, damping: 20 }}
          style={{
            position: "relative",
            borderRadius: "28px",
            padding: "72px 64px",
            textAlign: "center",
            overflow: "hidden",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
          }}
        >

          <div style={{ position: "relative", zIndex: 1 }}>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              style={{
                display: "inline-block",
                padding: "4px 14px",
                borderRadius: "100px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                background: "rgba(99,102,241,0.15)",
                color: "var(--indigo-300)",
                border: "1px solid var(--border-subtle)",
                marginBottom: "24px",
              }}
            >
              Get Started Free
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, marginBottom: "16px", lineHeight: 1.15, color: "var(--fg-primary)" }}
            >
              Ready to write your{" "}
              <span className="gradient-text">first PRD?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              style={{ fontSize: "17px", color: "var(--fg-secondary)", marginBottom: "40px", maxWidth: "520px", margin: "0 auto 40px", lineHeight: 1.7 }}
            >
              Join developers, product managers, and students who generate professional PRDs in under 3 minutes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "48px" }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/generate"
                  id="cta-generate"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "15px 32px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, var(--indigo-500), var(--blue-500))",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "15px",
                    textDecoration: "none",
                    boxShadow: "0 0 32px rgba(99,102,241,0.3)",
                  }}
                >
                  <FileText size={18} strokeWidth={2.5} />
                  Start Generating — Free
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button
                  onClick={onSeeExample}
                  id="cta-preview"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "15px 32px",
                    borderRadius: "12px",
                    color: "var(--fg-primary)",
                    fontWeight: 600,
                    fontSize: "15px",
                    border: "1px solid var(--border-default)",
                    background: "rgba(255,255,255,0.03)",
                    cursor: "pointer",
                  }}
                >
                  See Example PRD
                </button>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <div style={{ display: "flex", justifyContent: "center", gap: "64px", flexWrap: "wrap", paddingTop: "32px", borderTop: "1px solid var(--border-subtle)" }}>
              {[
                { value: "< 3 min", label: "Average generation time" },
                { value: "90%+", label: "PRDs completed first try" },
                { value: "Free", label: "No credit card required" },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + idx * 0.1, type: "spring", stiffness: 100 }}
                  style={{ textAlign: "center" }}
                >
                  <div style={{ fontSize: "24px", fontWeight: 700 }} className="gradient-text">{stat.value}</div>
                  <div style={{ fontSize: "12px", color: "var(--fg-muted)", marginTop: "4px" }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
