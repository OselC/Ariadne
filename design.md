# Design — Ariadne

A locked design system for this app. Every route reads this file before visual changes.
Extend this system when a new need is proven; do not invent per-page themes.

## Genre

Editorial. The product combines fashion, mythology, and technical analysis, so the
interface uses warm paper, typographic hierarchy, hairline rules, and restrained red.

## Macrostructure family

- Marketing pages: Narrative Workflow with an F4 vertical step sequence and C3 typographic links.
- App pages: Workbench with functional panes, F3 tabular specifications, and real product imagery.
- Content pages: Long Document if introduced later.

## Theme

- `--color-paper` oklch(97% 0.010 74)
- `--color-paper-2` oklch(94% 0.014 72)
- `--color-paper-3` oklch(90% 0.016 70)
- `--color-ink` oklch(17% 0.014 30)
- `--color-ink-2` oklch(30% 0.018 30)
- `--color-rule` oklch(82% 0.018 65)
- `--color-muted` oklch(42% 0.018 35)
- `--color-accent` oklch(50% 0.205 25)
- `--color-accent-ink` oklch(98% 0.008 74)
- `--color-focus` oklch(55% 0.220 25)

Accent footprint stays below 5% of a viewport: active state, focus, link underline,
and primary action only. There are no decorative gradients.

## Typography

- Display: Playfair Display, weight 700, roman.
- Body: Inter, weight 400. Retained from the established product UI.
- Mono: browser UI monospace, used only for technical captions and tabular figures.
- Display tracking: `-0.025em`.
- Type scale anchor: `--text-display = clamp(3rem, 7vw, 5.25rem)`.
- All data surfaces use tabular figures.

## Spacing

4-point named scale in `tokens.css`. Components use semantic tokens or mapped Tailwind
utilities; page rhythm alternates tight work areas with generous editorial intervals.

## Motion

- Easings: `--ease-out`, `--ease-in`, and `--ease-in-out` from `tokens.css`.
- Reveal pattern: none. Product content appears immediately.
- State motion: color, transform, and opacity only.
- Reduced-motion fallback: spatial movement removed; transitions capped at 150 ms.

## Microinteractions stance

- Silent success; explicit errors.
- Focus indicators appear instantly.
- Buttons depress by one pixel; cards do not float on hover.
- Loading copy uses a typographic ellipsis and persistent layout slots.

## CTA voice

- Primary CTA: solid thread red, 4 px corners, direct verb-first copy.
- Secondary CTA: hairline outline or underlined text with arrow.

## Per-page allowances

- Marketing may use one semantic thread rule as its only enrichment.
- App pages use no enrichment; camera, garment, and chart content carry the page.
- Content pages use typography only.

## What pages MUST share

- Ariadne wordmark and thread-red placement.
- Playfair Display + Inter pairing.
- N9 edge-aligned navigation and Ft4 dense colophon.
- Hairline dividers, compact controls, 4 px component corners.
- Single-column section heads and roman headings.

## What pages MAY differ on

- Pane ratios and density within the Workbench family.
- Whether data is expressed as tables, charts, or annotated product output.
- Marketing stage rhythm within Narrative Workflow.

## Exports

### tokens.css

`tokens.css` at the project root is the canonical, importable source.

### Tailwind v4 `@theme`

```css
@theme {
  --color-paper: oklch(97% 0.010 74);
  --color-paper-2: oklch(94% 0.014 72);
  --color-paper-3: oklch(90% 0.016 70);
  --color-ink: oklch(17% 0.014 30);
  --color-ink-2: oklch(30% 0.018 30);
  --color-rule: oklch(82% 0.018 65);
  --color-muted: oklch(42% 0.018 35);
  --color-accent: oklch(50% 0.205 25);
  --color-focus: oklch(55% 0.220 25);
  --font-display: var(--font-playfair), ui-serif, serif;
  --font-body: var(--font-inter), ui-sans-serif, sans-serif;
  --spacing-md: 1rem;
  --spacing-xl: 2.5rem;
  --text-display: clamp(3rem, 7vw, 5.25rem);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### DTCG `tokens.json`

```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "color": {
    "paper": { "$value": "oklch(97% 0.010 74)", "$type": "color" },
    "ink": { "$value": "oklch(17% 0.014 30)", "$type": "color" },
    "accent": { "$value": "oklch(50% 0.205 25)", "$type": "color" },
    "focus": { "$value": "oklch(55% 0.220 25)", "$type": "color" }
  },
  "font": {
    "display": { "$value": "Playfair Display, serif", "$type": "fontFamily" },
    "body": { "$value": "Inter, sans-serif", "$type": "fontFamily" }
  },
  "space": {
    "md": { "$value": "1rem", "$type": "dimension" },
    "xl": { "$value": "2.5rem", "$type": "dimension" }
  }
}
```

### shadcn/ui CSS variables

```css
:root {
  --background: 97% 0.010 74;
  --foreground: 17% 0.014 30;
  --card: 97% 0.010 74;
  --card-foreground: 17% 0.014 30;
  --popover: 94% 0.014 72;
  --popover-foreground: 17% 0.014 30;
  --primary: 50% 0.205 25;
  --primary-foreground: 98% 0.008 74;
  --secondary: 94% 0.014 72;
  --secondary-foreground: 30% 0.018 30;
  --muted: 90% 0.016 70;
  --muted-foreground: 42% 0.018 35;
  --accent: 90% 0.016 70;
  --accent-foreground: 17% 0.014 30;
  --destructive: 50% 0.210 25;
  --destructive-foreground: 98% 0.008 74;
  --border: 82% 0.018 65;
  --input: 82% 0.018 65;
  --ring: 55% 0.220 25;
  --radius: 0.25rem;
}
```
