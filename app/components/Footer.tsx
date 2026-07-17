"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ borderTop: "1px solid var(--border-subtle)", padding: "48px 32px" }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "24px",
        }}
      >
        {/* Logo + tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <Link href="/" id="footer-logo" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              style={{ display: "flex", alignItems: "center" }}
            >
              <Image
                src="/logo.png"
                alt="Piardify"
                width={143}
                height={80}
                style={{ height: "51px", width: "auto" }}
              />
            </motion.div>
          </Link>
          <p style={{ fontSize: "12px", color: "var(--fg-muted)" }}>AI-powered PRD generation for modern teams.</p>
        </div>

        {/* Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {[
            { label: "Features", href: "#features" },
            { label: "How It Works", href: "#how-it-works" },
            { label: "Generate", href: "/generate" },
          ].map((l, i) => (
            <motion.div
              key={l.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <Link
                href={l.href}
                id={`footer-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                style={{ fontSize: "13px", color: "var(--fg-secondary)", textDecoration: "none" }}
              >
                {l.label}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{ fontSize: "12px", color: "var(--fg-muted)" }}
        >
          © {new Date().getFullYear()} Piardify. Built with ❤️
        </motion.p>
      </div>
    </motion.footer>
  );
}
