import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Link2,
} from "lucide-react";

function Overview() {
  return (
    <div className="content-wrap">
      <section className="page-heading">
        <div>
          <span className="section-kicker">DASHBOARD</span>
          <h1>Overview</h1>
          <p>Monitor URL validation activity and recent TraceLink scans.</p>
        </div>
      </section>

      <section className="stats-grid">
        <div className="metric-card">
          <div className="metric-top">
            <span>Total URLs Scanned</span>
            <span className="metric-icon cyan"><Link2 size={16} /></span>
          </div>
          <div className="metric-value">0</div>
          <div className="metric-detail">URLs processed</div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>Operational</span>
            <span className="metric-icon green"><CheckCircle2 size={16} /></span>
          </div>
          <div className="metric-value">0</div>
          <div className="metric-detail">Healthy URLs</div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>Issues Detected</span>
            <span className="metric-icon coral"><AlertTriangle size={16} /></span>
          </div>
          <div className="metric-value">0</div>
          <div className="metric-detail">URLs requiring attention</div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>Recent Scans</span>
            <span className="metric-icon amber"><Clock size={16} /></span>
          </div>
          <div className="metric-value">0</div>
          <div className="metric-detail">Completed scan jobs</div>
        </div>
      </section>

      <section className="panel full-panel">
        <div className="panel-heading">
          <div>
            <span className="section-kicker">RECENT ACTIVITY</span>
            <h2>Recent Scans</h2>
            <p className="panel-subtitle">
              Your recently processed URL batches will appear here.
            </p>
          </div>
          <Activity size={18} className="muted-icon" />
        </div>

        <div className="empty-state">
          <Activity size={28} />
          <h3>No scans yet</h3>
          <p>Start a new batch scan to see activity here.</p>
        </div>
      </section>
    </div>
  );
}

export default Overview;
