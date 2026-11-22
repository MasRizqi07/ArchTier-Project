# ArchTier Design System — Architectural Dark (v2.4)

This document is the single source of truth for visual design, CSS tokens, typography, component styling, and accessibility standards across the ArchTier Next.js + Tailwind CSS + shadcn/ui application.

---

## 1. Visual Direction & Design Dials

- **Aesthetic Identity:** *Architectural Dark / Modern Technical.* Inspired by high-precision developer compilers and IDEs.
- **Strict Anti-AI-Slop Rules:**
  - **NO** generic purple/pink/neon-cyan gradients.
  - **NO** pure `#000000` black backgrounds (always use deep slate-navy `#090C12`).
  - **NO** emojis used as UI icons—every icon must be a crisp inline SVG or `lucide-react` icon with consistent `strokeWidth={2}`.
  - **NO** native browser dialogs (`alert`, `confirm`, `prompt`).
- **Design Dials:**
  - **Variance:** `7/10` (asymmetric splits, 7/5 & 5/7 bento grids, clear visual hierarchy).
  - **Motion:** `6/10` (purposeful staggered entrances, snappy `140–180ms` interactive transitions, full `prefers-reduced-motion` support).
  - **Density:** `5/10` (balanced breathing room on marketing sections; structured information density inside `/dashboard`).

---

## 2. Semantic Color Tokens

Define these exact tokens in `/src/app/globals.css` and map them to Tailwind theme utilities and shadcn/ui CSS variables.

### Surface & Canvas Tokens
| Token | Hex / Value | Usage |
| :--- | :--- | :--- |
| `--bg-primary` | `#090C12` | Primary application canvas |
| `--bg-elevated` | `#0E131D` | Elevated containers, modals, workbench shell |
| `--surface-card` | `#121825` | Standard cards, rule rows, sidebar items |
| `--surface-card-alt` | `#161E2E` | Active segmented tabs, toast surface, emphasized cards |
| `--surface-hover` | `#1C263A` | Interactive card/button hover state |
| `--surface-inset` | `#0A0E16` | Code blocks, form inputs, KPI inset boxes, terminal panels |

### Typography Colors
| Token | Hex / Value | Usage |
| :--- | :--- | :--- |
| `--text-primary` | `#F1F5F9` | Headings, primary labels, active values |
| `--text-secondary` | `#94A3B8` | Body copy, descriptions, secondary metadata |
| `--text-muted` | `#64748B` | Captions, placeholders, dimmed/deferred hints |

### Semantic Status & Accent Tokens
| Token | Hex / Value | Soft Fill | Border | Semantic Meaning |
| :--- | :--- | :--- | :--- | :--- |
| `--accent-primary` | `#10B981` | `rgba(16, 185, 129, 0.12)` | `rgba(16, 185, 129, 0.32)` | Primary CTA, `MANDATORY` / `LOCKED` rules, verified checks |
| `--accent-primary-hover` | `#14C98E` | — | — | Primary button hover (text color on primary button: `#04130D`) |
| `--status-warning` | `#F59E0B` | `rgba(245, 158, 11, 0.12)` | `rgba(245, 158, 11, 0.30)` | `RECOMMENDED` / `ADVISORY`, Growth tier, Stop-on-Conflict alerts |
| `--status-deferred` | `#38BDF8` | `rgba(56, 189, 248, 0.11)` | `rgba(56, 189, 248, 0.28)` | `DEFERRED` rules (Anti Over-Engineering) |
| `--status-danger` | `#F43F5E` | `rgba(244, 63, 94, 0.12)` | `rgba(244, 63, 94, 0.30)` | Validation errors, `BREAKING` / `OVER-ENGINEERED` tags, destructive actions |

### Structural Borders & Shadows
- `--border-subtle`: `rgba(255, 255, 255, 0.08)`
- `--border-strong`: `rgba(255, 255, 255, 0.16)`
- `--shadow-card`: `0 1px 2px rgba(0, 0, 0, 0.35), 0 12px 32px rgba(0, 0, 0, 0.28)`
- `--shadow-elevated`: `0 4px 12px rgba(0, 0, 0, 0.45), 0 24px 64px rgba(0, 0, 0, 0.55)`

---

## 3. Atmospheric Background Recipe

Apply globally via root layout wrapper so Landing, Login, and Dashboard share identical architectural depth:

1. **Blueprint Dot-Grid + Top Radial Emerald Glow (`body::before`):**
   ```css
   background-image:
     radial-gradient(ellipse 75% 45% at 65% -5%, rgba(16, 185, 129, 0.10), transparent 65%),
     radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.045) 1px, transparent 0);
   background-size: 100% 100%, 28px 28px;
   ```
2. **Fine SVG Noise Overlay:** Fixed full-screen `pointer-events: none` layer with `opacity: 0.025` using `feTurbulence` fractal noise.

---

## 4. Typography System (`next/font/google`)

Load all three font families in `/src/app/layout.tsx` and expose them via CSS variables:

| Role | Font Family | Weights | CSS Variable | Rules |
| :--- | :--- | :--- | :--- | :--- |
| **Display / Headings** | `Bricolage Grotesque` | `600, 700, 800` | `--font-display` | `letter-spacing: -0.03em`, `line-height: 1.12`, `text-wrap: balance` |
| **Body / UI** | `Plus Jakarta Sans` | `400, 500, 600, 700` | `--font-body` | Base `16px`, `line-height: 1.6` |
| **Code / Badges / Metrics** | `JetBrains Mono` | `400, 500, 600` | `--font-mono` | Always pair numeric counters/prices with `tabular-nums` |

### Type Scale
- **H1 (Hero):** `clamp(2.35rem, 4.8vw, 3.85rem)` · Weight `800`
- **H2 (Section):** `clamp(1.85rem, 3.2vw, 2.7rem)` · Weight `700`
- **H3 (Card / Panel):** `clamp(1.2rem, 1.8vw, 1.45rem)` · Weight `700`
- **Body Default:** `1rem` (`16px`) · Secondary text `#94A3B8`
- **Mono UI / Badges:** `0.70rem – 0.82rem` (`11.2px – 13px`)

---

## 5. Spacing, Radii & Layout Grid

- **Container Max Width:** `1220px` (Landing) / `1440px` fluid (Dashboard)
- **Section Vertical Rhythm:** `clamp(4rem, 7.5vw, 6.75rem)`
- **Card Padding:** `1.25rem – 1.75rem`
- **Border Radii:**
  - `--radius-sm: 6px` (segmented active pills, small tabs, kbd badges)
  - `--radius-md: 10px` (buttons, inputs, rule rows, KPI boxes)
  - `--radius-lg: 14px` (standard cards, code output panels)
  - `--radius-xl: 18px` (simulator card, workbench shell, modals)

---

## 6. Core Component Specifications (shadcn/ui Overrides)

### Buttons
- Minimum height: `44px` (`min-h-[44px]`) for touch accessibility.
- Active press feedback: `active:scale-[0.98]`.
- **Primary:** Background `#10B981`, text `#04130D` (high-contrast dark emerald ink), hover `#14C98E`.
- **Secondary:** Background `#121825`, border `rgba(255,255,255,0.16)`, text `#F1F5F9`, hover `#1C263A`.
- **Ghost:** Transparent, subtle border, hover `rgba(255,255,255,0.04)`.

### Status Pills (`<StatusPill />`)
- Always `font-mono uppercase text-[0.7rem] font-semibold tracking-[0.03em] rounded-full px-2.5 py-0.5`.
- Variants: `mandatory` (Emerald), `recommended` (Amber), `deferred` (Sky Blue), `danger` (Coral Red).

### Form Controls (Input, Select, Textarea)
- Background `--surface-inset` (`#0A0E16`), border `--border-strong`, `min-h-[44px]`.
- Focus ring: `border-[#10B981] ring-[3px] ring-[#10B981]/15`.
- Error state (`aria-invalid="true"`): `border-[#F43F5E] ring-[3px] ring-[#F43F5E]/15` + inline error message with SVG alert icon.
- Every input **must** have a permanently visible `<label>` (never rely on placeholder alone).

### Phase Segmented Control (`<PhaseSelector />`)
- Inset container (`--surface-inset`) with 3 equal columns (`01 · MVP`, `02 · Growth`, `03 · Scale`).
- Selected state uses `--surface-card-alt`, `--accent-primary-border`, and emerald title ink.

---

## 7. Motion & Accessibility Standards

- **Easing Curves:**
  - Entrance / Layout: `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`
  - Micro-interactions: `--ease-fast: cubic-bezier(0.2, 0, 0, 1)`
- **Staggered Reveal:** Entrance `fadeUp` (`14px` Y offset, `460ms`), delay `calc(var(--stagger) * 65ms)`.
- **Reduced Motion:** Wrap animations so `@media (prefers-reduced-motion: reduce)` collapses all animation/transition durations to `0.01ms`.
- **Contrast & Focus:**
  - All foreground/background pairs must achieve contrast $\ge 4.5:1$.
  - Global `:focus-visible` ring: `2px solid #10B981` with `2px` offset.