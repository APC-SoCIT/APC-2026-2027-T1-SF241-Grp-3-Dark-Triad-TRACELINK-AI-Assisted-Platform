import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Link2,
} from "lucide-react";

function Analytics() {
  return (
    <div className="content-wrap">
      <section className="page-heading">
        <div>
          <span className="section-kicker">INSIGHTS</span>
          <h1>Analytics</h1>
          <p>Review aggregate information from TraceLink URL scans.</p>
        </div>
      </section>

      <section className="stats-grid">
        <div className="metric-card">
          <div className="metric-top">
            <span>Total URLs</span>
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
            <span>Issues</span>
            <span className="metric-icon coral"><AlertTriangle size={16} /></span>
          </div>
          <div className="metric-value">0</div>
          <div className="metric-detail">Detected issues</div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>Scans Completed</span>
            <span className="metric-icon amber"><Activity size={16} /></span>
          </div>
          <div className="metric-value">0</div>
          <div className="metric-detail">Completed jobs</div>
        </div>
      </section>

      <section className="panel full-panel">
        <div className="panel-heading">
          <div>
            <span className="section-kicker">AGGREGATE DATA</span>
            <h2>Scan Analytics</h2>
            <p className="panel-subtitle">
              Aggregate scan statistics will be displayed here.
            </p>
          </div>
        </div>

        <div className="empty-state">
          <BarChart3 size={32} />
          <h3>No analytics available</h3>
          <p>Analytics will become available after scan data has been collected.</p>
        </div>
      </section>
    </div>
  );
}

export default Analytics;
