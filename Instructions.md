# Instructions&#x20;

## Overview

Build a single-page client portal dashboard that displays compliance and operational data for enterprise clients. Reference Files:

| File                                                              | What it contains                                                                            |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `PLAN.md`                                                         | Design concept, aesthetic direction, color tokens, layout grid, responsive breakpoints      |
| `technical_note.md`                                               | Component hierarchy, API data contract, data-to-component mapping, severity/threshold logic |
| `Client Portal — Dashboard.png`                                   | Visual wireframe of the final layout                                                        |
| [Figma file](https://www.figma.com/design/lEumXcKiOJY1q7FReGQcWI) | Interactive wireframe with exact spacing and colors                                         |

## Implementation Steps

### 1. Scaffold the HTML

Create a single `index.html` file. Load fonts from Google Fonts:

* **Instrument Sans** (400, 500, 700) for headings and body text
* **DM Mono** (400, 500) for scores, data readouts, and timestamps

Define all CSS custom properties from the color token list in `PLAN.md` under `:root`.

### 2. Build the Layout Grid

Use CSS Grid with a 12-column layout at `≥1200px`. The page has no sidebar — content is centered with `48px` horizontal padding.

Sections stack vertically:

1. **Header** — full width
2. **ComplianceElevation** (7 cols) + **SecuritySummary** (5 cols) — side by side
3. **RecentFindings** — full width (12 cols)
4. **RecommendedActions** (6 cols) + **FrameworkStatus** (6 cols) — side by side
5. **Footer** — full width

Gap between columns: `24px`. Gap between rows: `28px`.

### 3. Implement Each Section

Follow the component hierarchy in `technical_note.md`. For each section:

**Header** — Dark surface bar. Left: amber logo square + org name in mono font. Right: pulsing green live dot, UTC clock updating every second via `setInterval`. Navigation tabs below with an amber underline on the active tab. Profile avatar circle at far right.

**ComplianceElevation** — SVG score ring with three concentric dashed contour rings at thresholds 60, 75, 90. The main score arc fills proportionally (`score / maxScore * 360deg`), animated from 0 on page load. Large score number centered inside. To the right of the ring: trend delta value (teal if positive, red if negative), a 14-bar sparkline chart (last 2 bars in amber), and a threshold legend.

**SecuritySummary** — Three horizontal posture bars (pass=teal, warn=amber, fail=red) with percentage labels. Below: a stats box with three rows showing bold numeric values (controls evaluated, frameworks active, pending reviews).

**RecentFindings** — Stacked cards inside a surface container. Each card has a colored left stripe and severity badge (CRIT=red, WARN=amber, INFO=muted). Display finding ID, title, relative timestamp, and framework/asset tags as pills. Include a "View All {total} Findings" link at the bottom.

**RecommendedActions** — Numbered list (01, 02, ...) with action title, context line prefixed with "↳", and an amber-outlined CTA button per item. Subtle separators between items.

**FrameworkStatus** — List of frameworks each showing: name, color-coded percentage (teal ≥80, amber ≥60, red <60), an 8-segment progress bar, and "Last: YYYY-MM-DD" date.

**Footer** — Surface bar with portal version, last sync ISO timestamp, and "Contact Ops" link in amber.

### 4. Wire Up Data

Fetch from `GET /api/v1/portal/dashboard` on page load. See `technical_note.md` for the full JSON schema and the data-to-component mapping table.

For the initial build, embed the sample data directly in a `<script>` block to develop against. The sample payload structure is documented in the Data Contract section of `technical_note.md`.

Relative timestamps (e.g., "2h ago") should be computed client-side from `detectedAt` fields.

### 5. Add Animations

* **Staggered load**: Each major section fades in with a `100ms` cascading delay using CSS `animation-delay`
* **Score ring**: Arc stroke animates from 0 to final value over \~1.2s with ease-out
* **Live indicator**: Green dot pulses with a CSS keyframe animation
* **Finding cards**: On hover, `translateY(-2px)` with a subtle box-shadow glow matching the severity color
* **CTA buttons**: On hover, arrow character shifts right, background lightens

### 6. Responsive Breakpoints

| Breakpoint   | Layout Change                                                                             |
| ------------ | ----------------------------------------------------------------------------------------- |
| `≥1200px`    | Full 12-column grid as designed                                                           |
| `768–1199px` | Score + Summary stack vertically (full width each). Actions + Frameworks stack vertically |
| `<768px`     | Single column. Score ring scales down. Nav tabs collapse to a hamburger menu              |



