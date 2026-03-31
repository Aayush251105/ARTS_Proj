import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import "../../styles/admin.css";

const API = "http://localhost:8080/api";

function AdminCancellations() {
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
      const res = await fetch(`${API}/bookings/cancellations/stats?startDate=${startDate}&endDate=${endDate}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        setError("Failed to fetch cancellation stats.");
      }
    } catch (err) {
      setError("Network error fetching cancellation data.");
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
            <i className="fa-solid fa-ban"></i>
          </div>
          <div>
            <h1>Cancellation & Refund Statistics</h1>
            <p>Review cancellation patterns and processed refunds</p>
          </div>
        </div>

        <div className="occupancy-controls">
          <h3>Select Refund Date Range</h3>
          <div className="occupancy-form" style={{ gridTemplateColumns: '1fr 1fr auto' }}>
            <div className="form-group">
              <label>From Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>To Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <button className="btn-analyze" onClick={handleAnalyze} disabled={loading} style={{ background: "var(--danger)" }}>
              <i className="fa-solid fa-search"></i> {loading ? "Analyzing..." : "Review Cancellations"}
            </button>
          </div>
          {error && <p style={{ color: "var(--danger)", marginTop: "12px", fontSize: "14px" }}>{error}</p>}
        </div>

        {stats ? (
          <>
            <div className="dashboard-stats">
              <div className="stat-card" style={{ borderTop: "4px solid var(--danger)" }}>
                <div className="stat-label">Total Refunded Amount</div>
                <div className="stat-value danger">{formatMoney(stats.totalRefund)}</div>
                <div className="stat-subtitle">{stats.totalCancellations} Cancelled Bookings Processed</div>
              </div>
            </div>

            <h3 style={{ marginBottom: "16px", color: "var(--text-dark)" }}>Refunds Processed by Seat Class</h3>
            <div className="class-breakdown">
              <div className="class-card">
                <div className="class-header">
                  <div className="class-name">First Class</div>
                  <div className="class-rate low"><i className="fa-solid fa-crown"></i></div>
                </div>
                <div className="class-detail">
                  <span>Refunded</span>
                  <span style={{ color: "var(--danger)" }}>{formatMoney(stats.firstRefund)}</span>
                </div>
              </div>

              <div className="class-card">
                <div className="class-header">
                  <div className="class-name">Business Class</div>
                  <div className="class-rate low"><i className="fa-solid fa-briefcase"></i></div>
                </div>
                <div className="class-detail">
                  <span>Refunded</span>
                  <span style={{ color: "var(--danger)" }}>{formatMoney(stats.businessRefund)}</span>
                </div>
              </div>

              <div className="class-card">
                <div className="class-header">
                  <div className="class-name">Economy Class</div>
                  <div className="class-rate low"><i className="fa-solid fa-chair"></i></div>
                </div>
                <div className="class-detail">
                  <span>Refunded</span>
                  <span style={{ color: "var(--danger)" }}>{formatMoney(stats.econRefund)}</span>
                </div>
              </div>
            </div>

            <h3 style={{ marginTop: "32px", marginBottom: "16px", color: "var(--text-dark)" }}>Refunds by Route Segment</h3>
            {stats.routeRefund && stats.routeRefund.length > 0 ? (
              <div className="resource-list">
                {stats.routeRefund.map((r, idx) => (
                  <div key={idx} className="resource-card" style={{ borderLeft: "4px solid var(--danger)" }}>
                    <div className="resource-card-main">
                      <div className="resource-card-icon" style={{ background: "rgba(239, 68, 68, 0.1)", color: "var(--danger)" }}>
                        <i className="fa-solid fa-route"></i>
                      </div>
                      <div className="resource-card-info">
                        <h3>{r.route}</h3>
                        <p>Total Refunded: <strong>{formatMoney(r.refund)}</strong></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: "40px" }}>
                <i className="fa-solid fa-route" style={{ fontSize: "32px" }}></i>
                <p>No cancellation refunds processed for routes in this date range.</p>
              </div>
            )}
          </>
        ) : (
          <div className="placeholder-card">
            <i className="fa-solid fa-ban"></i>
            <h2>Cancellation Analytics Ready</h2>
            <p>Select a date range above and click "Review Cancellations" to generate refund reports.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminCancellations;
