import { useState, useEffect } from "react";

export default function Header({ org, user }) {
  const [clock, setClock] = useState(formatClock());

  useEffect(() => {
    const id = setInterval(() => setClock(formatClock()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="header">
      <div className="header-top">
        {org?.logoUrl ? (
          <img src={org.logoUrl} alt="" className="logo-mark" />
        ) : (
          <div className="logo-mark" data-testid="logo-fallback" />
        )}
        <span className="org-identity" data-testid="org-identity">
          {org?.name} — {org?.sector}
        </span>
        <div className="header-right">
          <div className="live-indicator">
            <span className="live-dot" />
            <span className="live-text">LIVE</span>
          </div>
          <span className="utc-clock" data-testid="utc-clock">{clock}</span>
          <div className="profile-avatar" data-testid="profile-avatar">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.displayName} style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
            ) : (
              user?.initials
            )}
          </div>
        </div>
      </div>
      <nav className="header-nav">
        {["Dashboard", "Findings", "Policies", "Reports"].map((tab, i) => (
          <button key={tab} className={`nav-tab${i === 0 ? " active" : ""}`}>
            {tab}
          </button>
        ))}
      </nav>
    </header>
  );
}

function formatClock() {
  const d = new Date();
  const h = String(d.getUTCHours()).padStart(2, "0");
  const m = String(d.getUTCMinutes()).padStart(2, "0");
  return `${h}:${m} UTC`;
}
