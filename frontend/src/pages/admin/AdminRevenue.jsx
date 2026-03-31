import AdminLayout from "../../layouts/AdminLayout";
import "../../styles/admin.css";

function AdminRevenue() {
  return (
    <AdminLayout>
      <div className="admin-subpage">
        <div className="admin-subpage-header">
          <div className="header-icon">
            <i className="fa-solid fa-chart-line"></i>
          </div>
          <div>
            <h1>Revenue Reports</h1>
            <p>Track earnings across flights, routes, and ticket classes</p>
          </div>
        </div>

        <div className="placeholder-card">
          <i className="fa-solid fa-chart-line"></i>
          <h2>Revenue Dashboard</h2>
          <p>This section will display revenue breakdown by route, class, and time period. Coming soon.</p>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminRevenue;
