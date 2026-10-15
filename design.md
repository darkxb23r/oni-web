# ONI Web: design system ("Menu Blue")

The web console looks different from the terminal and Tauri apps on purpose. It borrows from a Halo-style game HUD: dark
steel-blue glass panels, condensed display type, angled corners and a menu-blue glow.

- **Genre:** atmospheric
- **Theme:** custom "Menu Blue"

## Tokens

The tokens are OKLCH and live in `frontend/src/theme.css` `:root`. `frontend/src/art/palette.ts` holds hex mirrors of
them, because canvas art and `blend()` do their maths on hex. If you change a token, change both files.

| Token | Value | Use |
|---|---|---|
| `--color-ink` | oklch(0.15 0.035 258) | page background |
| `--color-surface` | oklch(0.19 0.045 255) | chrome bars, title tags |
| `--color-panel` / `--color-panel-2` | oklch(0.23 0.055 252) / (0.29 0.065 250) | panels, raised fills |
| `--color-accent` | oklch(0.74 0.15 240) | menu blue: frames, active state, primary buttons |
| `--color-holo` | oklch(0.88 0.08 220) | pale holo: wordmark, focus frames |
| `--color-text` / `--color-muted` / `--color-dim` | 0.95 / 0.74 / 0.55 L | type hierarchy |
| `--color-danger` / `--color-ok` / `--color-warn` / `--color-gold` | red / green / amber / gold | status only |

Upstream variable names (`--amber`, `--cyan`, `--red` and so on) are kept as aliases, so the components didn't need to
change. `--amber` now resolves to the accent and `--cyan` to holo.

## Type

These are the only three fonts, all self-hosted through `@fontsource`.

- **Display:** Saira Condensed 600/700, uppercase. Used for tabs, panel titles, buttons, table headers and headings.
- **Body:** Barlow 400/500/600, with tabular numbers.
- **Mono:** JetBrains Mono, only for terminal output: `.log`, `pre`, `.boot`, `.setup-progress` and the footer key chips.
- **No italics anywhere.** Carry emphasis with weight or accent colour.

## Motifs

- **Corner brackets:** panels, dialogs and login/setup cards get eight `linear-gradient` background layers drawn in
  `--b`. That is accent by default, holo on `:focus-within` and danger on `.dialog.danger`.
- **Chamfer:** buttons and chips use `clip-path: var(--chamfer)`. Because clip-path clips outlines, focus is an inset
  box-shadow instead.
- **Title tags:** panel titles sit on the top edge as an angled tag with a 3px accent bar.
- **Backdrop:** a radial accent glow over a faint, drifting 48px grid.

## Motion

The HUD is alive but never busy. All motion is CSS, with no motion library.

- **Ambient:** the backdrop grid drifts, a faint scan line passes every 9s, and the login and landing screens have a
  slow aurora. A light runs along the toolbar edge and the gateway dot breathes.
- **Shine:** one shared sheen (a diagonal highlight that is moved with `transform`) runs across panel titles, the primary
  button, the condition chip, the masthead and toasts. Gradient text glints on the wordmark and the landing title.
- **Lock-on:** bracket length is the animatable `@property --bk`. Panels boot in by flickering on while their brackets
  close from wide to 14px. They grow on hover, and dialogs and landing cards lock on the same way.
- **Feedback:** the active tab underline glows, buttons lift 1px and sweep on hover, and toasts spring in.
- **Rules:** loop only `transform`, `opacity`, `filter` or small areas. Entrances use `backwards` fill and play once on
  mount, never on data updates. `prefers-reduced-motion` zeroes every duration and delay, and the sheens sit
  off-element when they are not moving.

## Fixed

- **Tab names:** keep the ONI names (ASSETS, INTERCEPTS, OPERATIONS, BLACKLIST, CONSOLE, FORGE, HEALTH).
- **Layout constants:** don't change these (`--row`, the 82px server card with `contain: strict`, face sizing). Re-skin
  around them.
- **Canvas art:** the Superintendent face and crest keep their own colours.
