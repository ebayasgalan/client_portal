# Component Hierarchy & Data Contract

## Component Hierarchy

```
DashboardPage
├── Header
│   ├── LogoMark
│   ├── OrgIdentity              
│   ├── LiveIndicator            
│   ├── UtcClock                 
│   ├── NavTabs                  
│   │   └── NavTab (×4)         
│   └── ProfileAvatar            
│
├── main (CSS Grid: 12-col)
│   │
│   ├── ComplianceElevation      
│   │   ├── SectionLabel         
│   │   ├── ScoreRing            
│   │   │   ├── ContourRing (×3) 
│   │   │   ├── ScoreArc         
│   │   │   └── ScoreValue       
│   │   ├── TrendDelta           
│   │   ├── Sparkline            
│   │   └── ThresholdLegend      
│   │
│   ├── SecuritySummary          
│   │   ├── SectionLabel         
│   │   ├── PostureBreakdown
│   │   │   └── PostureBar (×3)  
│   │   └── StatsBox
│   │       └── StatRow (×3)     
│   │
│   ├── RecentFindings           
│   │   ├── SectionLabel         
│   │   ├── FindingCard (×n)
│   │   │   ├── SeverityBadge    
│   │   │   ├── FindingId        
│   │   │   ├── Timestamp        
│   │   │   ├── Description      
│   │   │   └── TagRow
│   │   │       ├── FrameworkTag 
│   │   │       └── AssetTag    
│   │   └── ViewAllLink          
│   │
│   ├── RecommendedActions       
│   │   ├── SectionLabel         
│   │   └── ActionItem (×n)
│   │       ├── ActionNumber     
│   │       ├── ActionTitle      
│   │       ├── ActionContext    
│   │       └── ActionCta        
│   │
│   └── FrameworkStatus          
│       ├── SectionLabel         
│       └── FrameworkRow (×n)
│           ├── FrameworkName    
│           ├── FrameworkPct      
│           ├── SegmentedBar    
│           └── LastAssessed     
│
└── Footer
    ├── VersionLabel             
    ├── SyncTimestamp          
    └── ContactLink             
```

***

## Data Contract

All data is supplied as a single JSON payload from the API. The page fetches once on load; the UTC clock is client-side only.

### `GET /api/v1/portal/dashboard`

```jsonc
{
  // --- Organization context ---
  "org": {
    "id": "org_a1b2c3",
    "name": "ACME CORP",
    "sector": "SECTOR 7G",
    "logoUrl": "/assets/logos/acme.svg"      // optional, falls back to LogoMark
  },

  // --- Authenticated user ---
  "user": {
    "id": "usr_x9y8z7",
    "displayName": "Jane Chen",
    "avatarUrl": "/assets/avatars/jchen.jpg", // optional, falls back to initials
    "initials": "JC"
  },

  // --- Compliance score ---
  "compliance": {
    "score": 87,                              // 0–100 integer
    "maxScore": 100,
    "delta": 2.4,                             // signed float vs. previous assessment
    "trend": [42, 48, 48, 55, 55, 63, 63, 71, 71, 79, 79, 79, 85, 87],
                                              // monthly scores, oldest → newest
    "assessedAt": "2026-03-20T09:30:00Z"      // ISO 8601
  },

  // --- Security posture ---
  "posture": {
    "pass": 0.84,                             // 0.0–1.0 ratios (must sum to 1.0)
    "warn": 0.12,
    "fail": 0.04,
    "controlsEvaluated": 247,
    "frameworksActive": 12,
    "pendingReviews": 3
  },

  // --- Findings ---
  "findings": {
    "total": 23,
    "items": [
      {
        "id": "IAM-0042",
        "severity": "critical",               // "critical" | "warning" | "info"
        "title": "Privilege escalation path in prod role binding",
        "framework": "SOC2-CC6.1",
        "asset": "iam-prod-admin",
        "detectedAt": "2026-03-25T10:44:00Z"  // ISO 8601, rendered as relative
      }
      // ... additional items
    ]
  },

  // --- Recommended actions ---
  "actions": [
    {
      "id": "act_001",
      "title": "Remediate IAM escalation path",
      "context": "Blocks 3 other findings",
      "ctaLabel": "Begin Remediation",
      "ctaHref": "/remediation/IAM-0042",
      "relatedFindingIds": ["IAM-0042"]       // links action back to findings
    }
    // ... additional items
  ],

  // --- Framework compliance status ---
  "frameworks": [
    {
      "id": "fw_soc2",
      "name": "SOC 2 Type II",
      "compliancePct": 87,                    // 0–100 integer
      "lastAssessedAt": "2026-02-14"          // ISO 8601 date (no time)
    }
    // ... additional items
  ],

  // --- Portal metadata ---
  "meta": {
    "portalVersion": "2.4.1",
    "lastSyncAt": "2026-03-25T12:44:00Z"      // ISO 8601
  }
}
```

***

## Data → Component Mapping

| Component         | Data Source                       | Render Notes                                                                  |
| ----------------- | --------------------------------- | ----------------------------------------------------------------------------- |
| `OrgIdentity`     | `org.name`, `org.sector`          | Concatenated with em-dash separator                                           |
| `LogoMark`        | `org.logoUrl`                     | Falls back to amber square if missing                                         |
| `ProfileAvatar`   | `user.avatarUrl`, `user.initials` | Image if URL present, else initials on dark circle                            |
| `ScoreRing`       | `compliance.score`, `.maxScore`   | Arc length = `score / maxScore * 360deg`. Animate on load                     |
| `TrendDelta`      | `compliance.delta`                | Prefix `+` if positive. Green if > 0, red if < 0                              |
| `Sparkline`       | `compliance.trend[]`              | Bar heights normalized to array max. Last 2 bars amber accent                 |
| `ContourRing`     | (static)                          | Fixed at thresholds 60, 75, 90. Decorative only                               |
| `ThresholdLegend` | (static)                          | Color-coded: teal/amber/red for 90/75/60                                      |
| `PostureBar`      | `posture.pass/warn/fail`          | Width = ratio \* bar container width. Colors: teal/amber/red                  |
| `StatRow`         | `posture.controlsEvaluated`, etc. | Bold value + secondary label                                                  |
| `FindingCard`     | `findings.items[i]`               | Left border + badge color from severity map                                   |
| `SeverityBadge`   | `findings.items[i].severity`      | `critical→red`, `warning→amber`, `info→muted`                                 |
| `Timestamp`       | `findings.items[i].detectedAt`    | Relative time: "2h ago", "1d ago" via `Intl.RelativeTimeFormat` or delta calc |
| `FrameworkTag`    | `findings.items[i].framework`     | Pill with "Framework: " prefix                                                |
| `AssetTag`        | `findings.items[i].asset`         | Pill with "Asset: " prefix. Truncate with ellipsis if > 16ch                  |
| `ViewAllLink`     | `findings.total`                  | "View All {total} Findings →"                                                 |
| `ActionItem`      | `actions[i]`                      | Number = zero-padded index+1                                                  |
| `ActionCta`       | `actions[i].ctaLabel`, `.ctaHref` | Button text = `{ctaLabel} →`, navigates to `ctaHref`                          |
| `FrameworkRow`    | `frameworks[i]`                   | Bar segments: 8 segments, filled = `floor(pct/12.5)`                          |
| `FrameworkPct`    | `frameworks[i].compliancePct`     | Color: teal if ≥ 80, amber if ≥ 60, red if < 60                               |
| `LastAssessed`    | `frameworks[i].lastAssessedAt`    | Rendered as "Last: YYYY-MM-DD"                                                |
| `VersionLabel`    | `meta.portalVersion`              | "Portal v{version}"                                                           |
| `SyncTimestamp`   | `meta.lastSyncAt`                 | "Last sync: {iso8601}"                                                        |
| `UtcClock`        | (client-side)                     | `setInterval` every 1s, `toUTCString()` formatted HH:MM UTC                   |
| `LiveIndicator`   | (client-side)                     | Always shown. CSS pulse animation on the dot                                  |

***

## Severity Color Map

Used by `FindingCard`, `SeverityBadge`, and the left stripe:

| Severity   | Badge Text | Badge BG (15% opacity) | Stripe / Text Color | CSS Token        |
| ---------- | ---------- | ---------------------- | ------------------- | ---------------- |
| `critical` | CRIT       | `#E54D4D26`            | `#E54D4D`           | `--accent-red`   |
| `warning`  | WARN       | `#D4A84326`            | `#D4A843`           | `--accent-amber` |
| `info`     | INFO       | `#5A637826`            | `#5A6378`           | `--text-muted`   |

***

## Threshold Logic

| Score Range | Label     | Ring Color       | Delta Color |
| ----------- | --------- | ---------------- | ----------- |
| 90–100      | Excellent | `--accent-teal`  | —           |
| 75–89       | Adequate  | `--accent-amber` | —           |
| 0–74        | At Risk   | `--accent-red`   | —           |

Delta color is independent: positive = teal, negative = red, zero = muted.

***

## Testing Strategy

Tests inject crafted payloads into the render function and assert DOM output. Use DevTools network throttling for loading/error states.

### Visual & Layout

| Test             | Pass Criteria                                                  |
| ---------------- | -------------------------------------------------------------- |
| 1440px viewport  | 12-col grid intact, no horizontal scroll                       |
| 1024px viewport  | Score/Summary and Actions/Frameworks stack vertically          |
| 375px viewport   | Single column, hamburger nav, scaled-down score ring           |
| Skeleton loading | Throttle to Slow 3G — shimmer bars visible before data arrives |
| Fonts            | Headings use Instrument Sans, data readouts use DM Mono        |
| Color tokens     | Computed styles match token values from PLAN.md                |

### Data Binding

| Component           | Input                                   | Expected                                  |
| ------------------- | --------------------------------------- | ----------------------------------------- |
| OrgIdentity         | `name: "ACME", sector: "7G"`            | Text "ACME — 7G"                          |
| LogoMark            | `logoUrl: null`                         | Amber square fallback, no `<img>`         |
| ProfileAvatar       | `avatarUrl: null, initials: "JC"`       | Text "JC" on dark circle                  |
| ScoreRing (50%)     | `score: 50, maxScore: 100`              | Arc at 50% circumference                  |
| ScoreRing (0%)      | `score: 0`                              | Arc not visible                           |
| ScoreRing (100%)    | `score: 100`                            | Full circle                               |
| Ring color          | `score: 95 / 80 / 55`                   | Teal / amber / red respectively           |
| TrendDelta (+)      | `delta: 2.4`                            | Text "+2.4" in teal                       |
| TrendDelta (-)      | `delta: -3.1`                           | Text "-3.1" in red                        |
| TrendDelta (0)      | `delta: 0`                              | Text "0" in muted                         |
| Sparkline           | `trend: [25, 50, 100]`                  | 3 bars, heights normalized, last 2 amber  |
| PostureBar widths   | `pass: 0.84, warn: 0.12, fail: 0.04`    | Bars at 84%/12%/4% of container           |
| StatRow             | `controlsEvaluated: 247`                | Bold "247" + label                        |
| SeverityBadge       | `severity: "critical"`                  | Badge "CRIT", red stripe + BG             |
| SeverityBadge       | `severity: "warning"`                   | Badge "WARN", amber stripe + BG           |
| SeverityBadge       | `severity: "info"`                      | Badge "INFO", muted stripe + BG           |
| Timestamp           | `detectedAt: 2h ago`                    | Text "2h ago"                             |
| AssetTag truncation | `asset: "very-long-resource-name-here"` | Ellipsis at 16 characters                 |
| ViewAllLink         | `findings.total: 23`                    | Text "View All 23 Findings →"             |
| ActionNumber        | 4 actions                               | Numbers "01"–"04"                         |
| ActionCta           | `ctaLabel: "Begin Remediation"`         | Button text "Begin Remediation →"         |
| FrameworkPct color  | `compliancePct: 87 / 68 / 55`           | Teal / amber / red                        |
| SegmentedBar        | `compliancePct: 87`                     | 6 of 8 segments filled (`floor(87/12.5)`) |
| LastAssessed        | `lastAssessedAt: "2026-02-14"`          | Text "Last: 2026-02-14"                   |
| VersionLabel        | `portalVersion: "2.4.1"`                | Text "Portal v2.4.1"                      |

### State Transitions

| Transition             | Trigger                          | Expected                                        |
| ---------------------- | -------------------------------- | ----------------------------------------------- |
| Loading → Loaded       | Normal fetch                     | Skeletons replaced, staggered fade-in plays     |
| Loading → Error (5xx)  | Mock 500                         | Error block with Retry button                   |
| Loading → Error (403)  | Mock 403                         | "You do not have access", no Retry              |
| Loading → Error (401)  | Mock 401                         | Redirect to login                               |
| Loading → Error (429)  | Mock 429 + `Retry-After: 5`      | Auto-retries after 5s                           |
| Error → Retry → Loaded | Click Retry, next fetch succeeds | Spinner then content renders                    |
| Partial error          | `compliance: null`, rest valid   | Inline error bar on that section, others render |
| Empty findings         | `findings.items: []`             | "No findings detected — looking good" in teal   |
| Empty actions          | `actions: []`                    | "No actions required at this time"              |
| Empty frameworks       | `frameworks: []`                 | "No frameworks configured"                      |
| Clock ticks            | Wait 3s                          | UtcClock updates each second                    |

### Edge Cases

| Input                                | Expected                                    |
| ------------------------------------ | ------------------------------------------- |
| Very long org name                   | Truncates with ellipsis, header intact      |
| `score: 90` (boundary)               | Ring uses teal                              |
| `score: 75` (boundary)               | Ring uses amber                             |
| `compliancePct: 80` (boundary)       | Teal                                        |
| `compliancePct: 60` (boundary)       | Amber                                       |
| `compliancePct: 59` (boundary)       | Red                                         |
| Single-item trend array              | One bar at full height                      |
| 20+ actions                          | Correct numbering 01–20, section scrollable |
| `title: "<script>alert(1)</script>"` | Escaped text, no XSS                        |
| Posture ratios sum to < 1.0          | Bars render proportionally, no error        |

