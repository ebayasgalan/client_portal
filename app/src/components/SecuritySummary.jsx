export default function SecuritySummary({ posture }) {
  if (!posture || (posture.pass === 0 && posture.warn === 0 && posture.fail === 0)) {
    return (
      <div className="card">
        <div className="section-label">SECURITY SUMMARY</div>
        <div className="empty-state">No controls have been evaluated</div>
      </div>
    );
  }

  const bars = [
    { ratio: posture.pass, label: `${Math.round(posture.pass * 100)}% Pass`, color: "var(--accent-teal)" },
    { ratio: posture.warn, label: `${Math.round(posture.warn * 100)}% Warn`, color: "var(--accent-amber)" },
    { ratio: posture.fail, label: `${Math.round(posture.fail * 100)}% Fail`, color: "var(--accent-red)" },
  ];

  const stats = [
    { value: posture.controlsEvaluated, label: "Controls Evaluated" },
    { value: posture.frameworksActive, label: "Frameworks Active" },
    { value: posture.pendingReviews, label: "Pending Reviews" },
  ];

  return (
    <div className="card">
      <div className="section-label">SECURITY SUMMARY</div>
      <div style={{ fontWeight: 500, fontSize: 12, marginBottom: 16 }}>POSTURE BREAKDOWN</div>
      {bars.map((b) => (
        <div className="posture-bar-row" key={b.label}>
          <div className="posture-bar-track">
            <div
              className="posture-bar-fill"
              data-testid="posture-bar"
              style={{ width: `${b.ratio * 100}%`, background: b.color }}
            />
          </div>
          <span className="posture-bar-label" style={{ color: b.color }}>{b.label}</span>
        </div>
      ))}
      <div className="stats-box">
        {stats.map((s) => (
          <div className="stat-row" key={s.label}>
            <span className="stat-value" data-testid="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
