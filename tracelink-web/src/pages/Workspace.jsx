import { Settings, ShieldCheck, Users } from "lucide-react";

function Workspace() {
  return (
    <div className="content-wrap">
      <section className="page-heading">
        <div>
          <span className="section-kicker">ADMINISTRATION</span>
          <h1>Workspace</h1>
          <p>Manage TraceLink workspace settings and users.</p>
        </div>
      </section>

      <section className="stats-grid">
        <div className="metric-card">
          <div className="metric-top">
            <span>Workspace Users</span>
            <span className="metric-icon cyan"><Users size={16} /></span>
          </div>
          <div className="metric-value">0</div>
          <div className="metric-detail">Registered workspace users</div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>Active Roles</span>
            <span className="metric-icon green"><ShieldCheck size={16} /></span>
          </div>
          <div className="metric-value">0</div>
          <div className="metric-detail">Configured user roles</div>
        </div>
      </section>

      <section className="panel full-panel">
        <div className="panel-heading">
          <div>
            <span className="section-kicker">CONFIGURATION</span>
            <h2>Workspace Settings</h2>
            <p className="panel-subtitle">
              Administrative controls for the TraceLink workspace.
            </p>
          </div>
          <Settings size={18} className="muted-icon" />
        </div>

        <div className="empty-state">
          <Settings size={32} />
          <h3>Workspace configuration</h3>
          <p>Workspace management functionality has not yet been connected.</p>
        </div>
      </section>
    </div>
  );
}

export default Workspace;
