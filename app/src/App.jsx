import Header from "./components/Header";
import ComplianceElevation from "./components/ComplianceElevation";
import SecuritySummary from "./components/SecuritySummary";
import RecentFindings from "./components/RecentFindings";
import RecommendedActions from "./components/RecommendedActions";
import FrameworkStatus from "./components/FrameworkStatus";
import Footer from "./components/Footer";
import ErrorBlock from "./components/ErrorBlock";
import { mockDashboard } from "./data/mockData";

export default function App({ data: externalData, error: externalError }) {
  const data = externalData ?? mockDashboard;
  const error = externalError ?? null;

  if (error) {
    return (
      <>
        <Header org={data?.org} user={data?.user} />
        <div className="dashboard">
          <ErrorBlock status={error.status} onRetry={error.onRetry} retrying={error.retrying} />
        </div>
      </>
    );
  }

  return (
    <>
      <Header org={data.org} user={data.user} />
      <main className="dashboard">
        <div className="grid-row two-col-7-5" style={{ animationDelay: "0ms" }}>
          <div className="stagger-in" style={{ animationDelay: "0ms" }}>
            <ComplianceElevation compliance={data.compliance} />
          </div>
          <div className="stagger-in" style={{ animationDelay: "100ms" }}>
            <SecuritySummary posture={data.posture} />
          </div>
        </div>
        <div className="grid-row full">
          <div className="stagger-in" style={{ animationDelay: "200ms" }}>
            <RecentFindings findings={data.findings} />
          </div>
        </div>
        <div className="grid-row two-col-6-6">
          <div className="stagger-in" style={{ animationDelay: "300ms" }}>
            <RecommendedActions actions={data.actions} />
          </div>
          <div className="stagger-in" style={{ animationDelay: "400ms" }}>
            <FrameworkStatus frameworks={data.frameworks} />
          </div>
        </div>
      </main>
      <Footer meta={data.meta} />
    </>
  );
}
