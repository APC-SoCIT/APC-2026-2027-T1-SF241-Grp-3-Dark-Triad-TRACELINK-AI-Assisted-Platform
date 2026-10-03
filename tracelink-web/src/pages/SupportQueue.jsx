import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Headphones,
} from "lucide-react";

function SupportQueue() {
  return (
    <div className="content-wrap">
      <section className="page-heading">
        <div>
          <span className="section-kicker">OPERATIONS</span>
          <h1>Support Queue</h1>
          <p>Monitor scan issues and operational concerns.</p>
        </div>
      </section>

      <section className="stats-grid">
        <div className="metric-card">
          <div className="metric-top">
            <span>Pending</span>
            <span className="metric-icon amber"><Clock size={16} /></span>
          </div>
          <div className="metric-value">0</div>
          <div className="metric-detail">Pending support items</div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>Open Issues</span>
            <span className="metric-icon coral"><AlertCircle size={16} /></span>
          </div>
          <div className="metric-value">0</div>
          <div className="metric-detail">Issues requiring attention</div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>Resolved</span>
            <span className="metric-icon green"><CheckCircle2 size={16} /></span>
          </div>
          <div className="metric-value">0</div>
          <div className="metric-detail">Resolved support items</div>
        </div>
      </section>

      <section className="panel full-panel">
        <div className="panel-heading">
          <div>
            <span className="section-kicker">ISSUE QUEUE</span>
            <h2>Operational Issues</h2>
            <p className="panel-subtitle">
              Reported system and scan issues will appear here.
            </p>
          </div>
          <Headphones size={18} className="muted-icon" />
        </div>

        <div className="empty-state">
          <Headphones size={32} />
          <h3>No support issues</h3>
          <p>There are currently no issues in the support queue.</p>
        </div>
      </section>
    </div>
  );
}

export default SupportQueue;
