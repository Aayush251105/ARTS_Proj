import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import "../../styles/admin.css";

/**
 * AdminDashboard — main dashboard page with 5 navigation cards.
 */
function AdminDashboard() {
  const username = localStorage.getItem("username") || "Admin";
  const [bookingsToday, setBookingsToday] = useState("...");

  useEffect(() => {
    fetch("http://localhost:8080/api/bookings/count/today")
      .then((res) => res.json())
      .then((count) => setBookingsToday(count))
      .catch(() => setBookingsToday(0));
  }, []);

  const cards = [
    {
      title: "Current Resources",
      description: "View and manage flights, crew assignments, and aircraft allocation across all active routes.",
      icon: "fa-solid fa-server",
      link: "/admin/resources",
    },
    {
      title: "Flight Occupancy Statistics",
      description: "Monitor seat occupancy rates, booking trends, and capacity utilization across all flights.",
      icon: "fa-solid fa-chart-bar",
      link: "/admin/occupancy",
    },
    {
      title: "Revenue Reports",
      description: "Track revenue by flight, route, and class. Analyze pricing performance and booking income.",
      icon: "fa-solid fa-chart-line",
      link: "/admin/revenue",
    },
    {
      title: "Passenger Lists",
      description: "Access detailed passenger manifests, booking details, and traveler information per flight.",
      icon: "fa-solid fa-users",
      link: "/admin/passengers",
    },
    {
      title: "Cancellation & Refund Statistics",
      description: "Review cancellation rates, refund amounts, and identify patterns in booking cancellations.",
      icon: "fa-solid fa-ban",
      link: "/admin/cancellations",
    },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="dashboard-header">
        <h1>Welcome back, {username}</h1>
        <p>Here's an overview of your airline management console.</p>
      </div>

      {/* Quick Stats — 2 cards only */}
      <div className="dashboard-stats" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        <div className="stat-card">
          <div className="stat-label">Total Flights</div>
          <div className="stat-value">8</div>
          <div className="stat-subtitle">Active routes</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Bookings Today</div>
          <div className="stat-value success">{bookingsToday}</div>
          <div className="stat-subtitle">Confirmed</div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="dashboard-cards">
        {cards.map((card) => (
          <Link to={card.link} key={card.title} className="dashboard-card">
            <div className="card-icon">
              <i className={card.icon}></i>
            </div>
            <div className="card-content">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
            <div className="card-arrow">
              View details <i className="fa-solid fa-arrow-right"></i>
            </div>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
