"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Changelog", href: "/changelog" },
];

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.refresh();
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderBottom: "1px solid var(--border-hairline)",
        background: "rgba(16, 24, 43, 0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <nav
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          id="nav-logo"
          style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
        >
          <Image
            src="/piardify-logo.svg"
            alt="Piardify"
            width={800}
            height={200}
            style={{ height: "32px", width: "auto" }}
            priority
          />
        </Link>

        {/* Nav Links */}
        <ul
          className="hidden md:flex items-center gap-8"
          style={{ listStyle: "none", margin: 0, padding: 0 }}
        >
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-mist)",
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--fg-primary)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--color-mist)")
                }
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth / CTA */}
        <div className="flex items-center gap-3">
          {!isPending && !session ? (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-mist)",
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
              >
                Sign In
              </Link>
              <Link
                href="/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-signal)",
                  background: "var(--color-signal)",
                  color: "var(--color-graphite)",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  fontSize: "11px",
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
                Get Started
              </Link>
            </div>
          ) : session ? (
            <div className="flex items-center gap-3">
              <Link
                href="/generate"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-signal)",
                  background: "var(--color-signal)",
                  color: "var(--color-graphite)",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  fontSize: "11px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                Generate PRD
              </Link>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  aria-label="User menu"
                  aria-expanded={dropdownOpen}
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt="Avatar"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-hairline)",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-hairline)",
                        background: "var(--bg-elevated)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--color-signal)",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    >
                      {session.user.name?.charAt(0) || "U"}
                    </div>
                  )}
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "calc(100% + 8px)",
                        width: "220px",
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border-hairline)",
                        borderRadius: "var(--radius-lg)",
                        overflow: "hidden",
                        zIndex: 50,
                      }}
                    >
                      <div
                        style={{
                          padding: "12px 16px",
                          borderBottom: "1px solid var(--border-hairline)",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "var(--fg-primary)",
                            margin: 0,
                            letterSpacing: "0.04em",
                          }}
                        >
                          {session.user.name}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "10px",
                            color: "var(--color-mist)",
                            margin: "2px 0 0",
                            letterSpacing: "0.02em",
                          }}
                        >
                          {session.user.email}
                        </p>
                      </div>

                      <div style={{ padding: "6px" }}>
                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "8px 12px",
                            borderRadius: "var(--radius-md)",
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "var(--fg-secondary)",
                            textDecoration: "none",
                            transition: "background 0.1s, color 0.1s",
                          }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.background = "var(--bg-elevated)";
                            el.style.color = "var(--fg-primary)";
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.background = "transparent";
                            el.style.color = "var(--fg-secondary)";
                          }}
                        >
                          <User size={14} strokeWidth={2} />
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: "var(--radius-md)",
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#f87171",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            transition: "background 0.1s",
                          }}
                          onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLElement).style.background =
                            "rgba(248, 113, 113, 0.08)")
                          }
                          onMouseLeave={(e) =>
                            ((e.currentTarget as HTMLElement).style.background = "transparent")
                          }
                        >
                          <LogOut size={14} strokeWidth={2.5} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div
              style={{
                width: "88px",
                height: "32px",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-elevated)",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
          )}
        </div>
      </nav>
    </header>
  );
}
