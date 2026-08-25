# Design — Ariadne

A locked design system for this app. Every route reads this file before visual changes.
Extend it only when a new need is proven; do not invent per-page themes.

## Genre

Modern-minimal. Ariadne uses a warm-white canvas, geometric sans-serif hierarchy,
precise rules, and restrained coral red to feel like a premium technology product
without losing its fashion context.

## Macrostructure family

- Marketing pages: Marquee Hero above the fold, followed by an F4 vertical workflow.
- App pages: Workbench with functional panes, F3 tabular specifications, and real product imagery.
- Content pages: Long Document if introduced later.

## Theme

- `--color-paper` oklch(98.5% 0.006 55)
- `--color-paper-2` oklch(96.5% 0.009 55)
- `--color-paper-3` oklch(93.5% 0.012 55)
- `--color-ink` oklch(18% 0.018 30)
- `--color-ink-2` oklch(31% 0.022 30)
- `--color-rule` oklch(88% 0.012 45)
- `--color-muted` oklch(47% 0.020 35)
- `--color-accent` oklch(56% 0.205 25)
- `--color-accent-ink` oklch(98.5% 0.006 55)
- `--color-focus` oklch(60% 0.220 25)

Accent stays focused on active states, focus, small markers, and the primary action.
There are no decorative gradients.

### Dark variant

- `--color-paper` oklch(18% 0.018 30)
- `--color-paper-2` oklch(22% 0.018 30)
- `--color-paper-3` oklch(27% 0.018 30)
- `--color-ink` oklch(96.5% 0.009 55)
- `--color-ink-2` oklch(78% 0.014 50)
- `--color-rule` oklch(35% 0.018 35)
- `--color-muted` oklch(72% 0.014 50)
- `--color-accent` oklch(67% 0.185 25)
- `--color-accent-ink` oklch(18% 0.018 30)
- `--color-focus` oklch(72% 0.195 25)

Dark mode follows the operating-system preference until the user chooses a mode.
The explicit choice persists locally. Dark surfaces use lightness for elevation, not shadows.

## Typography

- Display: Manrope, weight 700, roman.
- Body: Manrope, weight 400.
- Mono: browser UI monospace, used only for technical captions and tabular figures.
- Display tracking: `-0.03em`.
- Type scale anchor: `--text-display = clamp(3rem, 8vw, 5.5rem)`.
- All data surfaces use tabular figures.

## Spacing

4-point named scale in `tokens.css`. Marketing pages use compact, varied section rhythm;
Workbench pages stay dense and task-oriented. Full-viewport heroes are not used.

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

- Primary CTA: solid thread red, pill shape, direct verb-first copy.
- Secondary CTA: quiet outline or underlined text with an arrow.

## Per-page allowances

- Marketing may use one semantic thread rule as its only enrichment.
- App pages use no enrichment; camera, garment, and chart content carry the page.
- Content pages use typography only.

## What pages MUST share

- Ariadne wordmark and thread-red placement.
- Manrope throughout, with 400/700 weight contrast for a quieter interface.
- N5 floating pill navigation and Ft2 inline minimal footer.
- Hairline dividers, pill controls, and 8 px card corners.
- Left-aligned sans-serif headings and direct product copy.

## What pages MAY differ on

- Pane ratios and density within the Workbench family.
- Whether data is expressed as tables, charts, or annotated product output.
- Marketing stage rhythm below the Marquee Hero.

## Exports

### tokens.css

`tokens.css` at the project root is the canonical, importable source.
Its `.dark` block carries the complete dark-mode token override.

### Tailwind v4 `@theme`

```css
@theme {
  --color-paper: oklch(98.5% 0.006 55);
  --color-paper-2: oklch(96.5% 0.009 55);
  --color-paper-3: oklch(93.5% 0.012 55);
  --color-ink: oklch(18% 0.018 30);
  --color-ink-2: oklch(31% 0.022 30);
  --color-rule: oklch(88% 0.012 45);
  --color-muted: oklch(47% 0.020 35);
  --color-accent: oklch(56% 0.205 25);
  --color-focus: oklch(60% 0.220 25);
  --font-display: var(--font-manrope), ui-sans-serif, sans-serif;
  --font-body: var(--font-manrope), ui-sans-serif, sans-serif;
  --spacing-md: 1rem;
  --spacing-xl: 2.5rem;
  --text-display: clamp(3rem, 8vw, 5.5rem);
  --radius-card: 0.5rem;
  --radius-pill: 999px;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### DTCG `tokens.json`

```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "color": {
    "paper": { "$value": "oklch(98.5% 0.006 55)", "$type": "color" },
    "ink": { "$value": "oklch(18% 0.018 30)", "$type": "color" },
    "accent": { "$value": "oklch(56% 0.205 25)", "$type": "color" },
    "focus": { "$value": "oklch(60% 0.220 25)", "$type": "color" }
  },
  "colorDark": {
    "paper": { "$value": "oklch(18% 0.018 30)", "$type": "color" },
    "ink": { "$value": "oklch(96.5% 0.009 55)", "$type": "color" },
    "accent": { "$value": "oklch(67% 0.185 25)", "$type": "color" },
    "focus": { "$value": "oklch(72% 0.195 25)", "$type": "color" }
  },
  "font": {
    "display": { "$value": "Manrope, sans-serif", "$type": "fontFamily" },
    "body": { "$value": "Manrope, sans-serif", "$type": "fontFamily" }
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
  --background: 98.5% 0.006 55;
  --foreground: 18% 0.018 30;
  --card: 98.5% 0.006 55;
  --card-foreground: 18% 0.018 30;
  --popover: 96.5% 0.009 55;
  --popover-foreground: 18% 0.018 30;
  --primary: 56% 0.205 25;
  --primary-foreground: 98.5% 0.006 55;
  --secondary: 96.5% 0.009 55;
  --secondary-foreground: 31% 0.022 30;
  --muted: 93.5% 0.012 55;
  --muted-foreground: 47% 0.020 35;
  --accent: 93.5% 0.012 55;
  --accent-foreground: 18% 0.018 30;
  --destructive: 54% 0.210 25;
  --destructive-foreground: 98.5% 0.006 55;
  --border: 88% 0.012 45;
  --input: 88% 0.012 45;
  --ring: 60% 0.220 25;
  --radius: 0.5rem;
}

.dark {
  --background: 18% 0.018 30;
  --foreground: 96.5% 0.009 55;
  --card: 23% 0.020 30;
  --card-foreground: 96.5% 0.009 55;
  --popover: 23% 0.020 30;
  --popover-foreground: 96.5% 0.009 55;
  --primary: 67% 0.185 25;
  --primary-foreground: 18% 0.018 30;
  --secondary: 28% 0.020 30;
  --secondary-foreground: 96.5% 0.009 55;
  --muted: 28% 0.020 30;
  --muted-foreground: 74% 0.014 50;
  --accent: 32% 0.022 30;
  --accent-foreground: 96.5% 0.009 55;
  --destructive: 63% 0.190 25;
  --destructive-foreground: 18% 0.018 30;
  --border: 36% 0.018 35;
  --input: 36% 0.018 35;
  --ring: 72% 0.195 25;
}
```
