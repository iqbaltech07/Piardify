export default function HowItWorksStyles() {
  return (
    <style>{`
      /* ── Section ── */
      .hiw-section {
        padding: 120px 32px 140px;
        background: var(--bg-surface);
        position: relative;
        overflow: hidden;
      }
      .hiw-section::before {
        content: "";
        position: absolute;
        bottom: -100px;
        right: -200px;
        width: 600px;
        height: 600px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%);
        pointer-events: none;
      }

      /* ── Header ── */
      .hiw-header {
        text-align: center;
        margin-bottom: 80px;
      }
      .hiw-header-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 5px 14px 5px 10px;
        background: rgba(96,165,250,0.08);
        border: 1px solid rgba(96,165,250,0.2);
        border-radius: 100px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--blue-400);
        margin-bottom: 20px;
      }
      .hiw-pulse-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--blue-400);
        box-shadow: 0 0 8px var(--blue-400);
        animation: pulse-glow 2s ease-in-out infinite;
        flex-shrink: 0;
      }
      .hiw-heading {
        font-size: clamp(1.875rem, 3.5vw, 2.75rem);
        font-weight: 800;
        line-height: 1.2;
        color: var(--fg-primary);
        letter-spacing: -0.02em;
        margin-bottom: 16px;
      }
      .hiw-subheading {
        font-size: 15px;
        color: var(--fg-secondary);
        max-width: 460px;
        margin: 0 auto;
        line-height: 1.7;
      }

      /* ── Track (zigzag layout) ── */
      .hiw-track {
        max-width: 960px;
        margin: 0 auto;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      /* Spine — vertical center line */
      .hiw-spine {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 1px;
        background: linear-gradient(
          to bottom,
          transparent,
          rgba(129,140,248,0.3) 10%,
          rgba(96,165,250,0.3) 50%,
          rgba(52,211,153,0.3) 80%,
          transparent
        );
        pointer-events: none;
      }

      /* ── Individual step ── */
      .hiw-step {
        display: grid;
        grid-template-columns: 1fr 48px 1fr;
        align-items: start;
        gap: 0;
        padding: 32px 0;
        opacity: 0;
        transform: translateY(32px);
      }
      .hiw-step--visible {
        opacity: 1;
        transform: translateY(0);
        transition:
          opacity 0.6s ease var(--hiw-delay),
          transform 0.6s cubic-bezier(0.22,1,0.36,1) var(--hiw-delay);
      }

      /* Card goes right by default, left for even */
      .hiw-step .hiw-card           { grid-column: 3; grid-row: 1; }
      .hiw-step .hiw-step-num       { grid-column: 1; grid-row: 1; text-align: right; padding-right: 56px; }
      .hiw-step .hiw-connector-dot  { grid-column: 2; grid-row: 1; justify-self: center; align-self: start; margin-top: 28px; }

      .hiw-step--flip .hiw-card        { grid-column: 1; grid-row: 1; }
      .hiw-step--flip .hiw-step-num    { grid-column: 3; grid-row: 1; text-align: left; padding-right: 0; padding-left: 56px; }

      /* ── Big background number ── */
      .hiw-step-num {
        font-size: 96px;
        font-weight: 900;
        line-height: 1;
        letter-spacing: -0.06em;
        color: rgba(var(--hiw-accent-rgb), 0.08);
        padding-top: 20px;
        user-select: none;
        pointer-events: none;
        transition: color 0.3s ease;
      }
      .hiw-step--visible:hover .hiw-step-num {
        color: rgba(var(--hiw-accent-rgb), 0.14);
      }

      /* ── Connector dot ── */
      .hiw-connector-dot {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--hiw-accent);
        box-shadow: 0 0 0 4px rgba(var(--hiw-accent-rgb), 0.15), 0 0 16px rgba(var(--hiw-accent-rgb), 0.4);
        flex-shrink: 0;
      }

      /* ── Card ── */
      .hiw-card {
        position: relative;
        background: var(--bg-elevated);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 20px;
        padding: 24px;
        overflow: hidden;
        transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease, border-color 0.35s ease;
      }
      .hiw-card:hover {
        transform: translateY(-4px) scale(1.01);
        box-shadow: 0 20px 48px rgba(var(--hiw-accent-rgb), 0.15);
        border-color: rgba(var(--hiw-accent-rgb), 0.28);
      }

      /* ── Card glow ── */
      .hiw-card-glow {
        position: absolute;
        top: -40px;
        right: -40px;
        width: 160px;
        height: 160px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(var(--hiw-accent-rgb),0.14) 0%, transparent 70%);
        pointer-events: none;
      }

      /* ── Card header ── */
      .hiw-card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
      }
      .hiw-card-icon {
        width: 52px;
        height: 52px;
        border-radius: 14px;
        background: rgba(var(--hiw-accent-rgb), 0.1);
        border: 1px solid rgba(var(--hiw-accent-rgb), 0.2);
        color: var(--hiw-accent);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
      }
      .hiw-card:hover .hiw-card-icon {
        transform: scale(1.1) rotate(-4deg);
      }
      .hiw-card-meta {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .hiw-card-badge {
        display: inline-block;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--hiw-accent);
        opacity: 0.75;
      }
      .hiw-card-detail {
        font-size: 11.5px;
        font-weight: 500;
        color: var(--fg-muted);
        font-style: italic;
      }

      /* ── Card text ── */
      .hiw-card-title {
        font-size: 17px;
        font-weight: 700;
        color: var(--fg-primary);
        letter-spacing: -0.015em;
        line-height: 1.3;
        margin-bottom: 8px;
      }
      .hiw-card-desc {
        font-size: 13px;
        line-height: 1.7;
        color: var(--fg-secondary);
        margin-bottom: 16px;
      }

      /* ── Mockup visuals ── */
      .hiw-card-mockup {
        border-radius: 10px;
        background: var(--bg-base);
        border: 1px solid rgba(255,255,255,0.05);
        padding: 14px;
        min-height: 64px;
      }

      /* Text mockup */
      .hiw-mockup--text {
        display: flex;
        flex-direction: column;
        gap: 7px;
      }
      .hiw-mock-line {
        height: 8px;
        border-radius: 4px;
        background: rgba(129,140,248,0.15);
        width: 100%;
      }
      .hiw-mock-line--short { width: 45%; }
      .hiw-mock-line--med   { width: 72%; }
      .hiw-mock-cursor {
        width: 2px;
        height: 14px;
        background: var(--indigo-400);
        border-radius: 1px;
        margin-top: 2px;
        animation: pulse-glow 1s ease-in-out infinite;
      }

      /* Chips mockup */
      .hiw-mockup--chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .hiw-chip {
        font-size: 11px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 100px;
        background: rgba(96,165,250,0.12);
        border: 1px solid rgba(96,165,250,0.22);
        color: var(--blue-400);
      }

      /* Progress dots mockup */
      .hiw-mockup--progress {
        display: flex;
        gap: 6px;
        align-items: center;
      }
      .hiw-progress-dot {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.1);
        color: var(--fg-muted);
        font-size: 10px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .hiw-progress-dot--done {
        background: rgba(52,211,153,0.15);
        border-color: rgba(52,211,153,0.3);
        color: #34d399;
      }

      /* Doc mockup */
      .hiw-mockup--doc { padding: 0; overflow: hidden; }
      .hiw-doc-bar {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 8px 12px;
        background: rgba(255,255,255,0.03);
        border-bottom: 1px solid rgba(255,255,255,0.05);
      }
      .hiw-doc-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        opacity: 0.7;
      }
      .hiw-doc-title {
        font-size: 10px;
        color: var(--fg-muted);
        font-family: monospace;
        margin-left: 4px;
      }
      .hiw-doc-lines {
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .hiw-doc-line {
        height: 7px;
        border-radius: 4px;
        background: rgba(244,114,182,0.12);
        width: 100%;
      }
      .hiw-doc-line--short { width: 50%; }
      .hiw-doc-line--h1 {
        height: 11px;
        width: 70%;
        background: rgba(244,114,182,0.22);
      }
      .hiw-doc-line--h2 {
        height: 9px;
        width: 55%;
        background: rgba(244,114,182,0.18);
        margin-top: 4px;
      }

      /* ── Accent line ── */
      .hiw-card-line {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--hiw-accent), transparent);
        opacity: 0;
        transition: opacity 0.35s ease;
      }
      .hiw-card:hover .hiw-card-line { opacity: 1; }

      /* ── Responsive ── */
      @media (max-width: 768px) {
        .hiw-section { padding: 80px 20px 100px; }
        .hiw-track { max-width: 100%; }
        .hiw-spine { display: none; }
        .hiw-step {
          grid-template-columns: 1fr;
          grid-template-rows: auto;
          padding: 0 0 20px;
        }
        .hiw-step .hiw-card,
        .hiw-step--flip .hiw-card { grid-column: 1; grid-row: 1; }
        .hiw-step .hiw-step-num,
        .hiw-step--flip .hiw-step-num {
          display: none;
        }
        .hiw-connector-dot { display: none; }
      }
    `}</style>
  );
}
