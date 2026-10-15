# ONI Web: design system ("Section Three")

The web console looks different from the terminal and Tauri apps on purpose. It is meant to read as a working Office of
Naval Intelligence terminal on Reach: gunmetal panels, condensed display type, angled corners, mono readouts and
no glow. It's hardware, not a game menu.

- **Genre:** atmospheric
- **Theme:** custom "Section Three"

## Tokens

The tokens are OKLCH and live in `frontend/src/theme.css` `:root`. `frontend/src/art/palette.ts` holds hex mirrors of
them, because canvas art and `blend()` do their maths on hex. If you change a token, change both files.

| Token | Value | Use |
|---|---|---|
| `--color-ink` | oklch(0.14 0.015 250) | page background |
| `--color-surface` | oklch(0.175 0.018 250) | chrome bars, title tags |
| `--color-panel` / `--color-panel-2` | oklch(0.21 0.02 250) / (0.27 0.025 250) | panels, raised fills |
| `--color-accent` | oklch(0.76 0.1 235) | steel blue: frames, active state, primary buttons |
| `--color-holo` | oklch(0.9 0.045 220) | pale ice: wordmark, focus frames |
| `--color-text` / `--color-muted` / `--color-dim` | 0.93 / 0.71 / 0.53 L | type hierarchy |
| `--color-danger` / `--color-ok` / `--color-warn` / `--color-gold` | red / green / amber / gold | status only |

Upstream variable names (`--amber`, `--cyan`, `--red` and so on) are kept as aliases, so the components didn't need to
change. `--amber` now resolves to the accent and `--cyan` to ice.

## Type

These are the only three fonts, all self-hosted through `@fontsource`.

- **Display:** Saira Condensed 600/700, uppercase. Used for tabs, panel titles, buttons and headings.
- **Body:** Barlow 400/500/600, with tabular numbers.
- **Mono:** JetBrains Mono 400. Used for terminal output (`.log`, `pre`, `.boot`, `.setup-progress`, the footer key
  chips) and for every label and readout: table headers, fact keys, field labels, panel sub-tags, the masthead, the
  toolbar and the eyebrows. Uppercase, 11–12px, about .06–.08em tracking.
- **No italics anywhere.** Carry emphasis with weight or accent colour.

## Motifs

- **Corner brackets:** panels, dialogs and login/setup cards get eight `linear-gradient` background layers drawn in
  `--b`. That is accent by default, ice on `:focus-within` and danger on `.dialog.danger`. They are static at `--bk`
  (14px on panels, 18px on cards).
- **Chamfer:** buttons and chips use `clip-path: var(--chamfer)`. Because clip-path clips outlines, focus is an inset
  box-shadow instead.
- **Title tags:** panel titles sit on the top edge as an angled tag with a 3px accent bar.
- **Backdrop:** a static, faint 48px grid over a flat gunmetal gradient.
- **No glow:** no `text-shadow`, glow `box-shadow`, `drop-shadow` or backdrop blur. Depth comes only from the dark drop
  shadow under dialogs and toasts.

## Motion

Short and mechanical, like a screen redraw. Nothing loops except status. All motion is CSS, with no motion library.

- **Entrances:** a pane slides 8px in over .14s, a panel draws in top-down with a .18s linear clip, dialogs rise over
  .16s and toasts slide 16px in over .16s. They play once on mount, never on data updates.
- **Status loops (the only ones):** the blinking block cursor after the login and landing titles, the `.spin` busy
  glyph, the `.beat` tick and the red `.card.pulse` on a server that needs attention.
- **Feedback:** hover changes background colour only (.1s). No lifts, sheens, scan lines or drifting layers.
- **Rules:** `prefers-reduced-motion` zeroes every duration and delay.

## Fixed

- **Tab names:** keep the ONI names (ASSETS, INTERCEPTS, OPERATIONS, BLACKLIST, CONSOLE, FORGE, HEALTH).
- **Layout constants:** don't change these (`--row`, the 82px server card with `contain: strict`, face sizing). Re-skin
  around them.
- **Canvas art:** the Superintendent face and crest keep their own colours.
