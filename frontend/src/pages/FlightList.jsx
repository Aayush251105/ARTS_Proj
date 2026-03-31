import { useEffect, useState } from "react";
import axios from "axios";
import FlightCard from "../components/FlightCard";
import "../styles/FlightList.css";

function FlightList() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInternational, setIsInternational] = useState(false);
  const [search, setSearch] = useState(null);

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem("searchData"));

    if (!s) {
      window.location.href = "/";
      return;
    }

    if (!localStorage.getItem("userId")) {
      window.location.href = "/login";
      return;
    }

    setSearch(s);

    const checkInternational = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/flights/city/is-international/${s.to}`,
        );
        setIsInternational(res.data.isInternational);
      } catch (err) {
        console.error("Error checking city:", err);
      }
    };

    checkInternational();

    axios
      .get("http://localhost:8080/api/flights/search", {
        params: {
          from: s.from,
          to: s.to,
          date: s.date,
          travelClass: s.travelClass || "ECONOMY",
        },
      })
      .then((res) => {
        setFlights(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching flights", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch flights",
        );
        setLoading(false);
      });
  }, []);

  return (
    <div className="flight-list-page">
      <div className="flight-list-container">
        
        {search && (
          <div className="filters-summary">
            {search.from} → {search.to} &nbsp;|&nbsp; {search.passengers} Passenger{search.passengers > 1 ? 's' : ''} &nbsp;|&nbsp; {search.date}
          </div>
        )}

        {error && (
          <p style={{ color: "red", padding: "10px", background: "#fee", borderRadius: "8px" }}>
            ❌ {error}
          </p>
        )}
        
        {loading ? (
          <p>Loading flights...</p>
        ) : flights.length === 0 ? (
          <p>No flights found for this route and date.</p>
        ) : (
          flights.map((f, i) => (
            <FlightCard key={i} data={{ ...f, isInternational }} search={search} />
          ))
        )}
      </div>
    </div>
  );
}

export default FlightList;
