import { parseDesignMarkdown } from "./designParser";

export function generateDefaultDesignMarkdown(
  appName: string,
  appIdea: string,
  designPreference?: string
): string {
  const pref = designPreference || "Modern Enterprise Light Mode (Visual-First & Users-First)";

  return `# Design Guidelines & System Specifications: ${appName}

## 1. Aesthetic Direction & Brief Inference
- **Design Read**: Reading as a ${pref} for end-users, with a visual-first, high-contrast, and intuitive user interface.
- **Product Context**: ${appIdea}
- **The Three Dials Configuration**:
  - \`DESIGN_VARIANCE: 8\` (Asymmetric Bento Grid rhythm & high visual distinction)
  - \`MOTION_INTENSITY: 6\` (Tactile 150-200ms cubic-bezier state transitions)
  - \`VISUAL_DENSITY: 4\` (Airy 4px-grid spacing with max-width container bounds)
- **Design Locks**:
  - \`Color Consistency Lock\`: Single primary accent color system across all page surfaces.
  - \`Shape Consistency Lock\`: Uniform 8px (\`rounded.md\`) for inputs/buttons, 12-16px (\`rounded.lg\`) for cards.
  - \`Page Theme Lock\`: Locked root Light Mode surface (\`#f8fafc\`), crisp dark slate text (\`#0f172a\`), zero theme glare.

## 2. Design Tokens & Color System (HSL / HEX)

| Token Name | HEX / HSL Value | Role & Purpose |
| :--- | :--- | :--- |
| \`bg-base\` | \`#f8fafc\` / \`hsl(210, 40%, 98%)\` | Primary page background surface (Clean off-white) |
| \`bg-surface\` | \`#ffffff\` / \`hsl(0, 0%, 100%)\` | Pure white card, sidebar, and container background |
| \`bg-elevated\` | \`#f1f5f9\` / \`hsl(210, 40%, 96%)\` | Hover states, popovers, and elevated panels |
| \`border-subtle\` | \`#e2e8f0\` / \`hsl(214, 32%, 91%)\` | Crisp subtle hairline borders |
| \`border-glow\` | \`#818cf8\` / \`hsl(238, 92%, 74%)\` | Active state & input focus rings |
| \`accent-primary\` | \`#4f46e5\` / \`hsl(243, 75%, 59%)\` | Primary action buttons & active indicators |
| \`accent-hover\` | \`#4338ca\` / \`hsl(243, 64%, 50%)\` | Primary button hover state |
| \`fg-primary\` | \`#0f172a\` / \`hsl(222, 47%, 11%)\` | Deep slate high emphasis text & headings (WCAG AAA) |
| \`fg-muted\` | \`#64748b\` / \`hsl(215, 16%, 47%)\` | Muted secondary text, metadata & helper copy |

## 3. Typography & Font Pairing
- **Display Font**: Plus Jakarta Sans / Outfit (paired display font for headings & visual hierarchy)
- **Body Font**: Inter / system-ui (highly readable body font)
- **Mono Font**: JetBrains Mono / Geist Mono (for code, JSON schemas, and technical tokens)
- **Heading 1**: 2rem (32px), Font-weight 800, Color \`#0f172a\`, Letter-spacing -0.02em
- **Heading 2**: 1.3rem (20.8px), Font-weight 700, Color \`#1e293b\`
- **Body Text**: 14px, Line-height 1.6, Color \`#334155\`, Font-weight 400
- **Code Pill**: Background \`rgba(99,102,241,0.08)\`, Border \`rgba(99,102,241,0.2)\`, Text \`#4338ca\`

## 4. Layout, 4px Grid & Spacing Scale
- **Container Max-Width**: 1280px with 24px/32px responsive inline padding.
- **Grid System**: 12-column responsive layout adhering strictly to 4px spacing scale (8px, 12px, 16px, 24px).
- **Section Spacing**: Generous separation of 48px (mobile) to 80px (desktop) between major narrative sections.

## 5. Elevation & Layered Shadow System
- **Subtle Elevation**: Multi-layered shadow \`0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)\`.
- **Elevated Surfaces**: Soft shadow \`0 10px 25px -3px rgba(15,23,42,0.08)\` for dropdowns, tooltips, and modals.
- **Visual Contrast**: High contrast cards with soft 1px border stroke (\`#e2e8f0\`) on pure white background.

## 6. Border Radius & Shape Locks
- **Buttons & Inputs**: 8px (\`rounded.md\`) — uniform corner radius across all form inputs and action buttons.
- **Card Containers**: 12px (\`rounded.lg\`) to 16px (\`rounded.xl\`) for main content cards and preview panels.
- **Badges & Tags**: Full pill (\`rounded-full\` / 9999px) strictly reserved for status indicators.

## 7. Component Guidelines & Badges
- **Modular Architecture**: Self-contained, reusable React components with zero ad-hoc inline styles.
- **Hero Badge Rule**: Eyebrow badge allowed ONLY on Hero section if visual anchor is required; prohibited on subsequent sections.
- **Bento Layouts**: Feature cards should utilize asymmetric bento grid layout to avoid repetitive 3-card loops.

## 8. Icons & Micro-Interactions
- **Iconography**: Lucide React icons with 1.5px uniform stroke-width.
- **Micro-Transitions**: Fast 150ms to 200ms cubic-bezier transition (\`ease-out\`) for hover and click states.
- **Transform Constraints**: Max 1px translateY offset on card hover; transform scale limited to max 1.02.

## 9. Accessibility & WCAG AA Contrast
- **Text Contrast**: High contrast (minimum 4.5:1 for body, 14:1 for headings) against background surfaces.
- **Focus Rings**: 2px visible focus ring (\`border-glow\`) with 2px offset for keyboard navigation.
- **Semantic HTML**: HTML5 semantic markup (\`<header>\`, \`<main>\`, \`<section>\`, \`<article>\`) with valid ARIA attributes.

## 10. Do's and Don'ts (Taste Skill Anti-Slop Directives)

### Do
- Declare an explicit design direction before writing UI code.
- Maintain strict color and shape consistency across all page sections.
- Use HSL defined tokens and pair display font with body font.
- Ensure WCAG AA contrast compliance for all text against light surfaces.

### Don't
- Do not use purple-to-blue gradient, gradient text, or neon glows (AI Slop Tell #1).
- Do not use side-tab accent borders or nested cards inside cards.
- Do not repeat identical 3-card grid loops without visual weight variation.
- Do not use marketing buzzwords ("supercharge", "next-gen", "cutting-edge") in copy.
`;
}

export function generateDefaultDesignData(
  appName: string,
  appIdea: string,
  designPreference?: string
): string {
  const mdText = generateDefaultDesignMarkdown(appName, appIdea, designPreference);
  const structuredData = parseDesignMarkdown(mdText);
  return JSON.stringify(structuredData);
}
