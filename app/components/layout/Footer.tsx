"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-hairline)",
        background: "var(--bg-base)",
        padding: "40px 32px",
      }}
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
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Link href="/" id="footer-logo" style={{ display: "inline-flex", alignItems: "center" }}>
            <Image
              src="/piardify-logo.svg"
              alt="Piardify"
              width={800}
              height={200}
              style={{ height: "40px", width: "auto" }}
            />
          </Link>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--fg-muted)",
              letterSpacing: "0.06em",
              marginTop: 2,
            }}
          >
            AI-powered PRD generation for modern teams.
          </p>
        </div>

        {/* Nav links */}
        <nav aria-label="Footer navigation">
          <ul
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {[
              { label: "Features", href: "/#features" },
              { label: "How it Works", href: "/#how-it-works" },
              { label: "Changelog", href: "/changelog" },
              { label: "Generate", href: "/generate" },
            ].map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  id={`footer-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--fg-muted)",
                    textDecoration: "none",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = "var(--fg-secondary)")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = "var(--fg-muted)")
                  }
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Copyright */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "var(--fg-muted)",
            letterSpacing: "0.06em",
          }}
        >
          © {new Date().getFullYear()} Piardify
        </p>
      </div>
    </footer>
  );
}
