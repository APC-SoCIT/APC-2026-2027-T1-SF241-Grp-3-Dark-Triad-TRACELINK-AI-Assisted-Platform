import { ClipboardCheck } from "lucide-react";

function ManualReview() {
  return (
    <div className="content-wrap">
      <section className="page-heading">
        <div>
          <span className="section-kicker">CONTENT REVIEW</span>
          <h1>Manual Review</h1>
          <p>Review URLs that require additional human verification.</p>
        </div>
      </section>

      <section className="panel full-panel">
        <div className="panel-heading">
          <div>
            <span className="section-kicker">REVIEW QUEUE</span>
            <h2>URLs Awaiting Review</h2>
            <p className="panel-subtitle">
              Flagged URLs requiring manual inspection will appear here.
            </p>
          </div>
          <ClipboardCheck size={18} className="muted-icon" />
        </div>

        <div className="empty-state">
          <ClipboardCheck size={32} />
          <h3>No URLs awaiting review</h3>
          <p>URLs requiring manual verification will be added to this queue.</p>
        </div>
      </section>
    </div>
  );
}

export default ManualReview;
