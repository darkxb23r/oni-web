# ONI Web: design system ("Graphite")

The web console is the admin remote: a calm operations workbench you leave open on a second monitor. It looks
deliberately unlike the Tauri app's amber terminal. It uses neutral graphite surfaces, one solid violet signal colour,
and status colours only where they mean something. It should read like a modern ops tool, not a game menu.

- **Genre:** modern-minimal
- **Macrostructure:** workbench (fleet rail · station header · tabs · panes · status bar)
- **Theme:** custom "Graphite"

## Tokens

The tokens are OKLCH and live in `frontend/src/theme.css` `:root`. `frontend/src/art/palette.ts` holds hex mirrors
of them, because components colour text inline and canvas art and `blend()` do their maths on hex. If you change a
token, change both files.

| Token | Value | Use |
|---|---|---|
| `--color-ink` | oklch(0.155 0.004 270) | page background, toolbar, inputs |
| `--color-surface` | oklch(0.18 0.005 270) | fleet rail, tab bar, status bar |
| `--color-panel` / `--color-panel-2` | 0.205 / 0.245 L | panels, raised fills, buttons |
| `--color-border` / `--color-border-strong` | 0.265 / 0.32 L | hairlines, control edges |
| `--color-border-input` | oklch(0.51 0.01 270) | form-field edges (3:1 against ink and panel) |
| `--color-accent` / `--color-accent-hover` | oklch(0.72 0.15 290) / (0.78 0.13 290) | the violet signal: selection, primary, active tab |
| `--color-accent-ink` | oklch(0.17 0.04 290) | text on accent, danger, ok and warn fills |
| `--color-accent-tint` | accent at 14% | selected rows, selected server card, demo callout |
| `--color-holo` | oklch(0.87 0.06 290) | pale violet: highlights in art and readouts |
| `--color-text` / `--color-muted` / `--color-dim` | 0.95 / 0.76 / 0.63 L | type hierarchy |
| `--color-danger` / `--color-danger-text` / `--color-ok` / `--color-warn` / `--color-gold` | red / soft red / green / amber / gold | status only |

The contrast figures are in the `theme.css` stamp. Body text is at least 4.5:1, dim is 4.6:1 on panel-2, and UI
edges are at least 3:1.

The upstream variable names (`--amber`, `--cyan`, `--red` and so on) are kept as aliases, so the components didn't
need to change. `--amber` now resolves to the violet accent and `--cyan` to holo.

Spacing is on a 4pt scale (`--space-1` to `--space-12`). The radii are 4 / 6 / 8 / 10 / 12 and pill. Controls are
28px tall in the console and 32–40px in the header and setup.

## Type

These are the only two families, both self-hosted through `@fontsource`.

- **Interface:** Geist Variable, with tabular numbers. It is used for everything that isn't a readout: headings
  (600, slightly negative tracking), tabs (sentence case), body and buttons (600, uppercase, .05em tracking).
- **Readouts:** JetBrains Mono 400. It is used for terminal output (`.log`, `pre`, `.boot`), key caps, panel sub-tags,
  eyebrows, status chips and the gateway pill.
- **No italics anywhere.** Carry emphasis with weight or accent colour.

## Components

- **Toolbar (52px):** an accent ▲ mark, "ONI RCON", the product line, the gateway status pill and sign-out.
- **Masthead KPI strip (44px):** a condition pill (green / amber / red, where red blinks its dot), Stations n/total,
  Assets, Findings (only when there are some), a TOP SECRET tag, the operator and the clock.
- **Station header (56px):** the station name and status chip, a command-palette trigger (it collapses to ⌕ below
  1050px), SERVER PROFILES (ghost) and DISCONNECT (danger tint; it becomes a ⏻ icon below 400px).
- **Tabs:** underline tabs with the F-key in a mono cap. The underline grows by `scaleX`.
- **Panels:** flat panel fill with a hairline border and radius 10. The title sits top-left with a mono accent
  sub-tag. There are no nested cards, side stripes or gradients.
- **Buttons:** primary (accent fill), danger, error, warning, success, ghost. All 8 states are styled. Disabled is
  .55 opacity with `not-allowed`, and loading is `aria-busy` with a ring spinner.
- **Inputs:** an ink fill, the `--color-border-input` edge, and an accent focus ring. `.missing` uses a danger edge.

## Motion

Quiet and quick. Animate only transform and opacity. All motion is CSS, with no motion library.

- **Entrances:** a pane rises 6px over 180ms, dialogs rise over 180ms over a 120ms scrim fade, and toasts rise 8px.
  They play once on mount, never on data updates.
- **Status loops (the only ones):** the red condition dot, the `.card.pulse` overlay on a server that needs
  attention, the `.spin` and `aria-busy` spinners, and the `.beat` tick.
- **Feedback:** hover changes colour only. Pressing a control nudges it 1px down.
- **Rules:** `prefers-reduced-motion` turns off every animation and transition.

## Responsive

The layout is verified at 1440, 1280, 768, 414, 375 and 320 with no horizontal scroll (`overflow-x: clip` on html
and body).

- **≤1050:** the fleet rail is 240px, the F-key caps and TOP SECRET hide, and the palette trigger becomes an icon.
- **≤760:** the rail is 168px. The brand subline, the gateway text, Operator, the clock, Assets, SERVER PROFILES and
  the station chip all hide. Split panes stack.
- **≤400:** the rail is 136px, DISCONNECT becomes an icon, the Findings label hides, and the status bar keeps two hints
  plus the palette.

## Fixed

- **Tab names:** keep the ONI names (Assets, Intercepts, Operations, Blacklist, Console, Forge, Health) and the F1–F7
  keys.
- **Layout constants:** don't change these (`--row`, the 82px server card with `contain: strict`, face sizing).
  Re-skin around them.
- **Canvas art:** the Superintendent face, the crest and the archive intro keep their own colours.
