import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import "../../styles/admin.css";

const API = "http://localhost:8080/api";

function AdminRevenue() {
  const getToday = () => new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState(getToday());
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!startDate || !endDate) {
      setError("Please select both From Date and To Date.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API}/bookings/revenue?startDate=${startDate}&endDate=${endDate}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        setError("Failed to fetch revenue stats.");
      }
    } catch (err) {
      setError("Network error fetching revenue stats.");
      console.error(err);
    }
    setLoading(false);
  };

  const formatMoney = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

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

        <div className="occupancy-controls">
          <h3>Select Date Range (Confirmed Bookings)</h3>
          <div className="occupancy-form" style={{ gridTemplateColumns: '1fr 1fr auto' }}>
            <div className="form-group">
              <label>From Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>To Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <button className="btn-analyze" onClick={handleAnalyze} disabled={loading}>
              <i className="fa-solid fa-search"></i> {loading ? "Analyzing..." : "Analyze Revenue"}
            </button>
          </div>
          {error && <p style={{ color: "var(--danger)", marginTop: "12px", fontSize: "14px" }}>{error}</p>}
        </div>

        {stats ? (
          <>
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-label">Total Revenue</div>
                <div className="stat-value success">{formatMoney(stats.totalRevenue)}</div>
                <div className="stat-subtitle">{stats.totalBookings} Confirmed Bookings</div>
              </div>
            </div>

            <h3 style={{ marginBottom: "16px", color: "var(--text-dark)" }}>Revenue by Seat Class</h3>
            <div className="class-breakdown">
              <div className="class-card">
                <div className="class-header">
                  <div className="class-name">First Class</div>
                  <div className="class-rate medium"><i className="fa-solid fa-crown"></i></div>
                </div>
                <div className="class-detail">
                  <span>Revenue generated</span>
                  <span>{formatMoney(stats.firstRevenue)}</span>
                </div>
              </div>

              <div className="class-card">
                <div className="class-header">
                  <div className="class-name">Business Class</div>
                  <div className="class-rate medium"><i className="fa-solid fa-briefcase"></i></div>
                </div>
                <div className="class-detail">
                  <span>Revenue generated</span>
                  <span>{formatMoney(stats.businessRevenue)}</span>
                </div>
              </div>

              <div className="class-card">
                <div className="class-header">
                  <div className="class-name">Economy Class</div>
                  <div className="class-rate medium"><i className="fa-solid fa-chair"></i></div>
                </div>
                <div className="class-detail">
                  <span>Revenue generated</span>
                  <span>{formatMoney(stats.econRevenue)}</span>
                </div>
              </div>
            </div>

            <h3 style={{ marginTop: "32px", marginBottom: "16px", color: "var(--text-dark)" }}>Revenue by Route Segment</h3>
            {stats.routeRevenue && stats.routeRevenue.length > 0 ? (
              <div className="resource-list">
                {stats.routeRevenue.map((r, idx) => (
                  <div key={idx} className="resource-card">
                    <div className="resource-card-main">
                      <div className="resource-card-icon"><i className="fa-solid fa-route"></i></div>
                      <div className="resource-card-info">
                        <h3>{r.route}</h3>
                        <p>Total Revenue: <strong>{formatMoney(r.revenue)}</strong></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: "40px" }}>
                <i className="fa-solid fa-route" style={{ fontSize: "32px" }}></i>
                <p>No route revenue generated in this date range.</p>
              </div>
            )}
          </>
        ) : (
          <div className="placeholder-card">
            <i className="fa-solid fa-chart-line"></i>
            <h2>Revenue Analytics Ready</h2>
            <p>Select a date range above and click "Analyze Revenue" to generate financial reports.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminRevenue;
