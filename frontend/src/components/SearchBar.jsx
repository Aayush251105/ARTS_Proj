import "../styles/search.css"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({
    from: null,
    to: null,
    date: "",
    passengers: 1,
    travelClass: "ECONOMY",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/cities")
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch((err) => console.error(err));
  }, []);

  const handleCityChange = (e, type) => {
    const selectedCity = cities.find((c) => c.cityId === parseInt(e.target.value));
    setForm({ ...form, [type]: selectedCity });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (form.from?.cityId === form.to?.cityId) {
        alert("From and To cities cannot be the same");
        return;
    }
    localStorage.setItem("searchData", JSON.stringify(form));
    navigate("/flights");
  };

  return (
    <div className="search-container">
      <form className="search-box" onSubmit={handleSearch}>
        <h2>Find Your Flight</h2>
        
        <div className="search-grid">
          {/* FROM */}
          <div className="input-group">
            <label>From</label>
            <select onChange={(e) => handleCityChange(e, "from")} required>
              <option value="">Select Source</option>
              {cities.map((city) => (
                <option key={city.cityId} value={city.cityId}>{city.name}</option>
              ))}
            </select>
          </div>

          {/* TO */}
          <div className="input-group">
            <label>To</label>
            <select onChange={(e) => handleCityChange(e, "to")} required>
              <option value="">Select Destination</option>
              {cities.map((city) => (
                <option key={city.cityId} value={city.cityId}>{city.name}</option>
              ))}
            </select>
          </div>

          {/* DATE */}
          <div className="input-group">
            <label>Departure Date</label>
            <input type="date" name="date" onChange={handleChange} required />
          </div>

          {/* PASSENGERS & CLASS (Combined Row) */}
          <div className="input-group">
            <label>Travelers & Class</label>
            <div className="combined-inputs">
                <input type="number" name="passengers" min="1" placeholder="1" onChange={handleChange} style={{flex: 1}} />
                <select name="travelClass" onChange={handleChange} style={{flex: 2}}>
                  <option value="ECONOMY">Economy</option>
                  <option value="BUSINESS">Business</option>
                  <option value="FIRST">First</option>
                </select>
            </div>
          </div>
        </div>

        <button type="submit" className="search-btn">Search Flights</button>
      </form>
    </div>
  );
}

export default SearchBar;