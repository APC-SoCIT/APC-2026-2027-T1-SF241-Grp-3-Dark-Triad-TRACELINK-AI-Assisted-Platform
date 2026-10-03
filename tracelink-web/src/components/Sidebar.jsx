import {
  Activity,
  BarChart3,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  Link2,
  ScanSearch,
  Settings,
  Users,
} from "lucide-react";

const roleViews = {
  "SEO Specialist": [
    "Overview",
    "New Scan",
    "Scan Results",
    "Reports",
    "Analytics",
  ],

  "Content Reviewer": [
    "Overview",
    "Manual Review",
    "Reports",
  ],

  "Marketing Manager": [
    "Overview",
    "Reports",
    "Analytics",
  ],

  "System Administrator": [
    "Overview",
    "Workspace",
    "Reports",
  ],

  "Support / Operations": [
    "Overview",
    "Support Queue",
    "Reports",
  ],
};

const pageIcons = {
  Overview: LayoutDashboard,
  "New Scan": ScanSearch,
  "Scan Results": Link2,
  Reports: FileText,
  Analytics: BarChart3,
  "Manual Review": ClipboardCheck,
  Workspace: Users,
  "Support Queue": Activity,
  Settings: Settings,
};

function Sidebar({
  role,
  activePage,
  onPageChange,
}) {
  const pages = roleViews[role] || roleViews["SEO Specialist"];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <Link2 size={24} />
        </div>

        <div>
          <h1>TraceLink</h1>
          <p>SEO Intelligence</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {pages.map((page) => {
          const Icon = pageIcons[page] || Activity;

          return (
            <button
              key={page}
              type="button"
              className={`nav-item ${
                activePage === page ? "active" : ""
              }`}
              onClick={() => onPageChange(page)}
            >
              <Icon size={18} />
              <span>{page}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;