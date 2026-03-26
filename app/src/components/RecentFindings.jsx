import { relativeTime, severityMap, truncate } from "../utils";

export default function RecentFindings({ findings }) {
  const items = findings?.items || [];
  const total = findings?.total || 0;

  return (
    <div className="card">
      <div className="section-label">RECENT FINDINGS / DRIFT</div>
      {items.length === 0 ? (
        <div className="empty-state positive" data-testid="findings-empty">
          No findings detected — looking good
        </div>
      ) : (
        <>
          {items.map((f) => {
            const sev = severityMap(f.severity);
            return (
              <div key={f.id} className={`finding-card ${sev.className}`} data-testid="finding-card">
                <div className="finding-header">
                  <span className="severity-badge" data-testid="severity-badge">{sev.label}</span>
                  <span className="finding-id" data-testid="finding-id">{f.id}</span>
                  <span className="finding-time" data-testid="finding-time">{relativeTime(f.detectedAt)}</span>
                </div>
                <div className="finding-title">{f.title}</div>
                <div className="tag-row">
                  <span className="tag">Framework: {f.framework}</span>
                  <span className="tag" data-testid="asset-tag">Asset: {truncate(f.asset)}</span>
                </div>
              </div>
            );
          })}
          <button className="view-all-link" data-testid="view-all-link">
            View All {total} Findings →
          </button>
        </>
      )}
    </div>
  );
}
