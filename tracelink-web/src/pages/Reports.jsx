import { Download, FileText, Search } from "lucide-react";

function Reports() {
  return (
    <div className="content-wrap">
      <section className="page-heading">
        <div>
          <span className="section-kicker">REPORTING</span>
          <h1>Reports</h1>
          <p>Review and export reports generated from completed URL scans.</p>
        </div>
      </section>

      <section className="panel full-panel">
        <div className="panel-heading">
          <div>
            <span className="section-kicker">GENERATED OUTPUT</span>
            <h2>Generated Reports</h2>
            <p className="panel-subtitle">
              Reports generated from completed TraceLink scans will appear here.
            </p>
          </div>
        </div>

        <div className="scan-filters">
          <label className="search-box">
            <Search size={15} />
            <input type="text" placeholder="Search reports..." />
          </label>
        </div>

        <div className="empty-state">
          <FileText size={32} />
          <h3>No reports available</h3>
          <p>Complete a URL scan before generating a report.</p>
          <button type="button" className="button button-secondary" disabled>
            <Download size={15} />
            Export Report
          </button>
        </div>
      </section>
    </div>
  );
}

export default Reports;
