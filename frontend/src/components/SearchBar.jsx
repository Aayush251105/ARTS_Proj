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
    const selectedCity = cities.find(
      (c) => c.cityId === parseInt(e.target.value)
    );
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
        
        {/* FROM */}
        <select 
          onChange={(e) => handleCityChange(e, "from")} 
          required
        >
          <option value="">From</option>
          {cities.map((city) => (
            <option key={city.cityId} value={city.cityId}>
              {city.name}
            </option>
          ))}
        </select>

        {/* TO */}
        <select
          onChange={(e) => handleCityChange(e, "to")} 
          required
        >
          <option value="">To</option>
          {cities.map((city) => (
            <option key={city.cityId} value={city.cityId}>
              {city.name}
            </option>
          ))}
        </select>

        {/* DATE */}
        <input 
          type="date" 
          name="date" 
          onChange={handleChange} 
          required 
        />

        {/* PASSENGERS */}
        <input
          type="number"
          name="passengers"
          min="1"
          placeholder="Passengers"
          onChange={handleChange}
        />

        {/* CLASS */}
        <select name="travelClass" onChange={handleChange}>
          <option value="ECONOMY">Economy</option>
          <option value="BUSINESS">Business</option>
          <option value="FIRST">First</option>
        </select>

        <button type="submit">Search Flights</button>
      </form>
    </div>
  );
}

export default SearchBar;