export default function Footer({ meta }) {
  return (
    <footer className="footer">
      <span className="footer-text" data-testid="version-label">
        Portal v{meta?.portalVersion}
      </span>
      <span className="footer-sep">|</span>
      <span className="footer-text" data-testid="sync-timestamp">
        Last sync: {meta?.lastSyncAt}
      </span>
      <span className="footer-sep">|</span>
      <a className="footer-link" href="#contact">Contact Ops</a>
    </footer>
  );
}
