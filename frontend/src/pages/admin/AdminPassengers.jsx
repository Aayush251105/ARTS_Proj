import AdminLayout from "../../layouts/AdminLayout";
import "../../styles/admin.css";

function AdminPassengers() {
  return (
    <AdminLayout>
      <div className="admin-subpage">
        <div className="admin-subpage-header">
          <div className="header-icon">
            <i className="fa-solid fa-users"></i>
          </div>
          <div>
            <h1>Passenger Lists</h1>
            <p>Access passenger manifests and booking details per flight</p>
          </div>
        </div>

        <div className="placeholder-card">
          <i className="fa-solid fa-users"></i>
          <h2>Passenger Directory</h2>
          <p>This section will show passenger details, PNR records, and seat assignments per flight. Coming soon.</p>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminPassengers;
