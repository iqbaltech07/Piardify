/**
 * CSS Variables Boilerplate Generator (Anti-Slop Compliant)
 */
export function getCssVariablesContent(target: string = "web"): string {
  return `/* Piardify Anti-Slop Theme Boilerplate */
:root {
  --piardify-bg: #090A0C;
  --piardify-surface-1: #121318;
  --piardify-surface-2: #181A22;
  --piardify-border: #222634;
  --piardify-accent: #6366F1;
  --piardify-text: #F3F4F6;
  --piardify-text-muted: #9CA3AF;
}

body {
  background-color: var(--piardify-bg);
  color: var(--piardify-text);
  font-family: 'Inter', system-ui, sans-serif;
  min-height: 100dvh;
}

/* Anti-Slop Helper Classes */
.bg-piardify-dark { background-color: var(--piardify-bg); }
.bg-piardify-surface { background-color: var(--piardify-surface-1); }
.bg-piardify-elevated { background-color: var(--piardify-surface-2); }
.border-piardify-subtle { border-color: var(--piardify-border); }
.text-piardify-primary { color: var(--piardify-text); }
.text-piardify-muted { color: var(--piardify-text-muted); }
`;
}
