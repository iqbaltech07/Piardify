export default function FeaturesStyles() {
  return (
    <style>{`
      /* ── Section ── */
      .feat-section {
        padding: 120px 32px 140px;
        position: relative;
        overflow: hidden;
      }
      .feat-section::before {
        content: "";
        position: absolute;
        top: -200px;
        left: 50%;
        transform: translateX(-50%);
        width: 900px;
        height: 600px;
        background: radial-gradient(ellipse at center,
          rgba(99,102,241,0.08) 0%,
          rgba(59,130,246,0.04) 50%,
          transparent 70%
        );
        pointer-events: none;
      }

      /* ── Header ── */
      .feat-header {
        text-align: center;
        margin-bottom: 64px;
      }
      .feat-header-pill {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 5px 14px 5px 10px;
        background: rgba(129,140,248,0.08);
        border: 1px solid rgba(129,140,248,0.2);
        border-radius: 100px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--indigo-300);
        margin-bottom: 20px;
      }
      .feat-header-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--indigo-400);
        box-shadow: 0 0 8px var(--indigo-400);
        animation: pulse-glow 2s ease-in-out infinite;
      }
      .feat-heading {
        font-size: clamp(1.875rem, 3.5vw, 2.75rem);
        font-weight: 800;
        line-height: 1.2;
        color: var(--fg-primary);
        letter-spacing: -0.02em;
        margin-bottom: 16px;
      }
      .feat-subheading {
        font-size: 15px;
        color: var(--fg-secondary);
        max-width: 500px;
        margin: 0 auto;
        line-height: 1.7;
      }

      /* ── Bento grid ── */
      .feat-bento {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        grid-auto-rows: 220px;
        gap: 14px;
      }

      /* ── Card base ── */
      .feat-card {
        position: relative;
        border-radius: 18px;
        padding: 20px 22px 18px;
        background: var(--bg-surface);
        border: 1px solid rgba(255,255,255,0.06);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        gap: 0;
        cursor: default;
        transition:
          transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
          box-shadow 0.35s ease,
          border-color 0.35s ease;
        opacity: 0;
        transform: translateY(28px);
      }
      .feat-card--visible {
        opacity: 1;
        transform: translateY(0);
        transition:
          opacity 0.55s ease var(--feat-delay),
          transform 0.55s cubic-bezier(0.22,1,0.36,1) var(--feat-delay),
          box-shadow 0.35s ease,
          border-color 0.35s ease;
      }
      .feat-card:hover {
        transform: translateY(-5px) scale(1.01);
        box-shadow: 0 20px 50px rgba(var(--feat-accent-rgb), 0.18);
        border-color: rgba(var(--feat-accent-rgb), 0.3);
      }

      /* Grid placement */
      .feat-card--large  { grid-column: span 5; grid-row: span 2; padding: 26px 28px 22px; }
      .feat-card--tall   { grid-column: span 3; grid-row: span 2; padding: 22px 20px 18px; }
      .feat-card--normal { grid-column: span 4; grid-row: span 1; }

      /* ── Glow blob ── */
      .feat-glow {
        position: absolute;
        top: -50px;
        right: -50px;
        width: 150px;
        height: 150px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(var(--feat-accent-rgb),0.16) 0%, transparent 70%);
        pointer-events: none;
        transition: transform 0.4s ease, opacity 0.35s ease;
      }
      .feat-card:hover .feat-glow {
        opacity: 1.4;
        transform: scale(1.25);
      }

      /* ── Top row ── */
      .feat-top-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-shrink: 0;
        margin-bottom: 10px;
      }
      .feat-label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--feat-accent);
        opacity: 0.8;
      }
      .feat-tag {
        font-size: 10px;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 100px;
        background: rgba(var(--feat-accent-rgb), 0.12);
        border: 1px solid rgba(var(--feat-accent-rgb), 0.22);
        color: var(--feat-accent);
        white-space: nowrap;
      }

      /* ── Icon ── */
      .feat-icon-wrap {
        width: 42px;
        height: 42px;
        border-radius: 11px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(var(--feat-accent-rgb), 0.1);
        border: 1px solid rgba(var(--feat-accent-rgb), 0.18);
        color: var(--feat-accent);
        flex-shrink: 0;
        margin-bottom: 12px;
        transition: background 0.35s, transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
      }
      .feat-icon-wrap svg { width: 20px; height: 20px; }
      .feat-card:hover .feat-icon-wrap {
        background: rgba(var(--feat-accent-rgb), 0.18);
        transform: scale(1.08) rotate(-3deg);
      }

      /* Large card icon */
      .feat-card--large .feat-icon-wrap {
        width: 54px;
        height: 54px;
        border-radius: 15px;
        margin-bottom: 16px;
      }
      .feat-card--large .feat-icon-wrap svg { width: 26px; height: 26px; }

      /* Tall card icon */
      .feat-card--tall .feat-icon-wrap {
        width: 46px;
        height: 46px;
        border-radius: 12px;
        margin-bottom: 14px;
      }
      .feat-card--tall .feat-icon-wrap svg { width: 22px; height: 22px; }

      /* ── Body ── */
      .feat-body {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 5px;
        min-height: 0;
      }
      .feat-title {
        font-size: 13.5px;
        font-weight: 700;
        color: var(--fg-primary);
        line-height: 1.35;
        letter-spacing: -0.01em;
      }
      .feat-card--large .feat-title { font-size: 19px; }
      .feat-card--tall  .feat-title { font-size: 15px; }

      .feat-desc {
        font-size: 12px;
        line-height: 1.65;
        color: var(--fg-secondary);
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .feat-card--large .feat-desc {
        font-size: 13.5px;
        line-height: 1.7;
        -webkit-line-clamp: 4;
      }
      .feat-card--tall .feat-desc {
        font-size: 12.5px;
        -webkit-line-clamp: 4;
      }

      /* ── Stat badge ── */
      .feat-stat-badge {
        display: inline-flex;
        align-items: baseline;
        gap: 5px;
        margin-top: auto;
        padding-top: 10px;
        flex-shrink: 0;
      }
      .feat-stat-num {
        font-size: 22px;
        font-weight: 800;
        letter-spacing: -0.03em;
        color: var(--feat-accent);
        line-height: 1;
      }
      .feat-card--large .feat-stat-num { font-size: 34px; }
      .feat-card--tall  .feat-stat-num { font-size: 26px; }

      .feat-stat-label {
        font-size: 10px;
        color: var(--fg-muted);
        font-weight: 500;
        letter-spacing: 0.02em;
      }

      /* ── Accent line ── */
      .feat-accent-line {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--feat-accent), transparent);
        opacity: 0;
        transition: opacity 0.35s ease;
      }
      .feat-card:hover .feat-accent-line { opacity: 1; }

      /* ── Responsive ── */
      @media (max-width: 1024px) {
        .feat-bento {
          grid-template-columns: repeat(6, 1fr);
          grid-auto-rows: 210px;
          gap: 12px;
        }
        .feat-card--large  { grid-column: span 6; grid-row: span 2; padding: 24px 26px 20px; }
        .feat-card--tall   { grid-column: span 3; grid-row: span 2; }
        .feat-card--normal { grid-column: span 3; grid-row: span 1; }
      }
      @media (max-width: 640px) {
        .feat-section { padding: 72px 16px 88px; }
        .feat-bento {
          grid-template-columns: 1fr;
          grid-auto-rows: auto;
          gap: 10px;
        }
        .feat-card--large,
        .feat-card--tall,
        .feat-card--normal {
          grid-column: span 1;
          grid-row: span 1;
        }
        .feat-card { padding: 22px; }
      }
    `}</style>
  );
}
