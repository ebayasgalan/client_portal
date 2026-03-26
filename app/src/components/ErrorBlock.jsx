export default function ErrorBlock({ status, onRetry, retrying }) {
  let heading = "Unable to load dashboard";
  let detail = "Connection to the server failed. Your data may still be syncing.";
  let showRetry = true;

  if (status === 403) {
    heading = "You do not have access to this portal";
    detail = "Contact your administrator to request access.";
    showRetry = false;
  } else if (status === 404) {
    heading = "Portal not found";
    detail = "This organization may not be provisioned yet.";
    showRetry = false;
  } else if (status === 429) {
    heading = "Too many requests";
    detail = "Please wait a moment before trying again.";
  }

  return (
    <div className="error-block" data-testid="error-block">
      <div className="error-icon">⚠</div>
      <div className="error-heading">{heading}</div>
      <div className="error-detail">{detail}</div>
      {showRetry && (
        <button className="error-retry" onClick={onRetry} disabled={retrying} data-testid="retry-button">
          {retrying && <span className="spinner" />}
          Retry
        </button>
      )}
      {showRetry && <div className="error-sub">If this persists, contact ops</div>}
    </div>
  );
}
