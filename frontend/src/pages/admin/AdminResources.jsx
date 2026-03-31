import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import "../../styles/admin.css";

const API = "http://localhost:8080/api";

function AdminResources() {
  const [activeTab, setActiveTab] = useState("flights");
  const [flights, setFlights] = useState([]);
  const [cities, setCities] = useState([]);
  const [crews, setCrews] = useState([]);
  const [modal, setModal] = useState(null); // null | { type, mode, data }

  // Fetch all data on mount
  useEffect(() => {
    fetchFlights();
    fetchCities();
    fetchCrews();
  }, []);

  const fetchFlights = () => fetch(`${API}/flights`).then(r => r.json()).then(setFlights).catch(console.error);
  const fetchCities = () => fetch(`${API}/cities`).then(r => r.json()).then(setCities).catch(console.error);
  const fetchCrews = () => fetch(`${API}/crews`).then(r => r.json()).then(setCrews).catch(console.error);

  const openAdd = (type) => setModal({ type, mode: "add", data: getDefaultData(type) });
  const openEdit = (type, item) => setModal({ type, mode: "edit", data: { ...item } });
  const closeModal = () => setModal(null);

  const getDefaultData = (type) => {
    if (type === "flight") return { fromLocation: "", toLocation: "", numSeats: "", pFirst: "", pBusiness: "", pEcon: "", takeoffT: "", landingT: "", crewId: "" };
    if (type === "city") return { name: "", isInternational: false };
    if (type === "crew") return { crewCapacity: "" };
    return {};
  };

  const handleChange = (field, value) => {
    setModal(prev => ({ ...prev, data: { ...prev.data, [field]: value } }));
  };

  const handleSave = async () => {
    const { type, mode, data } = modal;
    let url, method;

    if (type === "flight") {
      url = mode === "add" ? `${API}/flights` : `${API}/flights/${data.flightId}`;
      method = mode === "add" ? "POST" : "PUT";
    } else if (type === "city") {
      url = mode === "add" ? `${API}/cities` : `${API}/cities/${data.cityId}`;
      method = mode === "add" ? "POST" : "PUT";
    } else {
      url = mode === "add" ? `${API}/crews` : `${API}/crews/${data.crewId}`;
      method = mode === "add" ? "POST" : "PUT";
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        if (type === "flight") fetchFlights();
        if (type === "city") fetchCities();
        if (type === "crew") fetchCrews();
        closeModal();
      } else {
        alert("Error saving. Check console.");
        console.error(await res.text());
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    }
  };

  // Format time string ("10:00:00" or "10:00") for display
  const formatTime = (t) => {
    if (!t) return "—";
    // t comes as "HH:MM:SS" or "HH:MM" from the backend
    const parts = String(t).split(":");
    const h = parseInt(parts[0]);
    const m = parts[1] || "00";
    const suffix = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${m} ${suffix}`;
  };

  // Normalize time value for <input type="time"> (expects HH:MM)
  const toTimeInput = (t) => {
    if (!t) return "";
    return String(t).slice(0, 5); // "10:00:00" → "10:00"
  };

  return (
    <AdminLayout>
      <div className="admin-subpage">
        <div className="admin-subpage-header">
          <div className="header-icon">
            <i className="fa-solid fa-server"></i>
          </div>
          <div>
            <h1>Current Resources</h1>
            <p>Manage flights, cities, and crew assignments</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="resource-tabs">
          <button className={`resource-tab ${activeTab === "flights" ? "active" : ""}`} onClick={() => setActiveTab("flights")}>
            <i className="fa-solid fa-plane"></i> Flights
          </button>
          <button className={`resource-tab ${activeTab === "cities" ? "active" : ""}`} onClick={() => setActiveTab("cities")}>
            <i className="fa-solid fa-city"></i> Cities
          </button>
          <button className={`resource-tab ${activeTab === "crews" ? "active" : ""}`} onClick={() => setActiveTab("crews")}>
            <i className="fa-solid fa-people-group"></i> Crews
          </button>
        </div>

        {/* ===================== FLIGHTS TAB ===================== */}
        {activeTab === "flights" && (
          <>
            <div className="resource-section-header">
              <h2>All Flights ({flights.length})</h2>
              <button className="btn-add" onClick={() => openAdd("flight")}>
                <i className="fa-solid fa-plus"></i> Add New Flight
              </button>
            </div>
            <div className="resource-list">
              {flights.length === 0 && (
                <div className="empty-state"><i className="fa-solid fa-plane-slash"></i><p>No flights found.</p></div>
              )}
              {flights.map((f) => (
                <div className="resource-card" key={f.flightId} onClick={() => openEdit("flight", f)}>
                  <div className="resource-card-main">
                    <div className="resource-card-icon"><i className="fa-solid fa-plane"></i></div>
                    <div className="resource-card-info">
                      <h3>FL-{f.flightId} — {f.fromLocation} → {f.toLocation}</h3>
                      <p>Takeoff: {formatTime(f.takeoffT)} · Landing: {formatTime(f.landingT)}  ·  {f.numSeats} seats  ·  Crew #{f.crewId || "—"}</p>
                    </div>
                  </div>
                  <div className="resource-card-meta">
                    <span className="resource-badge">₹{Number(f.pEcon).toLocaleString()} Econ</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ===================== CITIES TAB ===================== */}
        {activeTab === "cities" && (
          <>
            <div className="resource-section-header">
              <h2>All Cities ({cities.length})</h2>
              <button className="btn-add" onClick={() => openAdd("city")}>
                <i className="fa-solid fa-plus"></i> Add New City
              </button>
            </div>
            <div className="resource-list">
              {cities.length === 0 && (
                <div className="empty-state"><i className="fa-solid fa-city"></i><p>No cities found.</p></div>
              )}
              {cities.map((c) => (
                <div className="resource-card" key={c.cityId} onClick={() => openEdit("city", c)}>
                  <div className="resource-card-main">
                    <div className="resource-card-icon"><i className="fa-solid fa-city"></i></div>
                    <div className="resource-card-info">
                      <h3>{c.name}</h3>
                      <p>City ID: {c.cityId}</p>
                    </div>
                  </div>
                  <div className="resource-card-meta">
                    <span className={`resource-badge ${c.isInternational ? "international" : "domestic"}`}>
                      {c.isInternational ? "International" : "Domestic"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ===================== CREWS TAB ===================== */}
        {activeTab === "crews" && (
          <>
            <div className="resource-section-header">
              <h2>All Crews ({crews.length})</h2>
              <button className="btn-add" onClick={() => openAdd("crew")}>
                <i className="fa-solid fa-plus"></i> Add New Crew
              </button>
            </div>
            <div className="resource-list">
              {crews.length === 0 && (
                <div className="empty-state"><i className="fa-solid fa-people-group"></i><p>No crews found.</p></div>
              )}
              {crews.map((cr) => (
                <div className="resource-card" key={cr.crewId} onClick={() => openEdit("crew", cr)}>
                  <div className="resource-card-main">
                    <div className="resource-card-icon"><i className="fa-solid fa-people-group"></i></div>
                    <div className="resource-card-info">
                      <h3>Crew #{cr.crewId}</h3>
                      <p>Capacity: {cr.crewCapacity} members</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ===================== MODAL ===================== */}
        {modal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{modal.mode === "add" ? "Add New" : "Edit"} {modal.type.charAt(0).toUpperCase() + modal.type.slice(1)}</h2>
                <button className="modal-close" onClick={closeModal}><i className="fa-solid fa-xmark"></i></button>
              </div>

              <div className="modal-body">
                {/* ---- Flight Form ---- */}
                {modal.type === "flight" && (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label>From Location</label>
                        <input value={modal.data.fromLocation || ""} onChange={(e) => handleChange("fromLocation", e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>To Location</label>
                        <input value={modal.data.toLocation || ""} onChange={(e) => handleChange("toLocation", e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Number of Seats</label>
                      <input type="number" value={modal.data.numSeats || ""} onChange={(e) => handleChange("numSeats", parseInt(e.target.value) || "")} />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Price — First Class (₹)</label>
                        <input type="number" step="0.01" value={modal.data.pFirst || ""} onChange={(e) => handleChange("pFirst", e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Price — Business (₹)</label>
                        <input type="number" step="0.01" value={modal.data.pBusiness || ""} onChange={(e) => handleChange("pBusiness", e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Price — Economy (₹)</label>
                      <input type="number" step="0.01" value={modal.data.pEcon || ""} onChange={(e) => handleChange("pEcon", e.target.value)} />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Takeoff Time</label>
                        <input type="time" value={toTimeInput(modal.data.takeoffT)} onChange={(e) => handleChange("takeoffT", e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Landing Time</label>
                        <input type="time" value={toTimeInput(modal.data.landingT)} onChange={(e) => handleChange("landingT", e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Crew ID</label>
                      <input type="number" value={modal.data.crewId || ""} onChange={(e) => handleChange("crewId", parseInt(e.target.value) || "")} />
                    </div>
                  </>
                )}

                {/* ---- City Form ---- */}
                {modal.type === "city" && (
                  <>
                    <div className="form-group">
                      <label>City Name</label>
                      <input value={modal.data.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Type</label>
                      <select value={modal.data.isInternational ? "true" : "false"} onChange={(e) => handleChange("isInternational", e.target.value === "true")}>
                        <option value="false">Domestic</option>
                        <option value="true">International</option>
                      </select>
                    </div>
                  </>
                )}

                {/* ---- Crew Form ---- */}
                {modal.type === "crew" && (
                  <>
                    <div className="form-group">
                      <label>Crew Capacity</label>
                      <input type="number" value={modal.data.crewCapacity || ""} onChange={(e) => handleChange("crewCapacity", parseInt(e.target.value) || "")} />
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button className="btn-save" onClick={handleSave}>
                  {modal.mode === "add" ? "Create" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminResources;
