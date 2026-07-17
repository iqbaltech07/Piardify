"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { signIn } from "@/lib/auth-client";
import { Loader2, ArrowLeft, Gauge, Target, FileText, Bot, Gift } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const FEATURES = [
  { icon: <Gauge size={16} />, label: "Generate in under 3 minutes" },
  { icon: <Target size={16} />, label: "7-step anti-hallucination flow" },
  { icon: <FileText size={16} />, label: "Export clean Markdown PRD" },
  { icon: <Bot size={16} />, label: "AI-powered tech stack recommendations" },
];

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/generate",
      });
    } catch (err) {
      console.error("Login failed", err);
      setError("Sign-in failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: "var(--bg-base)" }}>
      
      {/* ── Left Branding Panel ── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex flex-col justify-between relative overflow-hidden"
        style={{
          width: "48%",
          flexShrink: 0,
          padding: "56px 64px",
          background: "linear-gradient(145deg, rgba(99,102,241,0.12) 0%, rgba(59,130,246,0.08) 50%, rgba(15,18,32,1) 100%)",
          borderRight: "1px solid var(--border-subtle)",
        }}
      >
        {/* Background grid */}
        <div
          className="bg-grid"
          style={{ position: "absolute", inset: 0, opacity: 0.5, pointerEvents: "none" }}
        />

        {/* Glow orbs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.18, 0.3, 0.18] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "-120px",
            left: "-100px",
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            background: "radial-gradient(circle, var(--indigo-500), transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}
          style={{
            position: "absolute",
            bottom: "-80px",
            right: "-80px",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background: "radial-gradient(circle, var(--blue-500), transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Logo */}
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
            <Image
              src="/logo.png"
              alt="Piardify"
              width={143}
              height={80}
              style={{ height: "61px", width: "auto" }}
            />
          </Link>
        </div>

        {/* Middle — Headline */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "4px 14px", borderRadius: "100px",
              background: "rgba(99,102,241,0.12)", border: "1px solid var(--border-subtle)",
              marginBottom: "24px",
            }}>
              <motion.span
                animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--indigo-500)", display: "inline-block" }}
              />
              <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--indigo-300)", letterSpacing: "0.05em" }}>
                AI-Powered PRD Generator
              </span>
            </div>

            <h1 style={{
              fontSize: "clamp(2rem, 3.2vw, 2.8rem)",
              fontWeight: 800, lineHeight: 1.15,
              color: "var(--fg-primary)", marginBottom: "16px",
            }}>
              Ship products faster with{" "}
              <span className="gradient-text">structured PRDs</span>
            </h1>
            <p style={{ fontSize: "16px", color: "var(--fg-secondary)", lineHeight: 1.7, marginBottom: "40px", maxWidth: "400px" }}>
              Sign in to start generating professional Product Requirements Documents in under 3 minutes — no experience needed.
            </p>
          </motion.div>

          {/* Feature list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "rgba(99,102,241,0.12)", border: "1px solid var(--border-subtle)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "17px", flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                <span style={{ fontSize: "14px", color: "var(--fg-secondary)", fontWeight: 500 }}>{f.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom — Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          style={{
            position: "relative", zIndex: 1,
            padding: "20px 24px", borderRadius: "14px",
            background: "rgba(15,18,32,0.6)", border: "1px solid var(--border-subtle)",
            backdropFilter: "blur(12px)",
          }}
        >
          <p style={{ fontSize: "13px", color: "var(--fg-secondary)", lineHeight: 1.65, marginBottom: "12px", fontStyle: "italic" }}>
            "Piardify saved me hours of documentation work. Got a full PRD for my capstone project in just 2 minutes."
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: "linear-gradient(135deg, var(--indigo-500), var(--cyan-400))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: 700, color: "white",
            }}>R</div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--fg-primary)" }}>Rafi A.</p>
              <p style={{ fontSize: "11px", color: "var(--fg-muted)" }}>IT Student, Universitas Brawijaya</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Right Login Panel ── */}
      <div
        className="flex-1 flex flex-col items-center justify-center relative overflow-hidden"
        style={{ padding: "40px 24px", minHeight: "100svh" }}
      >
        {/* Subtle background orb for right side */}
        <div style={{
          position: "absolute", bottom: "-120px", right: "-120px",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.08), transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Mobile logo (only shown on small screens) */}
        <div className="lg:hidden mb-10">
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
            <Image
              src="/logo.png"
              alt="Piardify"
              width={143}
              height={80}
              style={{ height: "61px", width: "auto" }}
            />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ width: "100%", maxWidth: "420px", position: "relative", zIndex: 1 }}
        >
          {/* Card */}
          <div style={{
            background: "var(--glass-bg)", backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid var(--glass-border)", borderRadius: "24px",
            padding: "44px 40px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.08)",
          }}>
            {/* Header */}
            <div style={{ marginBottom: "36px" }}>
              <h2 style={{
                fontSize: "26px", fontWeight: 800,
                color: "var(--fg-primary)", marginBottom: "8px", lineHeight: 1.2,
              }}>
                Welcome to Piardify
              </h2>
              <p style={{ fontSize: "14px", color: "var(--fg-secondary)", lineHeight: 1.6 }}>
                Sign in to generate, manage, and export your PRDs.
              </p>
            </div>

            {/* Divider */}
            <div style={{
              display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px",
            }}>
              <div style={{ flex: 1, height: "1px", background: "var(--border-subtle)" }} />
              <span style={{ fontSize: "11px", color: "var(--fg-muted)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Continue with
              </span>
              <div style={{ flex: 1, height: "1px", background: "var(--border-subtle)" }} />
            </div>

            {/* Google Button */}
            <motion.button
              id="login-google-btn"
              whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              disabled={isLoading}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
                padding: "14px 20px", borderRadius: "14px",
                background: "white", color: "#1a1a2e",
                fontWeight: 600, fontSize: "15px", border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.75 : 1,
                transition: "all 0.2s ease",
                fontFamily: "inherit",
              }}
            >
              {isLoading ? (
                <Loader2 style={{ width: "20px", height: "20px", animation: "spin 1s linear infinite", color: "#6366f1" }} />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              {isLoading ? "Connecting…" : "Continue with Google"}
            </motion.button>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: "14px", padding: "10px 14px", borderRadius: "10px",
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
                  color: "#f87171", fontSize: "13px", textAlign: "center",
                }}
              >
                {error}
              </motion.p>
            )}

            {/* Tier hint */}
            <div style={{
              marginTop: "28px", padding: "16px 18px", borderRadius: "12px",
              background: "rgba(99,102,241,0.07)", border: "1px solid var(--border-subtle)",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <Gift size={18} className="text-amber-500" style={{ marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--fg-primary)", marginBottom: "2px" }}>
                    Free tier — 1 PRD included
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--fg-muted)", lineHeight: 1.55 }}>
                    Sign in for free and generate your first PRD. Upgrade to Pro for unlimited access.
                  </p>
                </div>
              </div>
            </div>

            {/* Terms */}
            <p style={{ marginTop: "24px", fontSize: "11px", color: "var(--fg-muted)", textAlign: "center", lineHeight: 1.6 }}>
              By continuing, you agree to Piardify's{" "}
              <Link href="#" style={{ color: "var(--indigo-400)", textDecoration: "underline" }}>Terms of Service</Link>
              {" "}and{" "}
              <Link href="#" style={{ color: "var(--indigo-400)", textDecoration: "underline" }}>Privacy Policy</Link>.
            </p>
          </div>

          {/* Back link */}
          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <Link
              href="/"
              style={{ fontSize: "13px", color: "var(--fg-muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <ArrowLeft size={14} strokeWidth={2} />
              Back to homepage
            </Link>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
