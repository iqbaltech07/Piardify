# SaaS Web App Design System
### Full Product (App Shell + Landing Page Frontend) — Implementation Spec for AI Coding Agents

> **Stack assumption:** Next.js/React + Tailwind CSS + Radix UI primitives + Framer Motion + TanStack Table (data grids) + `cmdk` (command palette). This file governs the authenticated application. The public marketing site is the companion `landing-page-design.md` — inherit all tokens from §1 there unless overridden below.

---

## 0. Relationship to the Landing Page

The landing page (marketing site) and the app (product UI) share one token system — same color, font, and radius primitives — so the brand feels continuous when a user signs up and lands in the dashboard. Two deltas:

1. **Density.** Marketing pages breathe (`--space-24` between sections); app UI is dense and task-focused (`--space-4`–`--space-8` between elements). A separate tighter spacing scale is defined in §1.1.
2. **Navigation model.** Landing page = top nav. App = persistent left sidebar + top bar. Never mix the two patterns on the same surface.

Everything in `landing-page-design.md` §1 (color, type, radius, shadow, motion tokens) applies here unless explicitly overridden.

---

## 1. Design Tokens — App-Specific Additions

### 1.1 Density Spacing Scale (app UI only)
```css
--space-app-1: 4px;  --space-app-2: 8px;  --space-app-3: 12px;
--space-app-4: 16px; --space-app-5: 20px; --space-app-6: 24px;
--space-app-8: 32px;
```
Rule of thumb: table/list rows and form fields use `--space-app-3`/`4`; card padding uses `--space-app-6`; page-level gutters use `--space-app-6`/`8`. Nothing in the app interior exceeds `--space-app-8` — reserve the wider marketing-scale spacing (`--space-16`+) for empty-state hero moments only.

### 1.2 Additional Surface Tokens
```css
--color-sidebar-bg: #0E0F12;              /* one shade darker than --color-bg-base for depth separation */
--color-sidebar-item-hover: rgba(255,255,255,0.04);
--color-sidebar-item-active-bg: var(--color-accent-muted-bg);
--color-sidebar-item-active-text: var(--color-text-primary);
--color-table-row-hover: rgba(255,255,255,0.03);
--color-table-row-selected: var(--color-accent-muted-bg);
--color-table-header-bg: var(--color-bg-base);
--color-skeleton-base: rgba(255,255,255,0.06);
--color-skeleton-shimmer: rgba(255,255,255,0.12);
```
Light mode equivalents: `--color-sidebar-bg: #F5F5F4` (one shade darker than `--color-bg-base: #FBFBFA`), row-hover `rgba(15,15,15,0.03)`, skeleton base `rgba(15,15,15,0.06)`.

**Default theme for the product:** dark mode is default at first login; respect `prefers-color-scheme` on first visit, persist user override in settings. This differs intentionally from many marketing sites — productivity tools default dark because users spend hours in them.

### 1.3 App-Specific Radius
```css
--radius-app-input: 8px;   /* var(--radius-md) — reused */
--radius-app-card: 10px;   /* slightly tighter than marketing's 12px for denser grids */
--radius-app-panel: 16px;  /* slide-overs, modals */
```

---

## 2. App Shell Architecture

```
┌──────────┬────────────────────────────────────────────┐
│          │  Topbar (56px)                              │
│ Sidebar  ├────────────────────────────────────────────┤
│ 260px /  │                                              │
│ 64px     │  Main content (scrollable, flex-1)           │
│ (collap- │                                              │
│  sible)  │                                              │
└──────────┴────────────────────────────────────────────┘
```

```css
.app-shell {
  display: grid;
  grid-template-columns: var(--sidebar-width, 260px) 1fr;
  height: 100vh;
  overflow: hidden;
  transition: grid-template-columns var(--duration-slow) var(--ease-out-expo);
}
.app-shell[data-sidebar="collapsed"] { --sidebar-width: 64px; }
```
- **Sidebar:** `260px` expanded, `64px` collapsed (icon-only rail, labels shown in a Radix `Tooltip` on hover). Collapse toggle pinned at sidebar bottom.
- **Main content:** `overflow-y: auto`, internal padding `--space-app-8` desktop / `--space-app-4` mobile, `max-width: 1440px` for dashboard grids (wider than marketing's 1280px since app UI needs more horizontal density), centered via `mx-auto`.
- **Mobile (`< 1024px`):** sidebar becomes a Radix `Dialog` sheet sliding in from the left (`transform: translateX(-100%) → 0`, `duration-base`), triggered by a hamburger icon in the topbar. Never show a collapsed icon-rail on mobile — full sidebar or fully hidden.

### 2.1 Sidebar Composition
```html
<aside class="sidebar">
  <div class="sidebar-header"><!-- logo + workspace switcher (Radix DropdownMenu) --></div>
  <nav class="sidebar-nav">
    <!-- grouped sections, each with an optional uppercase label -->
  </nav>
  <div class="sidebar-footer"><!-- user avatar menu, collapse toggle --></div>
</aside>
```

**Nav item:**
```css
.nav-item {
  display: flex; align-items: center; gap: var(--space-app-3);
  height: 36px; padding-inline: var(--space-app-3);
  border-radius: var(--radius-app-input);
  font-size: var(--text-sm); color: var(--color-text-secondary);
  transition: background var(--duration-fast), color var(--duration-fast);
}
.nav-item:hover { background: var(--color-sidebar-item-hover); color: var(--color-text-primary); }
.nav-item[aria-current="page"] {
  background: var(--color-sidebar-item-active-bg);
  color: var(--color-sidebar-item-active-text);
  font-weight: 500;
}
.nav-item[aria-current="page"]::before {
  content: ""; position: absolute; left: -12px; width: 2px; height: 16px;
  background: var(--color-accent); border-radius: var(--radius-full);
}
```
Group labels: `--text-xs`, uppercase, `--color-text-tertiary`, `letter-spacing: 0.04em`, `margin-top: var(--space-app-4)`.

### 2.2 Topbar
```css
.topbar { height: 56px; display: flex; align-items: center; justify-content: space-between; padding-inline: var(--space-app-6); border-bottom: 1px solid var(--color-border-subtle); }
```
Left: breadcrumb trail (`--text-sm`, `--color-text-tertiary`, `/` separators, current page in `--color-text-primary`). Right, in order: command palette trigger (pill button, `⌘K` shortcut hint in a `<kbd>` styled with `--font-mono`, `--text-xs`, `--color-bg-sunken` bg, `radius-sm`), notification bell (badge dot `--color-danger` when unread), avatar menu (Radix `DropdownMenu`, 28px avatar circle).

### 2.3 Command Palette (`cmdk`)
- Trigger: `⌘K` / `Ctrl+K` global listener.
- Modal: centered, `max-width: 560px`, `top: 20vh`, `radius-app-panel`, `shadow-xl`, `glass-surface` overlay behind it (`background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);`).
- Input: borderless, `h-14`, `text-lg`, autofocus.
- Results grouped by category (Pages, Actions, Recent), each result row `h-10`, hover/selected state = `--color-sidebar-item-hover`, keyboard arrow navigation built into `cmdk` by default — do not reimplement.
- Entrance: `opacity 0→1` + `scale 0.98→1`, `duration-fast`, `ease-out-expo`.

---

## 3. Core App Patterns

### 3.1 Page Header
```css
.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: var(--space-app-6); }
```
Left: `<h1>` `--text-2xl font-semibold`, optional 1-line description below in `--text-sm --color-text-secondary`. Right: primary action button (+ optional secondary/ghost actions grouped `gap: --space-app-2`).

### 3.2 Data Table (TanStack Table + custom styling)
```css
.data-table { width: 100%; border-collapse: separate; border-spacing: 0; }
.data-table thead th {
  height: 40px; padding-inline: var(--space-app-4);
  background: var(--color-table-header-bg); position: sticky; top: 0; z-index: 10;
  font-size: var(--text-xs); font-weight: 500; color: var(--color-text-tertiary);
  text-align: left; border-bottom: 1px solid var(--color-border-default);
}
.data-table tbody tr { height: 48px; border-bottom: 1px solid var(--color-border-subtle); transition: background var(--duration-fast); }
.data-table tbody tr:hover { background: var(--color-table-row-hover); }
.data-table tbody tr[data-selected="true"] { background: var(--color-table-row-selected); }
.data-table td { padding-inline: var(--space-app-4); font-size: var(--text-sm); color: var(--color-text-primary); }
```
- **Selection column:** Radix `Checkbox`, 16px, left-most column, `40px` wide; header checkbox drives select-all with an indeterminate visual state.
- **Sort:** clickable header, small chevron icon appears on hover, filled + rotated when active sort column.
- **Row actions:** right-most column, icon button (kebab menu, Radix `DropdownMenu`) revealed on row hover (`opacity: 0 → 1`) to reduce visual noise when idle.
- **Pagination footer:** `h-56px`, `flex justify-between items-center`, left shows "Showing 1–20 of 348," right shows page controls (ghost icon buttons, disabled state at bounds).
- **Empty state (no rows / filtered to zero):** centered within table body, icon (24px, `--color-text-tertiary`), heading `--text-base font-medium`, description `--text-sm --color-text-secondary`, primary action button if applicable. See §5.2 formula.
- **Loading state:** skeleton rows (see §5.4) matching the real row height exactly to prevent layout shift when data arrives.

### 3.3 Stat / KPI Cards
```css
.kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-app-4); }
.kpi-card { padding: var(--space-app-6); border-radius: var(--radius-app-card); background: var(--color-bg-elevated); border: 1px solid var(--color-border-subtle); }
```
Label (`--text-sm --color-text-tertiary`), value (`--text-3xl font-mono font-semibold`), delta badge (`--text-xs`, pill, green/red bg per §1 semantic tokens, includes a directional arrow icon — never color alone).

### 3.4 Forms & Settings Pages
Two-column pattern per setting group:
```css
.settings-row { display: grid; grid-template-columns: 280px 1fr; gap: var(--space-app-8); padding-block: var(--space-app-6); border-bottom: 1px solid var(--color-border-subtle); }
```
Left: label (`--text-base font-medium`) + helper description (`--text-sm --color-text-secondary`, `max-width: 240px`). Right: the actual control (input/select/switch), `max-width: 420px`. Stack to single column under `768px`.

Save pattern: prefer inline auto-save with a small "Saved" confirmation (fade in/out, `--color-success`, `--text-sm`, 1.5s hold) over a page-level Save button when the data model allows it; use an explicit Save button only for multi-field forms (e.g. profile edit) with a sticky footer bar that appears once the form is dirty (`translateY(100%) → 0`, `duration-base`).

### 3.5 Slide-over Panel (record detail) — Radix `Dialog` with side-anchored content
```css
.slide-over { position: fixed; top: 0; right: 0; height: 100vh; width: 480px; max-width: 92vw; background: var(--color-bg-elevated); border-left: 1px solid var(--color-border-default); box-shadow: var(--shadow-xl); }
```
Enter/exit: `transform: translateX(100%) → 0`, `duration-base`, `ease-out-expo`; overlay fades `opacity 0→1` simultaneously. Header sticky top with close button (`X`, `Escape` key also closes — Radix default). Footer sticky bottom for primary/secondary actions when the panel is a form.

### 3.6 Filters & Dropdown Menus — Radix `DropdownMenu` / `Popover`
Filter chips row above tables: each active filter is a pill (`--color-accent-muted-bg` bg, `--color-accent` text, small `X` to remove), `+ Add filter` ghost button opens a `Popover` with field/operator/value selectors.

---

## 4. Auth & Onboarding

### 4.1 Login / Signup
Centered card layout (avoid split-screen marketing imagery — it's a solved task, don't decorate it):
```css
.auth-shell { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: var(--space-6); }
.auth-card { width: 100%; max-width: 400px; padding: var(--space-8); border-radius: var(--radius-xl); border: 1px solid var(--color-border-subtle); background: var(--color-bg-elevated); }
```
Logo top-center (32px), heading `--text-2xl`, form fields with `gap: var(--space-app-4)`, password field includes a show/hide toggle (eye icon, `aria-label="Show password"`/"Hide password" toggling with `aria-pressed`), primary button full-width, divider ("or") + OAuth buttons below, footer link to the alternate flow ("Don't have an account? Sign up").

### 4.2 Onboarding Stepper
```css
.stepper-track { display: flex; gap: var(--space-2); margin-bottom: var(--space-8); }
.stepper-dot { flex: 1; height: 4px; border-radius: var(--radius-full); background: var(--color-border-default); }
.stepper-dot[data-complete="true"], .stepper-dot[data-active="true"] { background: var(--color-accent); }
```
One question/decision per screen, large single input or choice cards (not dense forms), `Continue` button disabled until the step's required input is filled, back arrow top-left. Step transitions: outgoing content `opacity 1→0, x:0→-16px`, incoming `opacity 0→1, x:16→0`, `duration-base`, `AnimatePresence mode="wait"`.

---

## 5. Feedback & System States

### 5.1 Toasts — Radix `Toast`
Position: `fixed; bottom: var(--space-6); right: var(--space-6);` stacked with `gap: var(--space-2)`, newest on top. Each toast: `radius-app-card`, `shadow-lg`, `padding: var(--space-app-4)`, left-edge 3px color bar per variant (success/danger/warning/info using §1.2 semantic tokens), auto-dismiss `4000ms` (pause on hover), manual close `X`. Enter: `translateY(8px)→0 + opacity`, exit: `translateX(100%) + opacity 0`, both `duration-base`.

### 5.2 Empty States — copy + layout formula
```css
.empty-state { display: flex; flex-direction: column; align-items: center; text-align: center; padding-block: var(--space-16); gap: var(--space-3); }
```
Icon (32px, `--color-text-tertiary`, in a `radius-full` `--color-bg-sunken` circle) → Heading (`--text-lg font-medium` — states what's missing, e.g. "No projects yet") → Description (`--text-sm --color-text-secondary`, one sentence on what happens next) → Primary action button. Never leave an empty area with no path forward.

### 5.3 Error States
- **Inline field error:** see landing page §3.2 input spec — border + icon + message, never color alone.
- **Page-level error (404/permission/500):** same layout as empty state but icon uses `--color-danger` accent circle, heading states what happened plainly ("This page doesn't exist" not "Oops!"), action button routes back to a safe place (dashboard/home).
- **Destructive confirmation:** Radix `AlertDialog` (distinct from `Dialog` — it traps focus and requires explicit dismissal), title states the exact consequence ("Delete 12 records? This can't be undone."), confirm button is `--color-danger` filled, cancel button is ghost and visually primary-positioned (left) so the safe choice is easiest to hit. For irreversible/high-stakes actions (delete workspace, remove billing), require typing the resource name into a confirmation input before enabling the confirm button.

### 5.4 Loading States
- **Skeleton (preferred over spinners for content that has a known shape):**
```css
.skeleton { background: linear-gradient(90deg, var(--color-skeleton-base) 25%, var(--color-skeleton-shimmer) 50%, var(--color-skeleton-base) 75%); background-size: 200% 100%; animation: shimmer 1.4s ease-in-out infinite; border-radius: var(--radius-sm); }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
```
Match skeleton block dimensions exactly to the real content's dimensions to avoid layout shift on load.
- **Spinner:** reserve for indeterminate short actions (button loading state, inline save) — 16–20px, 2px stroke, `border-top-color` in `--color-accent`, `animation: spin 0.6s linear infinite`.
- **Progress bar:** determinate operations (file upload, usage meters) — `h-2 radius-full`, track `--color-bg-sunken`, fill `--color-accent`, width transitions `width var(--duration-base) var(--ease-out-expo)`.
- **Optimistic UI:** for common actions (toggle, rename, reorder), update the UI immediately and roll back with a toast error if the request fails, rather than blocking on a spinner — this is the default for anything with high success probability.

---

## 6. Billing / Subscription Page

- Reuse the pricing card component from the landing page (§4.9 there) inside the app, with one addition: the user's **current plan** card gets a `--color-accent-border` outline and a "Current plan" badge instead of "Most popular."
- **Usage meters:** label + numeric value pair (`"14,200 / 20,000 requests"`) above a progress bar (§5.4); bar fill shifts to `--color-warning` past 80% and `--color-danger` past 95% of limit — always paired with the numeric label, not color alone.
- **Invoice table:** standard data table pattern (§3.2) with columns Date / Amount / Status (badge) / Download (icon button, PDF).

---

## 7. Component State Matrix

Every interactive component must implement all applicable rows below. This is the acceptance criteria for "done."

| Component | Hover | Active | Focus-visible | Disabled | Loading | Error | Empty |
|---|---|---|---|---|---|---|---|
| Button | bg lighten + `-1px` translateY | bg darken, translateY 0 | 2px accent outline, 2px offset | 40% opacity, no pointer events | spinner replaces label, fixed width | n/a | n/a |
| Input | border → `--color-border-strong` | n/a | accent border + `2px` ring | 40% opacity | n/a | danger border + ring + inline message | placeholder shown |
| Sidebar nav item | bg → item-hover | n/a | 2px accent outline | n/a | n/a | n/a | n/a |
| Table row | bg → row-hover | n/a (selection via checkbox) | outline on focused cell | n/a | skeleton row | n/a | empty-state block replaces `<tbody>` |
| Checkbox/Switch | border/track darken | thumb scale 0.96 momentarily | 2px accent outline | 40% opacity | n/a | n/a | n/a |
| Card (interactive) | `-4px` translateY + shadow-md | n/a | 2px accent outline | n/a | skeleton variant | n/a | n/a |
| Toast | pause auto-dismiss timer | n/a | close button focusable | n/a | n/a | danger variant styling | n/a |
| Modal/Dialog trigger | inherits button/link state | n/a | inherits | n/a | n/a | n/a | n/a |

---

## 8. Accessibility for App UI

- **Focus management:** every `Dialog`/`AlertDialog`/slide-over traps focus while open and returns focus to the triggering element on close (Radix default — verify it isn't overridden).
- **Live regions:** toast container uses `aria-live="polite"` (assertive only for destructive-action errors); loading state changes to tables announce via a visually-hidden `aria-live="polite"` region ("Loading results" → "20 results loaded").
- **Keyboard shortcuts:** document all global shortcuts (⌘K palette, `Esc` to close overlays, `/` to focus search if applicable) in a visible "Keyboard shortcuts" panel accessible from the user menu — don't ship hidden shortcuts.
- **Table accessibility:** `<caption>` (visually hidden if needed) describing the table's contents, `scope="col"` on header cells, row selection checkboxes get `aria-label="Select row {identifier}"`.
- **Data visualization:** never encode meaning by hue alone — pair chart series with patterns/icons/direct labels, provide a data-table fallback or `aria-describedby` summary for charts.
- **Color contrast:** re-verify all app-specific token pairs (e.g., `--color-text-tertiary` on `--color-sidebar-bg`) hit 4.5:1 for text, 3:1 for UI component boundaries — tertiary text on the darker sidebar background specifically needs re-checking since it's one shade darker than the base token was calibrated against.

---

## 9. Dark / Light Mode

Dark is the product default (§1.2). Light mode token mapping for app-specific surfaces:
```css
[data-theme="light"] {
  --color-sidebar-bg: #F5F5F4;
  --color-sidebar-item-hover: rgba(15,15,15,0.04);
  --color-table-row-hover: rgba(15,15,15,0.03);
  --color-skeleton-base: rgba(15,15,15,0.06);
  --color-skeleton-shimmer: rgba(15,15,15,0.12);
}
```
Theme toggle lives in the user avatar menu (three-way: Light / Dark / System) — not buried in a settings sub-page, since it's a frequent preference for a tool used daily.

---

## 10. UX Writing for App UI

- **Empty state formula:** `{What's missing} + {why/what happens next} + {action verb button}`. "No integrations connected yet. Connect a tool to start syncing data. → Connect integration."
- **Error message formula:** `{what happened, plainly} + {how to fix it}`, written in the interface's voice, never apologetic. "This file is too large (max 25MB). Try compressing it or splitting it into parts." Not "Oops! Something went wrong 😞."
- **Confirmation dialog copy:** state the exact, specific consequence, not a generic warning. "Delete 'Q3 Report'? This removes it for all workspace members and can't be undone." Not "Are you sure?"
- **Tooltip copy:** one short phrase describing what the control does, not a restatement of its label. A button labeled "Archive" doesn't need a tooltip saying "Archive"; if anything, explain the effect: "Move to Archived (hidden from active list)."
- **Notification/toast copy:** past tense, states what happened. "Changes saved." "3 records deleted." Action-name consistency: if the button said "Publish," the toast says "Published," never "Success!"
- **Placeholder text:** show a realistic example, not a description of the field. Input labeled "Webhook URL" → placeholder `https://yourapp.com/webhooks/incoming`, not "Enter URL."

---

## 11. SEO (public-facing app surfaces only)

Most of the app is behind auth and should be **excluded** from indexing:
```html
<meta name="robots" content="noindex, nofollow" />
```
on every authenticated route. Public-facing surfaces that ship inside the same app shell (public share links, docs, status page, public profile pages) follow the landing page's SEO rules (`landing-page-design.md` §8): unique title/description, canonical tag, Open Graph image, semantic heading hierarchy.

---

## 12. Performance & Engineering Notes

- All colors/spacing/radius/shadow values must reference the CSS custom properties defined here and in `landing-page-design.md` §1 — never hardcode hex/px values inline; wire the tokens into `tailwind.config.js` `theme.extend` so utility classes (`bg-accent`, `p-app-4`, etc.) stay consistent with this spec.
- Long lists (>200 rows) use a virtualization library (e.g. TanStack Virtual) so the DOM only renders visible rows — do not render full unpaginated datasets.
- Framer Motion `layout` animations (shared tab indicator, reordering lists) should be scoped with `LayoutGroup` to avoid animating unrelated elements.
- Avoid layout shift: skeletons must match real content dimensions (§5.4); reserve space for avatars/images with explicit `width`/`height` or `aspect-ratio`.
- Debounce/throttle expensive interactions: table filter inputs (debounce ~250ms before refetch), scroll listeners (nav shrink, infinite scroll) via `requestAnimationFrame`.

---

## 13. Pre-Ship QA Checklist

- [ ] Sidebar collapse/expand animates smoothly and persists user preference (localStorage or user settings).
- [ ] Every data table has working empty, loading, and error states — not just the happy path.
- [ ] Every destructive action goes through `AlertDialog` confirmation with specific consequence copy.
- [ ] Command palette (`⌘K`) covers navigation + at least the top 3 most common actions.
- [ ] Toast notifications match the component state matrix (§7) and are `aria-live`.
- [ ] Light/Dark/System theme toggle works and all app-specific tokens (§1.2, §9) are mapped for both themes.
- [ ] Keyboard-only pass: can complete the core task (e.g., create + edit a record) without a mouse.
- [ ] All authenticated routes carry `noindex`; only intended public routes are indexable.
- [ ] Copy reviewed against §10 formulas — no generic "Oops!" or "Are you sure?" strings remain.
