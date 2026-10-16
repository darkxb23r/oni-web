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

Spacing is on a 4pt scale (`--space-1` to `--space-12`). The radii are 4 / 6 / 8 / 10 / 12, and pill only for the scrollbar thumb. Controls are
28px tall in the console and 32–40px in the header and setup.

## Type

These are the only two families, both self-hosted through `@fontsource`.

- **Interface:** Geist Variable, with tabular numbers. It is used for everything that isn't a readout: headings
  (600, slightly negative tracking), tabs (sentence case), body and buttons (600, uppercase, .05em tracking).
- **Readouts:** JetBrains Mono 400. It is used for terminal output (`.log`, `pre`, `.boot`), key caps, panel sub-tags,
  eyebrows, and the condition, station and gateway status readouts.
- **No italics anywhere.** Carry emphasis with weight or accent colour.

## Components

- **Toolbar (52px):** the ONI-RCON seal and wordmark (`web/Brand.tsx`, from the Claude Design "ONI-RCON Header Logo",
  in the accent and text tokens), the product line, the gateway status and sign-out. In the seal, the dial turns,
  the triangle's lit half flips and a scan line falls through it. The wordmark (display face 700, .2em tracking)
  decodes in on load and on hover, glitches one letter every 5.2s, and carries a slow shine. An accent sweep runs once
  along the bottom edge. The sign-in card shows the same seal at 44px.
- **Masthead KPI strip (44px):** the condition (green / amber / red), Stations n/total, Assets, Findings (only when there
  are some), TOP SECRET in danger red, the operator and the clock.
- **Station header (56px):** the station name and its status, a command-palette trigger (it collapses to ⌕ below
  1050px), SERVER PROFILES (ghost) and DISCONNECT (danger tint; it becomes a ⏻ icon below 400px).
- **No pills or badges:** status is coloured mono text, never a capsule, a tinted fill, a border or a dot. Toasts
  colour their title instead of carrying a dot. Key caps (the F-keys and `kbd` hints) are the only boxed labels.
- **Tabs:** underline tabs with the F-key in a mono cap. The underline grows by `scaleX`.
- **Panels:** flat panel fill with a hairline border and radius 10. The title sits top-left with a mono accent
  sub-tag. There are no nested cards, side stripes or gradients.
- **Buttons:** primary (accent fill), danger, error, warning, success, ghost. All 8 states are styled. Disabled is
  .55 opacity with `not-allowed`, and loading is `aria-busy` with a ring spinner.
- **Inputs:** an ink fill, the `--color-border-input` edge, and an accent focus ring. `.missing` uses a danger edge.

## Background

Behind everything sits a live terrain: the Topography component from React Bits (`frontend/src/web/Topography.tsx`,
vendored as is). It draws contour lines in Halo menu blue, `--color-terrain` oklch(0.796 0.111 245), mirrored as
`TERRAIN` in `palette.ts` because WebGL takes hex. It is mounted once in `main.tsx` inside `.backdrop`, a fixed layer
at z-index -1 with pointer events off. That puts it above the body's ink fill and below all content. The login and
setup screens leave their fill transparent so the terrain shows through.

The backdrop is the one exception to the no-glow rule and to the Motion rules below. Its bloom and slow drift belong to
that layer only. It stays in the back seat: it ignores hovering, drifts at 0.1 speed and 0.08 morph, and the only
reaction is a brief flash (brightness 1.6×, fading over about 0.25s) on clicks on controls. The flash is a local
addition, `clickEffect="flash"`. It honours `prefers-reduced-motion` on its own (no travel, no intro, no glitch) and pauses when the tab
is hidden. Never use the terrain blue in the UI layer.

Alerts mark the terrain, another local addition. `engine.ts` fires a `terrain` window event. On trouble (`alert()`, a
station LOST) one summit the UI leaves uncovered tints red. On recovery (a station back online, or acknowledging while
RED) it tints green, and if a mark is already showing it recolours that same peak. The tint fades in to 0.85 over about
1.5s, holds about 4s, then fades out over about 4s. It is a colour fade, not motion, so it plays under reduced motion too.

## Motion

Quiet and quick. Animate only transform and opacity. All motion is CSS, with no motion library.

- **Entrances:** a pane rises 6px over 180ms, dialogs rise over 180ms over a 120ms scrim fade, and toasts rise 8px.
  They play once on mount, never on data updates.
- **Status loops (the only ones):** the `.card.pulse` overlay on a server that needs
  attention, the `.spin` and `aria-busy` spinners, and the `.beat` tick. The brand seal and wordmark are the one
  decorative exception (see Toolbar), and reduced motion stills them too.
- **Feedback:** hover changes colour only. Pressing a control nudges it 1px down.
- **Rules:** `prefers-reduced-motion` turns off every animation and transition.

## Responsive

The layout is verified at 1440, 1280, 768, 414, 375 and 320 with no horizontal scroll (`overflow-x: clip` on html
and body).

- **≤1050:** the fleet rail is 240px, the F-key caps and TOP SECRET hide, and the palette trigger becomes an icon.
- **≤760:** the rail is 168px. The brand subline, Operator, the clock, Assets, SERVER PROFILES and
  the station status all hide. The brand keeps its width and the gateway status
  cuts off with an ellipsis. Split panes stack.
- **≤400:** the rail is 136px, DISCONNECT becomes an icon, the gateway status and the Findings label hide, and the status bar keeps two hints
  plus the palette.

## Fixed

- **Tab names:** keep the ONI names (Assets, Intercepts, Operations, Blacklist, Console, Forge, Health) and the F1–F7
  keys.
- **Layout constants:** don't change these (`--row`, the 82px server card with `contain: strict`, face sizing).
  Re-skin around them.
- **Canvas art:** the Superintendent face, the crest and the archive intro keep their own colours.
