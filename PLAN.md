# Client Portal — Compliance & Operations Dashboard

## Design Plan

### Concept: "Tactical Cartography"

An enterprise compliance portal that borrows visual language from topographic maps and military situation rooms. Data is presented as terrain to be navigated — contour-line motifs, grid overlays, coordinate-style labels, and elevation metaphors for compliance scoring. The result feels authoritative, precise, and unlike any generic dashboard.

### Audience

Security and compliance officers at client organizations who need:

* Immediate read on compliance posture (the "elevation" of their integrity)
* Awareness of recent drift/findings (terrain incidents)
* Actionable next steps (mission directives)
* Confidence that their provider is monitoring rigorously

### Aesthetic Direction

| Element          | Choice                                                        |
| ---------------- | ------------------------------------------------------------- |
| **Theme**        | Dark — charcoal/slate base (#0F1117) with subtle grid texture |
| **Primary Font** | "Instrument Sans" — geometric, engineered feel                |
| **Mono Font**    | "DM Mono" — data readouts, coordinates, scores                |
| **Accent Color** | Amber (#D4A843) — for warnings, active states, key metrics    |
| **Positive**     | Muted teal (#3ECFA0) — passing checks, healthy status         |
| **Critical**     | Signal red (#E54D4D) — critical findings, failures            |
| **Surface**      | Dark cards (#161A24) with 1px border (#252A36)                |
| **Grid Motif**   | Subtle dot-grid or contour lines in backgrounds               |
| **Motion**       | Staggered fade-in on load, subtle pulse on live indicators    |

### Layout Architecture

Single-page portal, no sidebar. Top-aligned navigation with coordinate-style breadcrumbs.
Content flows in a structured grid that breaks from typical dashboard symmetry.

***

## Wireframes

See [Client Portal — Dashboard.png](Client%20Portal%20—%20Dashboard.png) for the full wireframe, also available in Figma: [Client Portal — Wireframes](https://www.figma.com/design/lEumXcKiOJY1q7FReGQcWI)

***

## Technical Spec

### Stack

* Single HTML file with embedded CSS and vanilla JS
* Google Fonts: Instrument Sans (headings/body) + DM Mono (data/scores)
* CSS Grid for layout, CSS custom properties for theming
* CSS animations for load sequence and micro-interactions
* No external dependencies

### Sections (top to bottom)

| #  | Section             | Grid Span | Key Elements                                        |
| -- | ------------------- | --------- | --------------------------------------------------- |
| 1  | Header/Nav          | Full      | Logo, org name, live indicator, UTC clock, nav tabs |
| 2a | Compliance Score    | 7/12 col  | Animated ring, score number, trend sparkline        |
| 2b | Security Summary    | 5/12 col  | Horizontal bars, control counts, framework count    |
| 3  | Recent Findings     | Full      | Stacked finding cards with severity color coding    |
| 4a | Recommended Actions | 6/12 col  | Numbered action list with CTA buttons               |
| 4b | Framework Status    | 6/12 col  | Framework names with progress bars and dates        |
| 5  | Footer              | Full      | Version, last sync timestamp, contact link          |

### Interaction Details

* **Live clock**: Updates every second in header (UTC)
* **Score ring**: Animates from 0 to value on page load (CSS + JS)
* **Finding cards**: Hover lifts card slightly, reveals subtle glow matching severity
* **Action buttons**: Hover slides arrow right, background brightens
* **Staggered load**: Each section fades in with 100ms delay cascade
* **Dot-grid background**: CSS radial-gradient pattern on body

### Color Tokens

```CSS
--bg-base:       #0F1117
--bg-surface:    #161A24
--bg-elevated:   #1C2130
--border:        #252A36
--border-accent: #353C4D
--text-primary:  #E8ECF4
--text-secondary:#8A93A8
--text-muted:    #5A6378
--accent-amber:  #D4A843
--accent-teal:   #3ECFA0
--accent-red:    #E54D4D
--accent-blue:   #4D8BE5
```

### Responsive Behavior

* **≥1200px**: Full 12-column grid as wireframed
* **768–1199px**: Stack score + summary vertically; findings full-width; actions + frameworks stack
* **<768px**: Single column, all sections stack; score ring scales down; nav collapses to hamburger

### Loading States

The page fetches all data in a single API call. While loading, each section shows a skeleton placeholder that matches the shape of its final content. Skeletons use `--bg-elevated` (#1C2130) with a shimmer animation (a horizontal gradient sweep from left to right, repeating every 1.5s).

| Section             | Skeleton Shape                                                                  |
| ------------------- | ------------------------------------------------------------------------------- |
| Header              | Rendered immediately with static elements (logo, nav). Org name shows skeleton. |
| ComplianceElevation | Empty ring outline (no arc fill, no score number). Two rectangular bars below.  |
| SecuritySummary     | Three horizontal skeleton bars at posture bar positions. Three stat row bars.   |
| RecentFindings      | 4 stacked skeleton cards matching card height (88px) with rounded corners.      |
| RecommendedActions  | 4 skeleton rows with a short bar (number) and longer bar (title).               |
| FrameworkStatus     | 5 skeleton rows with a bar (name) and a progress bar shape.                     |
| Footer              | Rendered immediately. Sync timestamp shows skeleton until data loads.           |

Skeleton shimmer keyframe:

```CSS
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, var(--bg-elevated) 25%, var(--border-accent) 50%, var(--bg-elevated) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;
}
```

The staggered fade-in animation triggers after data arrives, not during skeleton display.

### Empty States

When the API returns successfully but a section has no items, show a contextual empty message inside the section container. The message uses `--text-muted` color and is vertically centered within the card.

| Section             | Condition                    | Empty Message                         | Icon                         |
| ------------------- | ---------------------------- | ------------------------------------- | ---------------------------- |
| ComplianceElevation | `compliance.score` is `null` | "No assessment data available yet"    | Ring outline with "—" inside |
| SecuritySummary     | All posture ratios are `0`   | "No controls have been evaluated"     | —                            |
| RecentFindings      | `findings.items` is `[]`     | "No findings detected — looking good" | Muted checkmark icon         |
| RecommendedActions  | `actions` is `[]`            | "No actions required at this time"    | —                            |
| FrameworkStatus     | `frameworks` is `[]`         | "No frameworks configured"            | —                            |

For RecentFindings, the empty state replaces the card stack and ViewAllLink. The container height collapses to a minimum of `160px` to avoid layout shift.

The "looking good" message for zero findings uses `--accent-teal` instead of muted, as it reflects a positive state.

### Error States

Errors fall into two categories: full-page (API unreachable) and partial (malformed section data).

**Full-page error** — If the `GET /api/v1/portal/dashboard` call fails (network error, 5xx, timeout after 10s):

* Header renders with static elements (logo, nav, clock still ticking)
* The entire main content area is replaced by a centered error block:
  * Icon: amber warning triangle
  * Heading: "Unable to load dashboard" (`--text-primary`, 18px)
  * Detail: "Connection to the server failed. Your data may still be syncing." (`--text-secondary`, 14px)
  * Action: "Retry" button (amber outline, same style as action CTAs). On click, re-fetches the API
  * Below button: "If this persists, contact ops" (`--text-muted`, 12px)
* No skeleton shimmer — the error block appears immediately after timeout/failure

**Partial error** — If a specific section's data is malformed or missing a required field while the rest of the payload is valid:

* The affected section shows an inline error bar at the top of its card:
  * Thin amber left border (same pattern as finding cards)
  * Message: "This section could not be loaded" (`--text-secondary`, 12px)
  * The section container remains at its skeleton height to prevent layout shift
* All other sections render normally

**Retry behavior:**

* Full-page retry: single click re-fetches. Button shows a spinner (CSS-only rotating border) during the request. No automatic retries.
* No partial retry — partial errors persist until the next full page load.

**HTTP status handling:**

| Status                  | Behavior                                                                                                                |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 200                     | Render normally                                                                                                         |
| 401                     | Redirect to login page                                                                                                  |
| 403                     | Full-page error: "You do not have access to this portal" with no retry button                                           |
| 404                     | Full-page error: "Portal not found" — org may not be provisioned                                                        |
| 429                     | Full-page error with message "Too many requests — please wait a moment" and auto-retry after `Retry-After` header value |
| 5xx                     | Full-page error with retry button                                                                                       |
| Network error / timeout | Full-page error with retry button                                                                                       |

