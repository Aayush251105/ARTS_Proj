import { Link, useLocation } from "react-router-dom";
import "../styles/admin.css";

/**
 * AdminLayout — provides the sidebar navigation for all admin pages.
 * Highlights the currently active link using useLocation().
 */
function AdminLayout({ children }) {
  const location = useLocation();

  const navLinks = [
    { path: "/admin", label: "Dashboard", icon: "fa-solid fa-grid-2" },
    { path: "/admin/resources", label: "Current Resources", icon: "fa-solid fa-server" },
    { path: "/admin/occupancy", label: "Flight Occupancy", icon: "fa-solid fa-chart-bar" },
    { path: "/admin/revenue", label: "Revenue Reports", icon: "fa-solid fa-chart-line" },
    { path: "/admin/passengers", label: "Passenger Lists", icon: "fa-solid fa-users" },
    { path: "/admin/cancellations", label: "Cancellations & Refunds", icon: "fa-solid fa-ban" },
  ];

  const isActive = (path) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>
            <i className="fa-solid fa-plane"></i>
            ARTS Admin
          </h2>
          <p>Management Console</p>
        </div>

        <nav className="sidebar-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={isActive(link.path) ? "active" : ""}
            >
              <i className={link.icon}></i>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          © 2026 ARTS Team 26
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-content">{children}</main>
    </div>
  );
}

export default AdminLayout;
