import { Bell, ChevronDown } from "lucide-react";

const roles = [
  "SEO Specialist",
  "Content Reviewer",
  "Marketing Manager",
  "System Administrator",
  "Support / Operations",
];

function TopBar({
  activePage,
  role,
  onRoleChange,
}) {
  return (
    <header className="topbar">
      <div className="topbar-title">
        <h2>{activePage}</h2>
      </div>

      <div className="topbar-actions">
        <button
          type="button"
          className="icon-button"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>

        <div className="role-selector">
          <select
            value={role}
            onChange={(event) => onRoleChange(event.target.value)}
          >
            {roles.map((roleName) => (
              <option key={roleName} value={roleName}>
                {roleName}
              </option>
            ))}
          </select>

          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  );
}

export default TopBar;