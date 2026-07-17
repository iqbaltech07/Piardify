"use client";

import { motion } from "framer-motion";
import { Feature } from "./FeaturesData";

/* ─── Animated stat counter ──────────────── */
export function StatBadge({ stat, label, accent }: { stat: string; label: string; accent: string }) {
  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", delay: 0.3 }}
      whileHover={{ scale: 1.05 }}
      className="feat-stat-badge" 
      style={{ "--feat-accent": accent } as React.CSSProperties}
    >
      <span className="feat-stat-num">{stat}</span>
      <span className="feat-stat-label">{label}</span>
    </motion.div>
  );
}

/* ─── Single feature card ─────────────────── */
export function FeatureCard({ f, index }: { f: Feature; index: number }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.9, y: 30 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
      }}
      whileHover={{ y: -8, scale: 1.02, boxShadow: `0 20px 40px rgba(${f.accentRgb}, 0.15)` }}
      className={`feat-card feat-card--${f.size}`}
      style={{
        "--feat-accent": f.accent,
        "--feat-accent-rgb": f.accentRgb,
      } as React.CSSProperties}
    >
      {/* Glow blob */}
      <motion.div 
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="feat-glow" 
      />

      {/* Top row */}
      <div className="feat-top-row">
        <span className="feat-label">{f.label}</span>
        {f.tag && (
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="feat-tag"
          >
            {f.tag}
          </motion.span>
        )}
      </div>

      {/* Icon */}
      <motion.div 
        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
        transition={{ duration: 0.4 }}
        className="feat-icon-wrap"
      >
        {f.icon}
      </motion.div>

      {/* Content */}
      <div className="feat-body">
        <h3 className="feat-title">{f.title}</h3>
        <p className="feat-desc">{f.desc}</p>
      </div>

      {/* Stat badge */}
      <StatBadge stat={f.stat} label={f.statLabel} accent={f.accent} />

      {/* Bottom accent line */}
      <div className="feat-accent-line" />
    </motion.div>
  );
}
