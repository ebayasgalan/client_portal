import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import App from "../App";
import { mockDashboard } from "../data/mockData";
import { relativeTime, truncate, getScoreColor, getDeltaColor, getPctColor, formatDelta, severityMap } from "../utils";

// Deep-clone helper
const clone = (obj) => JSON.parse(JSON.stringify(obj));

// ── Utility tests ──────────────────────────────────────────────

describe("utils", () => {
  describe("getScoreColor", () => {
    it("returns teal for score >= 90", () => {
      expect(getScoreColor(90)).toBe("var(--accent-teal)");
      expect(getScoreColor(100)).toBe("var(--accent-teal)");
    });
    it("returns amber for score 75–89", () => {
      expect(getScoreColor(75)).toBe("var(--accent-amber)");
      expect(getScoreColor(89)).toBe("var(--accent-amber)");
    });
    it("returns red for score < 75", () => {
      expect(getScoreColor(74)).toBe("var(--accent-red)");
      expect(getScoreColor(0)).toBe("var(--accent-red)");
    });
  });

  describe("getDeltaColor", () => {
    it("returns teal for positive", () => expect(getDeltaColor(2.4)).toBe("var(--accent-teal)"));
    it("returns red for negative", () => expect(getDeltaColor(-3.1)).toBe("var(--accent-red)"));
    it("returns muted for zero", () => expect(getDeltaColor(0)).toBe("var(--text-muted)"));
  });

  describe("formatDelta", () => {
    it("prefixes + for positive", () => expect(formatDelta(2.4)).toBe("+2.4"));
    it("shows - for negative", () => expect(formatDelta(-3.1)).toBe("-3.1"));
    it("shows 0 for zero", () => expect(formatDelta(0)).toBe("0"));
  });

  describe("getPctColor", () => {
    it("returns teal for >= 80", () => expect(getPctColor(80)).toBe("var(--accent-teal)"));
    it("returns amber for 60–79", () => expect(getPctColor(60)).toBe("var(--accent-amber)"));
    it("returns red for < 60", () => expect(getPctColor(59)).toBe("var(--accent-red)"));
  });

  describe("severityMap", () => {
    it("maps critical", () => expect(severityMap("critical").label).toBe("CRIT"));
    it("maps warning", () => expect(severityMap("warning").label).toBe("WARN"));
    it("maps info", () => expect(severityMap("info").label).toBe("INFO"));
  });

  describe("truncate", () => {
    it("returns short strings as-is", () => expect(truncate("short")).toBe("short"));
    it("truncates at 16 chars", () => {
      const long = "very-long-resource-name-here";
      expect(truncate(long)).toBe("very-long-resour…");
      expect(truncate(long).length).toBe(17); // 16 chars + ellipsis
    });
  });

  describe("relativeTime", () => {
    it("returns relative hours", () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 3600000).toISOString();
      expect(relativeTime(twoHoursAgo)).toBe("2h ago");
    });
    it("returns relative days", () => {
      const oneDayAgo = new Date(Date.now() - 86400000).toISOString();
      expect(relativeTime(oneDayAgo)).toBe("1d ago");
    });
    it("returns relative minutes", () => {
      const thirtyMinAgo = new Date(Date.now() - 30 * 60000).toISOString();
      expect(relativeTime(thirtyMinAgo)).toBe("30m ago");
    });
  });
});

// ── Header ─────────────────────────────────────────────────────

describe("Header", () => {
  it("renders org identity", () => {
    render(<App data={mockDashboard} />);
    expect(screen.getByTestId("org-identity")).toHaveTextContent("ACME CORP — SECTOR 7G");
  });

  it("shows logo fallback when logoUrl is null", () => {
    render(<App data={mockDashboard} />);
    expect(screen.getByTestId("logo-fallback")).toBeInTheDocument();
  });

  it("shows user initials when avatarUrl is null", () => {
    render(<App data={mockDashboard} />);
    expect(screen.getByTestId("profile-avatar")).toHaveTextContent("JC");
  });

  it("renders UTC clock", () => {
    render(<App data={mockDashboard} />);
    expect(screen.getByTestId("utc-clock").textContent).toMatch(/\d{2}:\d{2} UTC/);
  });

  it("renders 4 nav tabs with Dashboard active", () => {
    render(<App data={mockDashboard} />);
    const tabs = screen.getAllByRole("button").filter((b) => b.classList.contains("nav-tab"));
    expect(tabs).toHaveLength(4);
    expect(tabs[0]).toHaveClass("active");
    expect(tabs[0]).toHaveTextContent("Dashboard");
  });
});

// ── Compliance Elevation ───────────────────────────────────────

describe("ComplianceElevation", () => {
  it("displays the score value", () => {
    render(<App data={mockDashboard} />);
    expect(screen.getByTestId("score-value")).toHaveTextContent("87");
  });

  it("shows positive delta with + prefix", () => {
    render(<App data={mockDashboard} />);
    expect(screen.getByTestId("trend-delta")).toHaveTextContent("+2.4");
  });

  it("shows negative delta", () => {
    const data = clone(mockDashboard);
    data.compliance.delta = -3.1;
    render(<App data={data} />);
    expect(screen.getByTestId("trend-delta")).toHaveTextContent("-3.1");
  });

  it("renders correct number of sparkline bars", () => {
    render(<App data={mockDashboard} />);
    const bars = screen.getAllByTestId("spark-bar");
    expect(bars).toHaveLength(14);
  });

  it("renders sparkline with single data point", () => {
    const data = clone(mockDashboard);
    data.compliance.trend = [50];
    render(<App data={data} />);
    const bars = screen.getAllByTestId("spark-bar");
    expect(bars).toHaveLength(1);
  });

  it("shows empty state when compliance score is null", () => {
    const data = clone(mockDashboard);
    data.compliance = { score: null, maxScore: 100, delta: 0, trend: [] };
    render(<App data={data} />);
    expect(screen.getByText("No assessment data available yet")).toBeInTheDocument();
  });
});

// ── Security Summary ───────────────────────────────────────────

describe("SecuritySummary", () => {
  it("renders 3 posture bars", () => {
    render(<App data={mockDashboard} />);
    expect(screen.getAllByTestId("posture-bar")).toHaveLength(3);
  });

  it("renders stat values", () => {
    render(<App data={mockDashboard} />);
    const values = screen.getAllByTestId("stat-value");
    expect(values[0]).toHaveTextContent("247");
    expect(values[1]).toHaveTextContent("12");
    expect(values[2]).toHaveTextContent("3");
  });

  it("shows empty state when all posture ratios are 0", () => {
    const data = clone(mockDashboard);
    data.posture = { pass: 0, warn: 0, fail: 0, controlsEvaluated: 0, frameworksActive: 0, pendingReviews: 0 };
    render(<App data={data} />);
    expect(screen.getByText("No controls have been evaluated")).toBeInTheDocument();
  });
});

// ── Recent Findings ────────────────────────────────────────────

describe("RecentFindings", () => {
  it("renders correct number of finding cards", () => {
    render(<App data={mockDashboard} />);
    expect(screen.getAllByTestId("finding-card")).toHaveLength(4);
  });

  it("displays severity badges correctly", () => {
    render(<App data={mockDashboard} />);
    const badges = screen.getAllByTestId("severity-badge");
    expect(badges[0]).toHaveTextContent("CRIT");
    expect(badges[1]).toHaveTextContent("WARN");
    expect(badges[2]).toHaveTextContent("WARN");
    expect(badges[3]).toHaveTextContent("INFO");
  });

  it("displays finding IDs", () => {
    render(<App data={mockDashboard} />);
    expect(screen.getByText("IAM-0042")).toBeInTheDocument();
    expect(screen.getByText("NET-0187")).toBeInTheDocument();
  });

  it("displays relative timestamps", () => {
    render(<App data={mockDashboard} />);
    const times = screen.getAllByTestId("finding-time");
    expect(times[0].textContent).toMatch(/\d+[hmd] ago/);
  });

  it("truncates long asset names", () => {
    const data = clone(mockDashboard);
    data.findings.items = [{
      id: "TEST-001",
      severity: "info",
      title: "Test",
      framework: "TEST",
      asset: "very-long-resource-name-here",
      detectedAt: new Date().toISOString(),
    }];
    render(<App data={data} />);
    expect(screen.getByTestId("asset-tag")).toHaveTextContent("Asset: very-long-resour…");
  });

  it("shows view all link with total count", () => {
    render(<App data={mockDashboard} />);
    expect(screen.getByTestId("view-all-link")).toHaveTextContent("View All 23 Findings →");
  });

  it("shows empty state when no findings", () => {
    const data = clone(mockDashboard);
    data.findings = { total: 0, items: [] };
    render(<App data={data} />);
    expect(screen.getByTestId("findings-empty")).toHaveTextContent("No findings detected — looking good");
  });

  it("escapes HTML in titles (XSS prevention)", () => {
    const data = clone(mockDashboard);
    data.findings.items = [{
      id: "XSS-001",
      severity: "critical",
      title: '<script>alert(1)</script>',
      framework: "TEST",
      asset: "test",
      detectedAt: new Date().toISOString(),
    }];
    data.findings.total = 1;
    render(<App data={data} />);
    expect(screen.getByText('<script>alert(1)</script>')).toBeInTheDocument();
    expect(document.querySelector("script[src]")).toBeNull();
  });
});

// ── Recommended Actions ────────────────────────────────────────

describe("RecommendedActions", () => {
  it("renders correct number of actions", () => {
    render(<App data={mockDashboard} />);
    expect(screen.getAllByTestId("action-item")).toHaveLength(4);
  });

  it("displays zero-padded numbers", () => {
    render(<App data={mockDashboard} />);
    const numbers = screen.getAllByTestId("action-number");
    expect(numbers[0]).toHaveTextContent("01");
    expect(numbers[3]).toHaveTextContent("04");
  });

  it("displays CTA with arrow", () => {
    render(<App data={mockDashboard} />);
    const ctas = screen.getAllByTestId("action-cta");
    expect(ctas[0]).toHaveTextContent("Begin Remediation →");
  });

  it("CTA links to correct href", () => {
    render(<App data={mockDashboard} />);
    const cta = screen.getAllByTestId("action-cta")[0];
    expect(cta.getAttribute("href")).toBe("/remediation/IAM-0042");
  });

  it("shows empty state when no actions", () => {
    const data = clone(mockDashboard);
    data.actions = [];
    render(<App data={data} />);
    expect(screen.getByTestId("actions-empty")).toHaveTextContent("No actions required at this time");
  });
});

// ── Framework Status ───────────────────────────────────────────

describe("FrameworkStatus", () => {
  it("renders correct number of frameworks", () => {
    render(<App data={mockDashboard} />);
    expect(screen.getAllByTestId("framework-row")).toHaveLength(5);
  });

  it("displays percentage values", () => {
    render(<App data={mockDashboard} />);
    const pcts = screen.getAllByTestId("framework-pct");
    expect(pcts[0]).toHaveTextContent("87%");
    expect(pcts[2]).toHaveTextContent("94%");
  });

  it("renders 8 segments per bar", () => {
    render(<App data={mockDashboard} />);
    const bars = screen.getAllByTestId("segmented-bar");
    const segments = within(bars[0]).getAllByTestId("segment");
    expect(segments).toHaveLength(8);
  });

  it("fills correct number of segments for 87%", () => {
    render(<App data={mockDashboard} />);
    const bars = screen.getAllByTestId("segmented-bar");
    const segments = within(bars[0]).getAllByTestId("segment");
    const filled = segments.filter((s) => s.classList.contains("filled"));
    expect(filled).toHaveLength(6); // floor(87/12.5) = 6
  });

  it("shows last assessed date", () => {
    render(<App data={mockDashboard} />);
    expect(screen.getByText("Last: 2026-02-14")).toBeInTheDocument();
  });

  it("shows empty state when no frameworks", () => {
    const data = clone(mockDashboard);
    data.frameworks = [];
    render(<App data={data} />);
    expect(screen.getByTestId("frameworks-empty")).toHaveTextContent("No frameworks configured");
  });
});

// ── Footer ─────────────────────────────────────────────────────

describe("Footer", () => {
  it("displays portal version", () => {
    render(<App data={mockDashboard} />);
    expect(screen.getByTestId("version-label")).toHaveTextContent("Portal v2.4.1");
  });

  it("displays sync timestamp", () => {
    render(<App data={mockDashboard} />);
    expect(screen.getByTestId("sync-timestamp")).toHaveTextContent("Last sync: 2026-03-25T12:44:00Z");
  });
});

// ── Error States ───────────────────────────────────────────────

describe("Error States", () => {
  it("shows error block on 5xx", () => {
    render(<App data={mockDashboard} error={{ status: 500, onRetry: () => {}, retrying: false }} />);
    expect(screen.getByTestId("error-block")).toBeInTheDocument();
    expect(screen.getByText("Unable to load dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("retry-button")).toBeInTheDocument();
  });

  it("shows 403 error without retry button", () => {
    render(<App data={mockDashboard} error={{ status: 403 }} />);
    expect(screen.getByText("You do not have access to this portal")).toBeInTheDocument();
    expect(screen.queryByTestId("retry-button")).not.toBeInTheDocument();
  });

  it("shows 404 error without retry button", () => {
    render(<App data={mockDashboard} error={{ status: 404 }} />);
    expect(screen.getByText("Portal not found")).toBeInTheDocument();
    expect(screen.queryByTestId("retry-button")).not.toBeInTheDocument();
  });

  it("shows spinner when retrying", () => {
    render(<App data={mockDashboard} error={{ status: 500, onRetry: () => {}, retrying: true }} />);
    expect(screen.getByTestId("retry-button").querySelector(".spinner")).toBeInTheDocument();
  });
});
