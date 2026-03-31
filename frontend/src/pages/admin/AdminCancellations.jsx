import AdminLayout from "../../layouts/AdminLayout";
import "../../styles/admin.css";

function AdminCancellations() {
  return (
    <AdminLayout>
      <div className="admin-subpage">
        <div className="admin-subpage-header">
          <div className="header-icon">
            <i className="fa-solid fa-ban"></i>
          </div>
          <div>
            <h1>Cancellation & Refund Statistics</h1>
            <p>Review cancellation patterns and refund processing</p>
          </div>
        </div>

        <div className="placeholder-card">
          <i className="fa-solid fa-ban"></i>
          <h2>Cancellation Analytics</h2>
          <p>This section will display cancellation rates, refund amounts, and trend analysis. Coming soon.</p>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminCancellations;
