# Landing Page Design System
### High-Converting SaaS Marketing Site — Implementation Spec for AI Coding Agents

> **Stack assumption:** Next.js/React + Tailwind CSS + Radix UI primitives + Framer Motion. All values below are literal — copy them, don't interpret them.

---

## 0. Design Philosophy

**The bar:** this should look like it was designed by the team that ships Linear, Vercel, or Stripe — not generated. That means one considered point of view, executed with restraint, not a checklist of "modern" effects.

### 0.1 Explicitly banned (do not generate any of the following)
- Purple-to-pink or blue-to-cyan diagonal gradients as hero backgrounds or button fills.
- Generic radial "glow blob" behind the hero headline (soft purple/blue blur circle).
- Cream background (`#F4F1EA`) + high-contrast serif + terracotta accent (`#D97757`) — this is the current AI-generated default, it reads as a tell.
- Pure black (`#000000`) background + single acid-green or vermilion accent.
- Perfectly symmetrical 3-column "icon / heading / paragraph" feature grids with no size or emphasis variation.
- Stock photography of people at laptops, handshakes, or diverse teams laughing.
- Emoji used as section icons.
- Centering every single element on every section — asymmetry signals intentionality.
- Drop shadows on every card (`shadow-lg` on everything is not depth, it's noise).
- Buzzword copy: "Revolutionize," "Unlock the power of," "Seamlessly," "Elevate your workflow," "Supercharge," "Game-changing," "Next-generation," "Cutting-edge." Ban this list from all copy output.

### 0.2 What to do instead
- One high-contrast accent color used sparingly and consistently — never as a gradient, always as a flat fill or 1px stroke.
- Real product surface (actual screenshot mockup in a browser/app chrome frame) as the hero's visual anchor instead of abstract shapes.
- Asymmetric bento-style grids where box size communicates importance.
- Typography as the primary visual interest — a considered scale, tight tracking on display sizes, generous line-height on body copy.
- Motion that's orchestrated (one deliberate sequence on load, consistent scroll-reveal pattern) rather than scattered per-element gimmicks.

---

## 1. Design Tokens

### 1.1 Color System — Dark Mode (default)

```css
:root {
  /* Backgrounds */
  --color-bg-base: #0B0C0E;        /* page background — warm near-black, not pure #000 */
  --color-bg-elevated: #131417;    /* cards, nav-on-scroll */
  --color-bg-overlay: #1B1D21;     /* modals, dropdowns, popovers */
  --color-bg-sunken: #08090A;      /* code blocks, inset wells */

  /* Borders */
  --color-border-subtle: rgba(255, 255, 255, 0.06);
  --color-border-default: rgba(255, 255, 255, 0.10);
  --color-border-strong: rgba(255, 255, 255, 0.16);

  /* Text */
  --color-text-primary: #F5F5F4;   /* warm off-white, not pure #FFF */
  --color-text-secondary: #A1A1AA;
  --color-text-tertiary: #6B6B70;
  --color-text-disabled: #4B4B4F;

  /* Accent — single considered color, used flat, never as a gradient */
  --color-accent: #4F6BFF;         /* electric cobalt-indigo */
  --color-accent-hover: #6B84FF;
  --color-accent-active: #3D56E0;
  --color-accent-muted-bg: rgba(79, 107, 255, 0.12);
  --color-accent-border: rgba(79, 107, 255, 0.35);
  --color-on-accent: #FFFFFF;      /* text/icon color on top of accent fill */

  /* Semantic */
  --color-success: #3FB950;
  --color-success-bg: rgba(63, 185, 80, 0.12);
  --color-warning: #E3B341;
  --color-warning-bg: rgba(227, 179, 65, 0.12);
  --color-danger: #F85149;
  --color-danger-bg: rgba(248, 81, 73, 0.12);
}
```

### 1.2 Color System — Light Mode Adaptation

```css
[data-theme="light"] {
  --color-bg-base: #FBFBFA;
  --color-bg-elevated: #FFFFFF;
  --color-bg-overlay: #FFFFFF;
  --color-bg-sunken: #F2F2F1;

  --color-border-subtle: rgba(15, 15, 15, 0.06);
  --color-border-default: rgba(15, 15, 15, 0.10);
  --color-border-strong: rgba(15, 15, 15, 0.16);

  --color-text-primary: #17171A;
  --color-text-secondary: #57575C;
  --color-text-tertiary: #85858A;
  --color-text-disabled: #B4B4B8;

  --color-accent: #4557E0;         /* darkened for AA contrast on white */
  --color-accent-hover: #3646C4;
  --color-accent-active: #2C39A3;
  --color-accent-muted-bg: rgba(69, 87, 224, 0.08);
  --color-accent-border: rgba(69, 87, 224, 0.30);
  --color-on-accent: #FFFFFF;

  /* Shadows must be re-tuned lighter in light mode — see §1.5 */
}
```

**Contrast check:** `--color-text-primary` on `--color-bg-base` = 16.1:1 (dark), 17.9:1 (light). `--color-accent` on `--color-bg-base` = 4.6:1 (passes AA for large text/UI; use `--color-accent-hover` for any 14px accent text to guarantee 4.5:1+).

### 1.3 Typography

**Font stack:**
```css
--font-display: "Geist", "Inter", -apple-system, sans-serif;   /* headings — real, open-source, by Vercel */
--font-body: "Inter", -apple-system, sans-serif;                /* body copy, UI */
--font-mono: "Geist Mono", "JetBrains Mono", monospace;          /* code, data, labels */
```
Load via `next/font/google` (Inter) and `next/font/local` (Geist) or Fontsource. Set `font-display: swap`.

**Type scale** (base 16px, ~1.25 ratio, tightened tracking at large sizes):

| Token | Size / Line-height | Weight | Letter-spacing | Usage |
|---|---|---|---|---|
| `--text-xs` | 12px / 16px | 500 | 0em | Eyebrow labels, badges |
| `--text-sm` | 14px / 20px | 400 | 0em | Captions, footnotes, nav links |
| `--text-base` | 16px / 26px | 400 | 0em | Body copy |
| `--text-lg` | 18px / 28px | 400 | -0.01em | Lead paragraph under hero |
| `--text-xl` | 20px / 28px | 500 | -0.01em | Card titles |
| `--text-2xl` | 24px / 32px | 600 | -0.015em | Section sub-headings |
| `--text-3xl` | 30px / 36px | 600 | -0.02em | Section headings |
| `--text-4xl` | 36px / 40px | 600 | -0.02em | Sub-hero headline (mobile hero) |
| `--text-5xl` | 48px / 52px | 600 | -0.03em | Hero headline (tablet) |
| `--text-6xl` | 60px / 62px | 600 | -0.03em | Hero headline (desktop) |
| `--text-7xl` | 72px / 72px | 600 | -0.04em | Hero headline (large desktop, optional) |

Body/paragraph color always `--color-text-secondary`, never full-contrast `--color-text-primary` — reserve max contrast for headings and interactive elements to keep hierarchy legible.

### 1.4 Spacing — 8pt System

```css
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
--space-5: 20px;  --space-6: 24px;  --space-8: 32px;  --space-10: 40px;
--space-12: 48px; --space-16: 64px; --space-20: 80px; --space-24: 96px;
--space-32: 128px;
```
Rule: never hardcode a pixel value outside this scale. If a gap "needs" 10px or 18px, round to the nearest token.

### 1.5 Radius & Elevation

```css
--radius-sm: 6px;   /* badges, small buttons */
--radius-md: 8px;   /* inputs, buttons */
--radius-lg: 12px;  /* cards */
--radius-xl: 16px;  /* large feature cards, modals */
--radius-2xl: 24px; /* hero visual frame */
--radius-full: 9999px; /* pills, avatars */

/* Shadows — layered, low-opacity, cool-toned. Dark mode relies more on border than shadow. */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.24);
--shadow-md: 0 4px 12px rgba(0,0,0,0.28), 0 1px 2px rgba(0,0,0,0.20);
--shadow-lg: 0 12px 32px rgba(0,0,0,0.32), 0 2px 6px rgba(0,0,0,0.24);
--shadow-xl: 0 24px 64px rgba(0,0,0,0.40), 0 4px 12px rgba(0,0,0,0.28);
--shadow-accent-glow: 0 0 0 1px var(--color-accent-border), 0 8px 24px rgba(79,107,255,0.20);

/* Light mode: halve opacities and drop blur radius ~20% */
[data-theme="light"] {
  --shadow-sm: 0 1px 2px rgba(20,20,30,0.06);
  --shadow-md: 0 4px 12px rgba(20,20,30,0.08), 0 1px 2px rgba(20,20,30,0.04);
  --shadow-lg: 0 12px 28px rgba(20,20,30,0.10);
  --shadow-xl: 0 20px 48px rgba(20,20,30,0.12);
}
```

**Glassmorphism (use only on nav-on-scroll and modal overlays, nowhere else):**
```css
.glass-surface {
  background: rgba(19, 20, 23, 0.72);
  backdrop-filter: blur(12px) saturate(140%);
  -webkit-backdrop-filter: blur(12px) saturate(140%);
  border: 1px solid var(--color-border-subtle);
}
```

### 1.6 Motion Tokens

```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);   /* primary easing — decelerated, confident */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--duration-fast: 120ms;    /* hover, focus */
--duration-base: 200ms;    /* button press, toggles */
--duration-slow: 320ms;    /* card reveal, dropdown open */
--duration-slower: 480ms;  /* modal, page-level transitions */
```
Respect `prefers-reduced-motion: reduce` globally — swap all transform/opacity transitions for opacity-only, cap duration at 1ms via:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

### 1.7 Breakpoints & Container

```js
// tailwind.config.js
screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px' }
```
```css
--container-max: 1280px;
--container-padding-mobile: 20px;   /* --space-5 */
--container-padding-tablet: 32px;   /* --space-8 */
--container-padding-desktop: 48px;  /* --space-12 */
```
```html
<div class="mx-auto max-w-[1280px] px-5 md:px-8 lg:px-12">...</div>
```

---

## 2. Global Layout Architecture

- **Grid:** 12-column, `gap: var(--space-6)` desktop / `var(--space-4)` mobile.
- **Vertical rhythm between major sections:** `padding-block: var(--space-24)` desktop, `var(--space-16)` mobile. Never let two sections touch without at least `--space-16` of breathing room.
- **Section background alternation:** base sections use `--color-bg-base`; every 2nd or 3rd section (feature grid, testimonials) uses `--color-bg-elevated` in a full-bleed band to create rhythm without needing dividers.
- **Content width:** body copy blocks (paragraphs, lead text) cap at `max-width: 640px` for readability regardless of container width.

---

## 3. Component Library

### 3.1 Button

```html
<!-- Primary -->
<button class="
  inline-flex items-center justify-center gap-2
  h-11 px-5 rounded-[var(--radius-md)]
  bg-[var(--color-accent)] text-[var(--color-on-accent)]
  text-[15px] font-medium leading-none tracking-[-0.01em]
  transition-all duration-[var(--duration-fast)] ease-[var(--ease-out-expo)]
  hover:bg-[var(--color-accent-hover)] hover:-translate-y-[1px] hover:shadow-[var(--shadow-accent-glow)]
  active:bg-[var(--color-accent-active)] active:translate-y-0
  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]
  disabled:opacity-40 disabled:pointer-events-none
">
  Get started
</button>
```

| Variant | Background | Text | Border |
|---|---|---|---|
| Primary | `--color-accent` | `--color-on-accent` | none |
| Secondary | `--color-bg-elevated` | `--color-text-primary` | 1px `--color-border-default` |
| Ghost | transparent | `--color-text-secondary` → `--color-text-primary` on hover | none |
| Destructive | `--color-danger` | `#FFFFFF` | none |

Sizes: `sm` = h-9 px-4 text-sm · `md` = h-11 px-5 text-[15px] (default) · `lg` = h-12 px-6 text-base.

**Loading state:** replace label with a 16px spinner (`border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; animation: spin 0.6s linear infinite;`), keep button width fixed via `min-width`, disable pointer events.

### 3.2 Input (text field)

```html
<div class="flex flex-col gap-2">
  <label class="text-sm font-medium text-[var(--color-text-primary)]">Work email</label>
  <input class="
    h-11 px-4 rounded-[var(--radius-md)]
    bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]
    border border-[var(--color-border-default)]
    placeholder:text-[var(--color-text-tertiary)]
    transition-colors duration-[var(--duration-fast)]
    hover:border-[var(--color-border-strong)]
    focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-muted-bg)]
    disabled:opacity-40 disabled:cursor-not-allowed
    aria-invalid:border-[var(--color-danger)] aria-invalid:ring-[var(--color-danger-bg)]
  " />
  <span class="text-sm text-[var(--color-danger)]" role="alert"><!-- error copy --></span>
</div>
```
Error state must pair color with an inline icon (16px alert-circle) — never rely on red alone (WCAG 1.4.1).

### 3.3 Card

```html
<div class="
  rounded-[var(--radius-lg)] p-6
  bg-[var(--color-bg-elevated)]
  border border-[var(--color-border-subtle)]
  transition-all duration-[var(--duration-base)] ease-[var(--ease-out-expo)]
">
```
Interactive card (feature card, pricing card) adds:
```css
hover:border-[var(--color-border-strong)] hover:-translate-y-1 hover:shadow-[var(--shadow-md)]
```

### 3.4 Navbar (uses Radix `NavigationMenu` + `Dialog` for mobile sheet)

- Height: `72px` at top of page, transitions to `64px` + `glass-surface` background + `--shadow-sm` after `scrollY > 24px` (use `useScroll`/`IntersectionObserver`, animate height/background with Framer Motion, `duration-base`).
- Layout: `grid-template-columns: auto 1fr auto;` — logo | centered nav links | CTA button.
- Mobile (`< 768px`): nav links collapse into a Radix `Dialog` full-screen sheet triggered by a hamburger icon that morphs to an X (`rotate + opacity` cross-fade, `duration-fast`).

### 3.5 Accordion (FAQ) — Radix `Accordion`
- Trigger row: `h-14`, `text-lg font-medium`, chevron icon rotates `180deg` on open (`duration-base ease-in-out`).
- Content: `AccordionContent` uses Radix's built-in `--radix-accordion-content-height` CSS variable to animate height — never `height: auto` directly:
```css
.accordion-content {
  overflow: hidden;
  animation: slideDown var(--duration-base) var(--ease-out-expo);
}
@keyframes slideDown {
  from { height: 0; } to { height: var(--radix-accordion-content-height); }
}
```

### 3.6 Tabs (product demo section) — Radix `Tabs`
- Trigger list: horizontal, `border-bottom: 1px solid var(--color-border-subtle)`, active trigger gets a `2px` bottom bar in `--color-accent` that slides between tabs via a shared `layoutId` in Framer Motion (a single `<motion.div layoutId="tab-indicator">` absolutely positioned).

### 3.7 Switch (pricing monthly/annual toggle) — Radix `Switch`
- Track: `w-11 h-6 rounded-full`, off = `--color-bg-sunken` + border, on = `--color-accent`. Thumb: `w-5 h-5` white circle, `transform: translateX()` animated `duration-fast ease-out-expo`.

### 3.8 Tooltip — Radix `Tooltip`
- `--color-bg-overlay` background, `text-sm`, `px-3 py-2`, `radius-sm`, `shadow-md`, 4px offset from trigger, fade+scale-in from `0.96` to `1` over `duration-fast`.

---

## 4. Section-by-Section Blueprint

### 4.1 Navbar
Covered in §3.4. Sticky, `position: sticky; top: 0; z-index: 50;`.

### 4.2 Hero

**Grid:**
```css
.hero {
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  text-align: center;
  padding-block: var(--space-24) var(--space-16);
  gap: var(--space-6);
}
```
- Eyebrow (optional): small pill badge, `--text-xs`, uppercase, `--color-text-secondary`, 1px border, `radius-full`, `px-3 py-1` — e.g. "Now in public beta."
- Headline: `--text-6xl` desktop / `--text-4xl` mobile, `max-width: 780px`, `--color-text-primary`. Formula: **[specific outcome] + [for whom]** — not abstract ("Ship customer support that resolves itself" not "Revolutionize your support workflow").
- Subheadline: `--text-lg`, `--color-text-secondary`, `max-width: 560px`.
- CTA row: primary + secondary button, `gap: var(--space-3)`, `flex-row` (stack `flex-col` under 480px).
- Trust microcopy under CTAs: `--text-sm`, `--color-text-tertiary` — e.g. "No credit card required."
- **Hero visual:** real product screenshot inside a browser-chrome frame (fake traffic-light dots + URL bar, `radius-xl`, `border-default`, `shadow-xl`), `max-width: 1040px`, sits below copy with `margin-top: var(--space-16)`. Apply a subtle top-fade mask if it bleeds toward the next section:
```css
.hero-visual { mask-image: linear-gradient(to bottom, black 85%, transparent 100%); }
```
- **Load animation:** stagger children (eyebrow → headline → subhead → CTAs → visual) with Framer Motion, `y: 12px → 0`, `opacity: 0 → 1`, `duration-slow`, `staggerChildren: 0.08s`.

### 4.3 Logo Cloud (social proof)
```css
.logo-cloud { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: var(--space-10); opacity: 0.6; }
.logo-cloud img { filter: grayscale(100%); height: 24px; transition: opacity var(--duration-fast); }
.logo-cloud img:hover { opacity: 1; filter: grayscale(0%); }
```
Caption above: `--text-sm`, `--color-text-tertiary`, e.g. "Trusted by teams at" — never "Our valued partners."

### 4.4 Feature Bento Grid
Asymmetric, not uniform 3-up.
```css
.bento {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(2, minmax(240px, auto));
  gap: var(--space-4);
}
.bento-item--lg { grid-column: span 4; grid-row: span 2; }
.bento-item--md { grid-column: span 2; grid-row: span 1; }
.bento-item--sm { grid-column: span 2; grid-row: span 1; }
```
Mobile: all items `grid-column: span 6` (full width, stacked, order preserved).
Each card: icon (20px, stroke `--color-accent`) top-left, `--text-xl` title, `--text-base` description in `--color-text-secondary`, optional inline mini-visual (mini chart, code snippet, UI fragment) filling remaining vertical space — this is the signature differentiator vs. generic icon+text cards.

### 4.5 How It Works (only include if the product genuinely is a linear process — do not force numbered steps otherwise)
```css
.steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-8); counter-reset: step; }
.step { position: relative; padding-top: var(--space-8); }
.step::before { counter-increment: step; content: counter(step, decimal-leading-zero); font-family: var(--font-mono); font-size: var(--text-sm); color: var(--color-accent); }
```
Connect steps with a 1px horizontal line at the icon row (`::after` pseudo-element), not arrows/emoji.

### 4.6 Product Deep-Dive (Tabs)
Two-column: left = Radix `TabsList` (vertical on desktop, `flex-col`, each trigger `text-left`, active trigger gets `--color-accent-muted-bg` fill + left `2px` accent bar), right = `TabsContent` showing the corresponding screenshot/visual. Content cross-fades (`opacity` + `4px` y-shift, `duration-base`) on tab change — never hard-cut.

### 4.7 Testimonials
```css
.testimonials { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); }
```
Masonry-style variation: middle column card has `padding: var(--space-8)` (larger) vs. outer columns `padding: var(--space-6)`, signaling a "featured" quote without a label. Quote: `--text-lg`, `--color-text-primary`, avatar (32px circle) + name (`--text-sm font-medium`) + title/company (`--text-sm`, `--color-text-tertiary`) in a row below. No 5-star icon rows — outcome-specific quotes read as more credible than generic praise.

### 4.8 Stats Band
```css
.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-6); padding-block: var(--space-16); background: var(--color-bg-elevated); border-block: 1px solid var(--color-border-subtle); }
```
Each stat: number in `--text-5xl`, `font-mono`, `--color-text-primary`; label below in `--text-sm`, `--color-text-tertiary`. Animate number count-up on scroll-into-view (Framer Motion `useMotionValue` + `animate()`, `duration: 1.2s`, `ease-out-expo`) — trigger once via `viewport={{ once: true }}`.

### 4.9 Pricing
```css
.pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6); align-items: start; }
```
- Middle/recommended tier: `border: 1px solid var(--color-accent-border)`, `box-shadow: var(--shadow-accent-glow)`, slightly elevated (`margin-top: calc(var(--space-4) * -1)` so it visually pops above siblings), small "Most popular" badge top-right corner.
- Each card: plan name (`--text-xl`), price (`--text-4xl font-mono`, with `/mo` in `--text-base --color-text-tertiary`), 1-line description, divider, feature list (checkmark icon `--color-success` + `--text-sm`), CTA button full-width at bottom.
- Billing toggle (§3.7) sits centered above the grid; switching triggers a cross-fade+height animation on the price digits (`AnimatePresence mode="wait"`, `duration-base`).

### 4.10 FAQ
Radix Accordion (§3.5), `max-width: 720px`, centered, single-column. One item open by default optional.

### 4.11 Final CTA
```css
.final-cta { display: flex; flex-direction: column; align-items: center; text-align: center; padding-block: var(--space-24); border-radius: var(--radius-2xl); background: var(--color-bg-elevated); border: 1px solid var(--color-border-default); margin-inline: var(--space-6); }
```
Headline `--text-4xl`, single primary CTA button (`lg` size), no secondary button here — one decision, one action.

### 4.12 Footer
```css
.footer { display: grid; grid-template-columns: 2fr repeat(4, 1fr); gap: var(--space-8); padding-block: var(--space-16); border-top: 1px solid var(--color-border-subtle); }
```
Column 1: logo + 1-line description + newsletter input (inline form, `flex` row, input + icon-button). Columns 2–5: link groups (Product, Company, Resources, Legal), heading `--text-sm font-medium --color-text-tertiary uppercase tracking-wide`, links `--text-sm --color-text-secondary hover:--color-text-primary`. Bottom bar: `flex justify-between`, copyright left, social icons right (20px, `--color-text-tertiary hover:--color-text-primary`).

---

## 5. Motion & Micro-interaction Library

| Interaction | Trigger | Values |
|---|---|---|
| Scroll reveal | Element enters viewport | `initial: {opacity:0, y:16}`, `whileInView: {opacity:1, y:0}`, `viewport:{once:true, margin:"-80px"}`, `duration: 0.32s`, `ease: ease-out-expo` |
| Hero stagger | Page load | `staggerChildren: 0.08s`, `delayChildren: 0.1s` |
| Card hover lift | `:hover` | `translateY(-4px)`, shadow-sm → shadow-md, `120ms` |
| Button press | `:active` | `translateY(0)`, scale unaffected (avoid scale-jitter on text buttons) |
| Nav on scroll | `scrollY > 24px` | height 72→64px, background transparent → glass-surface, `200ms` |
| Tab indicator | Tab change | shared `layoutId`, spring `{stiffness: 380, damping: 30}` |
| Number count-up | Viewport enter, once | `animate(0, targetValue, {duration: 1.2, ease: "easeOut"})` |
| Logo cloud | Ambient | CSS `@keyframes marquee` only if >6 logos and list is long enough to loop seamlessly; otherwise static wrap |

Do not add: cursor-follow blobs, parallax on every section, confetti, typewriter-effect headlines. Pick **one** signature motion moment (recommend: the hero load stagger + hero visual mask-reveal) and keep everything else quiet.

---

## 6. Accessibility

- All interactive elements get visible `:focus-visible` rings — never `outline: none` without a replacement (see Input/Button specs above).
- Color contrast: body text ≥ 4.5:1, large text/UI components ≥ 3:1 (verified in §1.2).
- Semantic landmarks: `<header>`, `<nav aria-label="Main">`, `<main>`, `<footer>`. One `<h1>` per page (hero headline), sections use `<h2>`, cards within sections `<h3>`.
- Skip link: visually hidden until focused, `<a href="#main" class="sr-only focus:not-sr-only ...">Skip to content</a>` as first DOM child.
- Radix primitives ship correct ARIA roles by default (Accordion, Tabs, Dialog, Switch, Tooltip) — do not override `role` attributes manually.
- All images require descriptive `alt`; decorative images (background textures) use `alt=""`.
- Reduced motion respected globally (§1.6).
- Mobile nav `Dialog` traps focus and returns focus to the trigger on close (Radix handles this automatically — don't disable `Dialog.Content`'s default focus management).

---

## 7. UX Writing System

**Voice:** direct, confident, specific. Say what the product does, not how impressive it is.

**Headline formula:** `[Verb] + [specific outcome] + [for whom/context]`.
Good: "Close deals without leaving your inbox." Bad: "Revolutionize your sales workflow."

**Button labels:** verb + object, active voice, matches the destination. "Start free trial," "Create workspace," "View pricing" — never "Submit," "Click here," "Learn more" (too vague; say what they'll learn).

**Banned words/phrases (reject any copy containing these):** revolutionize, unlock the power of, seamlessly, elevate, supercharge, game-changing, next-generation, cutting-edge, leverage (as verb), synergy, best-in-class, world-class, at the speed of thought, unleash.

**Microcopy under forms/CTAs:** state facts, not reassurance-speak. "No credit card required" not "We promise it's easy!"

**Testimonial selection:** prefer quotes with a specific, measurable outcome ("Cut our ticket response time from 6 hours to 40 minutes") over generic praise ("This tool changed our lives").

---

## 8. SEO Implementation

- **Title tag:** `{Primary benefit} | {Product name}` — under 60 characters.
- **Meta description:** 150–160 characters, includes primary keyword + a concrete outcome, no buzzwords.
- **Heading hierarchy:** exactly one `<h1>` (hero headline), sequential `<h2>`/`<h3>` — never skip levels for styling convenience.
- **Open Graph / Twitter Card:** `og:title`, `og:description`, `og:image` (1200×630px, product screenshot not logo-on-gradient), `twitter:card=summary_large_image`.
- **Structured data (JSON-LD):**
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Product Name",
  "applicationCategory": "BusinessApplication",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "ratingCount": "312" }
}
```
- **Images:** `next/image` with explicit `width`/`height` to prevent layout shift, `loading="lazy"` below the fold, `priority` on the hero visual only.
- **Canonical tag** on every page; **noindex** any duplicate or thank-you/confirmation pages.
- **Core Web Vitals targets:** LCP < 2.5s (hero image preloaded/priority), CLS < 0.1 (reserved image dimensions, no layout-shifting web fonts — use `font-display: swap` + size-adjusted fallback), INP < 200ms (avoid heavy synchronous JS in scroll handlers — throttle/`requestAnimationFrame` the nav scroll listener).

---

## 9. Responsive Summary

| Breakpoint | Container padding | Hero headline | Grid columns (bento/pricing/testimonials) |
|---|---|---|---|
| `< 640px` | 20px | `--text-4xl` | 1 |
| `640–1023px` | 32px | `--text-5xl` | 2 |
| `1024–1279px` | 48px | `--text-6xl` | 3 (bento: 6-col as specified) |
| `≥ 1280px` | 48px, capped at 1280px container | `--text-6xl`/`--text-7xl` | full spec as above |

---

## 10. Pre-Ship QA Checklist

- [ ] Only one accent color used across the entire page — no stray blues/purples from default library styles.
- [ ] No gradient fills on buttons or hero background.
- [ ] Every button/input has visible hover, focus-visible, active, and disabled states implemented.
- [ ] `prefers-reduced-motion` tested.
- [ ] Lighthouse: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95.
- [ ] Copy scanned against the banned-word list in §7.
- [ ] Tab order is logical top-to-bottom, left-to-right; skip link present and functional.
- [ ] Mobile nav sheet traps focus and closes on `Escape`.
