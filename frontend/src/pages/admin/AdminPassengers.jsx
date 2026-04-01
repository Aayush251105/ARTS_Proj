import { useState, useEffect } from "react";
import Select from "react-select";
import AdminLayout from "../../layouts/AdminLayout";
import "../../styles/admin.css";

const API = "http://localhost:8080/api";

function AdminPassengers() {
  const getToday = () => new Date().toISOString().split("T")[0];

  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState("");
  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState(getToday());
  const [passengersByDate, setPassengersByDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch flights on mount
  useEffect(() => {
    fetch(`${API}/flights`)
      .then((r) => r.json())
      .then(setFlights)
      .catch((err) => console.error("Error fetching flights:", err));
  }, []);

  const handleAnalyze = async () => {
    if (!selectedFlight) {
      setError("Please select a flight from the dropdown.");
      return;
    }
    if (!startDate || !endDate) {
      setError("Please select both From Date and To Date.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API}/bookings/passengers?flightId=${selectedFlight}&startDate=${startDate}&endDate=${endDate}`);
      if (res.ok) {
        const data = await res.json();
        setPassengersByDate(data.passengersByDate);
      } else {
        setError("Failed to fetch passenger lists.");
      }
    } catch (err) {
      setError("Network error fetching passenger data.");
      console.error(err);
    }
    setLoading(false);
  };

  const formatDateLabel = (isoDate) => {
    return new Date(isoDate).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getSeatClassColor = (seatClass) => {
    const s = String(seatClass).toUpperCase();
    if (s === "FIRST") return "var(--blue-600)";
    if (s === "BUSINESS") return "var(--blue-500)";
    return "var(--text-light)";
  };

  const hasResults = passengersByDate && Object.keys(passengersByDate).length > 0;

  const flightOptions = flights.map((f) => ({
    value: f.flightId,
    label: `FL-${f.flightId} : ${f.fromLocation} → ${f.toLocation}`,
  }));

  return (
    <AdminLayout>
      <div className="admin-subpage">
        <div className="admin-subpage-header">
          <div className="header-icon">
            <i className="fa-solid fa-users"></i>
          </div>
          <div>
            <h1>Passenger Lists</h1>
            <p>Access passenger manifests and seat assignments per flight</p>
          </div>
        </div>

        <div className="occupancy-controls">
          <h3>Fetch Passenger Manifest</h3>
          <div className="occupancy-form" style={{ gridTemplateColumns: '2fr 1fr 1fr auto' }}>
            <div className="form-group">
              <label>Flight ID</label>
              <Select
                options={flightOptions}
                value={flightOptions.find(o => o.value == selectedFlight) || null}
                onChange={(option) => setSelectedFlight(option ? option.value : "")}
                placeholder="— Select a flight —"
                isClearable
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "var(--card-radius)",
                    borderColor: "var(--border-color)",
                    minHeight: "40px",
                  }),
                  option: (base) => ({
                    ...base,
                    color: "var(--text-dark)"
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: "var(--text-dark)"
                  })
                }}
              />
            </div>
            <div className="form-group">
              <label>From Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>To Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <button className="btn-analyze" onClick={handleAnalyze} disabled={loading}>
              <i className="fa-solid fa-search"></i> {loading ? "Fetching..." : "Get List"}
            </button>
          </div>
          {error && <p style={{ color: "var(--danger)", marginTop: "12px", fontSize: "14px" }}>{error}</p>}
        </div>

        {passengersByDate && hasResults && (
          <div className="passenger-results">
            {Object.keys(passengersByDate).map((dateKey) => (
              <div key={dateKey} style={{ marginBottom: "32px" }}>
                <h3 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "8px", marginBottom: "16px", color: "var(--text-dark)" }}>
                  {formatDateLabel(dateKey)}
                </h3>
                <div className="resource-list" style={{ maxHeight: "none", overflow: "visible" }}>
                  {passengersByDate[dateKey].map((p, idx) => (
                    <div key={idx} className="resource-card">
                      <div className="resource-card-main">
                        <div className="resource-card-icon" style={{ background: "var(--admin-bg)", color: getSeatClassColor(p.seatClass) }}>
                          <i className="fa-solid fa-user"></i>
                        </div>
                        <div className="resource-card-info">
                          <h3>{p.passName}</h3>
                          <p>Booking ID: <strong>#{p.bookingId}</strong>  ·  Seat: <strong>{p.assignedSeat}</strong></p>
                        </div>
                      </div>
                      <div className="resource-card-meta">
                        <span className="resource-badge domestic" style={{ color: getSeatClassColor(p.seatClass), background: "var(--blue-50)" }}>
                          {String(p.seatClass).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {passengersByDate && !hasResults && (
          <div className="empty-state" style={{ background: "var(--card-bg)", borderRadius: "var(--card-radius)", border: "1px solid var(--border-color)" }}>
            <i className="fa-solid fa-plane-slash"></i>
            <p>No confirmed passengers found for FL-{selectedFlight} in this date range.</p>
          </div>
        )}

        {!passengersByDate && !error && (
          <div className="placeholder-card">
            <i className="fa-solid fa-users"></i>
            <h2>Passenger Directory</h2>
            <p>Select a flight and date range to view passenger manifests organized by seat class.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminPassengers;
