export function relativeTime(isoString) {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffDay >= 1) return `${diffDay}d ago`;
  if (diffHr >= 1) return `${diffHr}h ago`;
  if (diffMin >= 1) return `${diffMin}m ago`;
  return "just now";
}

export function getScoreColor(score) {
  if (score >= 90) return "var(--accent-teal)";
  if (score >= 75) return "var(--accent-amber)";
  return "var(--accent-red)";
}

export function getDeltaColor(delta) {
  if (delta > 0) return "var(--accent-teal)";
  if (delta < 0) return "var(--accent-red)";
  return "var(--text-muted)";
}

export function formatDelta(delta) {
  if (delta > 0) return `+${delta}`;
  return `${delta}`;
}

export function getPctColor(pct) {
  if (pct >= 80) return "var(--accent-teal)";
  if (pct >= 60) return "var(--accent-amber)";
  return "var(--accent-red)";
}

export function severityMap(severity) {
  switch (severity) {
    case "critical":
      return { label: "CRIT", color: "var(--accent-red)", className: "severity-critical" };
    case "warning":
      return { label: "WARN", color: "var(--accent-amber)", className: "severity-warning" };
    case "info":
    default:
      return { label: "INFO", color: "var(--text-muted)", className: "severity-info" };
  }
}

export function truncate(str, max = 16) {
  if (!str || str.length <= max) return str;
  return str.slice(0, max) + "…";
}
