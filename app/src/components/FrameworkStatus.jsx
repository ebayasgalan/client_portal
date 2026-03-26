import { getPctColor } from "../utils";

export default function FrameworkStatus({ frameworks }) {
  if (!frameworks || frameworks.length === 0) {
    return (
      <div className="card">
        <div className="section-label">FRAMEWORK STATUS</div>
        <div className="empty-state" data-testid="frameworks-empty">No frameworks configured</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="section-label">FRAMEWORK STATUS</div>
      {frameworks.map((fw) => {
        const color = getPctColor(fw.compliancePct);
        const filled = Math.floor(fw.compliancePct / 12.5);
        return (
          <div key={fw.id} className="framework-row" data-testid="framework-row">
            <div className="framework-top">
              <span className="framework-name">{fw.name}</span>
              <span className="framework-pct" style={{ color }} data-testid="framework-pct">
                {fw.compliancePct}%
              </span>
            </div>
            <div className="segmented-bar" data-testid="segmented-bar">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className={`segment${i < filled ? " filled" : ""}`}
                  data-testid="segment"
                  style={i < filled ? { background: color } : undefined}
                />
              ))}
            </div>
            <div className="framework-date">Last: {fw.lastAssessedAt}</div>
          </div>
        );
      })}
    </div>
  );
}
