/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        piardify: {
          dark: "#090A0C",         // Obsidian Deep Dark Base
          surface: "#121318",      // Surface Level 1
          elevated: "#181A22",     // Surface Level 2
          border: "#222634",       // Subtle Structural Divider
          accent: "#6366F1",       // Primary Brand Accent
          text: {
            primary: "#F3F4F6",    // High Contrast Text
            muted: "#9CA3AF",      // Muted Secondary Text
            dim: "#6B7280",        // Micro Label Text
          },
          status: {
            success: "#10B981",    // Muted Emerald
            warning: "#F59E0B",    // Muted Amber
            error: "#EF4444",      // Muted Rose
          }
        }
      },
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      borderRadius: {
        sharp: "2px",
        subtle: "6px",
        card: "10px",
      }
    }
  }
};
