import { useEffect, useState } from "react";
import { getScoreColor, getDeltaColor, formatDelta } from "../utils";

export default function ComplianceElevation({ compliance }) {
  if (!compliance || compliance.score == null) {
    return (
      <div className="card">
        <div className="section-label">COMPLIANCE ELEVATION</div>
        <div className="empty-state">No assessment data available yet</div>
      </div>
    );
  }

  const { score, maxScore, delta, trend } = compliance;
  const color = getScoreColor(score);

  const R = 80;
  const C = 2 * Math.PI * R;
  const pct = score / maxScore;

  const [offset, setOffset] = useState(C);
  useEffect(() => {
    requestAnimationFrame(() => setOffset(C * (1 - pct)));
  }, [pct, C]);

  const maxTrend = Math.max(...trend);

  return (
    <div className="card">
      <div className="section-label">COMPLIANCE ELEVATION</div>
      <div className="compliance-elevation">
        <div className="score-ring-wrapper">
          <svg className="score-ring-svg" viewBox="0 0 220 220">
            {/* Contour rings */}
            <circle className="contour-ring" cx="110" cy="110" r="105" strokeWidth="1" />
            <circle className="contour-ring" cx="110" cy="110" r="95" strokeWidth="1" />
            <circle className="contour-ring" cx="110" cy="110" r="85" strokeWidth="1" />
            {/* Background arc */}
            <circle className="score-arc-bg" cx="110" cy="110" r={R} />
            {/* Score arc */}
            <circle
              className="score-arc"
              cx="110" cy="110" r={R}
              stroke={color}
              strokeDasharray={C}
              strokeDashoffset={offset}
              data-testid="score-arc"
            />
          </svg>
          <div className="score-center">
            <span className="score-value" data-testid="score-value">{score}</span>
            <span className="score-denom">/{maxScore}</span>
            <span className="score-label">INTEGRITY SCORE</span>
          </div>
        </div>
        <div className="trend-section">
          <div className="trend-label">TREND</div>
          <div className="trend-delta" style={{ color: getDeltaColor(delta) }} data-testid="trend-delta">
            {formatDelta(delta)}
          </div>
          <div className="trend-sub">from last assessment</div>
          <div className="sparkline" data-testid="sparkline">
            {trend.map((v, i) => (
              <div
                key={i}
                className="spark-bar"
                data-testid="spark-bar"
                style={{
                  height: `${(v / maxTrend) * 100}%`,
                  background: i >= trend.length - 2 ? "var(--accent-amber)" : "var(--border-accent)",
                }}
              />
            ))}
          </div>
          <div className="sparkline-label">12-month trailing</div>
          <div className="threshold-legend">
            <span className="threshold-item" style={{ color: "var(--accent-teal)" }}>90 — Excellent</span>
            <span className="threshold-item" style={{ color: "var(--accent-amber)" }}>75 — Adequate</span>
            <span className="threshold-item" style={{ color: "var(--accent-red)" }}>60 — At Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
}
