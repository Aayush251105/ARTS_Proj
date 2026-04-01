import { useState, useEffect } from "react";
import Select from "react-select";
import AdminLayout from "../../layouts/AdminLayout";
import "../../styles/admin.css";

const API = "http://localhost:8080/api";

function AdminOccupancy() {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState("");
  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState(getToday());
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  function getToday() {
    return new Date().toISOString().split("T")[0];
  }

  // Fetch all flights for the dropdown
  useEffect(() => {
    fetch(`${API}/flights`)
      .then((r) => r.json())
      .then(setFlights)
      .catch(console.error);
  }, []);

  const handleAnalyze = async () => {
    if (!selectedFlight) {
      alert("Please select a flight.");
      return;
    }
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${API}/bookings/occupancy?flightId=${selectedFlight}&startDate=${startDate}&endDate=${endDate}`
      );
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        alert("Error fetching stats.");
        console.error(await res.text());
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    }
    setLoading(false);
  };

  const getRateClass = (rate) => {
    if (rate >= 70) return "high";
    if (rate >= 30) return "medium";
    return "low";
  };

  const flightOptions = flights.map((f) => ({
    value: f.flightId,
    label: `FL-${f.flightId} — ${f.fromLocation} → ${f.toLocation} (${f.numSeats} seats)`,
  }));

  return (
    <AdminLayout>
      <div className="admin-subpage">
        <div className="admin-subpage-header">
          <div className="header-icon">
            <i className="fa-solid fa-chart-bar"></i>
          </div>
          <div>
            <h1>Flight Occupancy Statistics</h1>
            <p>Analyze seat occupancy and class utilization across flights</p>
          </div>
        </div>

        {/* Controls */}
        <div className="occupancy-controls">
          <h3>Select Flight & Date Range</h3>
          <div className="occupancy-form">
            <div className="form-group">
              <label>Flight (required)</label>
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
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button className="btn-analyze" onClick={handleAnalyze} disabled={loading}>
              <i className="fa-solid fa-magnifying-glass-chart"></i>
              {loading ? "Loading..." : "Analyze"}
            </button>
          </div>
        </div>

        {/* Results */}
        {stats && (
          <>
            {/* Overview Stats */}
            <div className="occupancy-overview">
              <div className="occupancy-stat">
                <div className="occ-label">Total Seats Available</div>
                <div className="occ-value">{stats.totalAvailable.toLocaleString()}</div>
                <div className="occ-sub">{stats.numSeatsPerDay} seats × {stats.numDays} day{stats.numDays > 1 ? "s" : ""}</div>
              </div>
              <div className="occupancy-stat">
                <div className="occ-label">Total Seats Occupied</div>
                <div className="occ-value success">{stats.totalOccupied.toLocaleString()}</div>
                <div className="occ-sub">Confirmed bookings</div>
              </div>
              <div className="occupancy-stat">
                <div className="occ-label">Overall Occupancy Rate</div>
                <div className={`occ-value ${getRateClass(stats.totalOccupancyRate)}`}>
                  {stats.totalOccupancyRate}%
                </div>
                <div className="occ-sub">
                  {stats.fromLocation} → {stats.toLocation}
                </div>
                <div className="occupancy-bar">
                  <div
                    className={`occupancy-bar-fill ${getRateClass(stats.totalOccupancyRate)}`}
                    style={{ width: `${Math.min(stats.totalOccupancyRate, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Class Breakdown */}
            <div className="resource-section-header" style={{ marginBottom: "20px" }}>
              <h2>Seat Class Breakdown</h2>
            </div>

            <div className="class-breakdown">
              {/* First Class */}
              <div className="class-card">
                <div className="class-header">
                  <span className="class-name">✈ First Class</span>
                  <span className={`class-rate ${getRateClass(stats.firstOccupancyRate)}`}>
                    {stats.firstOccupancyRate}%
                  </span>
                </div>
                <div className="class-detail">
                  <span>Available Seats</span>
                  <span>{stats.firstAvailable}</span>
                </div>
                <div className="class-detail">
                  <span>Occupied Seats</span>
                  <span>{stats.firstOccupied}</span>
                </div>
                <div className="class-detail">
                  <span>Occupancy Rate</span>
                  <span>{stats.firstOccupancyRate}%</span>
                </div>
                <div className="occupancy-bar">
                  <div
                    className={`occupancy-bar-fill ${getRateClass(stats.firstOccupancyRate)}`}
                    style={{ width: `${Math.min(stats.firstOccupancyRate, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Business Class */}
              <div className="class-card">
                <div className="class-header">
                  <span className="class-name">💼 Business Class</span>
                  <span className={`class-rate ${getRateClass(stats.businessOccupancyRate)}`}>
                    {stats.businessOccupancyRate}%
                  </span>
                </div>
                <div className="class-detail">
                  <span>Available Seats</span>
                  <span>{stats.businessAvailable}</span>
                </div>
                <div className="class-detail">
                  <span>Occupied Seats</span>
                  <span>{stats.businessOccupied}</span>
                </div>
                <div className="class-detail">
                  <span>Occupancy Rate</span>
                  <span>{stats.businessOccupancyRate}%</span>
                </div>
                <div className="occupancy-bar">
                  <div
                    className={`occupancy-bar-fill ${getRateClass(stats.businessOccupancyRate)}`}
                    style={{ width: `${Math.min(stats.businessOccupancyRate, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Economy Class */}
              <div className="class-card">
                <div className="class-header">
                  <span className="class-name">🪑 Economy Class</span>
                  <span className={`class-rate ${getRateClass(stats.economyOccupancyRate)}`}>
                    {stats.economyOccupancyRate}%
                  </span>
                </div>
                <div className="class-detail">
                  <span>Available Seats</span>
                  <span>{stats.economyAvailable}</span>
                </div>
                <div className="class-detail">
                  <span>Occupied Seats</span>
                  <span>{stats.economyOccupied}</span>
                </div>
                <div className="class-detail">
                  <span>Occupancy Rate</span>
                  <span>{stats.economyOccupancyRate}%</span>
                </div>
                <div className="occupancy-bar">
                  <div
                    className={`occupancy-bar-fill ${getRateClass(stats.economyOccupancyRate)}`}
                    style={{ width: `${Math.min(stats.economyOccupancyRate, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* No stats yet */}
        {!stats && (
          <div className="placeholder-card">
            <i className="fa-solid fa-chart-bar"></i>
            <h2>Select a flight and date range</h2>
            <p>Choose a flight from the dropdown above and set a date range to view occupancy statistics.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminOccupancy;
