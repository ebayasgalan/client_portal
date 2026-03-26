export default function RecommendedActions({ actions }) {
  if (!actions || actions.length === 0) {
    return (
      <div className="card">
        <div className="section-label">RECOMMENDED ACTIONS</div>
        <div className="empty-state" data-testid="actions-empty">No actions required at this time</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="section-label">RECOMMENDED ACTIONS</div>
      {actions.map((a, i) => (
        <div key={a.id} className="action-item" data-testid="action-item">
          <span className="action-number" data-testid="action-number">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="action-body">
            <div className="action-title">{a.title}</div>
            <div className="action-context">↳ {a.context}</div>
            <a className="action-cta" href={a.ctaHref} data-testid="action-cta">
              {a.ctaLabel} →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
