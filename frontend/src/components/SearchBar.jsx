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

  // ✅ Fetch cities
  useEffect(() => {
    fetch("http://localhost:8080/api/cities")
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch((err) => console.error(err));
  }, []);

  // ✅ Handle city select
  const handleCityChange = (e, type) => {
    const selectedCity = cities.find(
        (c) => c.cityId === parseInt(e.target.value)
    );

    if(!selectedCity) {
      setForm((prev) => {
         const copy = {...prev};
         if(type === 'from') { copy.from = null; copy.fromId = null; copy.fromInternational = false;}
         else { copy.to = null; copy.toId = null; copy.toInternational = false;}
         return copy;
      });
      return;
    }

    setForm((prev) => {
        if (type === "from") {
        return {
            ...prev,
            from: selectedCity.name,
            fromId: selectedCity.cityId,
            fromInternational: selectedCity.isInternational
        };
        } else {
        return {
            ...prev,
            to: selectedCity.name,
            toId: selectedCity.cityId,
            toInternational: selectedCity.isInternational
        };
        }
    });
  };

  // ✅ Handle normal inputs
  const handleChange = (e) => {
    let val = e.target.value;
    if (e.target.name === 'passengers') {
       val = parseInt(val) || 1;
    }
    setForm({ ...form, [e.target.name]: val });
  };

  // ✅ Submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (!form.fromId || !form.toId) {
        alert("Please select both cities");
        return;
    }
    if (form.fromId === form.toId) {
        alert("From and To cities cannot be the same");
        return;
    }

    const isInternationalTrip =
        form.fromInternational || form.toInternational || false;

    localStorage.setItem("searchData", JSON.stringify({
        ...form,
        isInternationalTrip,
        time: Date.now()
    }));

    navigate("/flights");
  };

  return (
    <div className="search-page">
      <div className="search-card">
        <form onSubmit={handleSearch}>
          
          <div className="search-grid-row">
            <div className="search-field">
              <label className="search-label">From</label>
              <select name="from" className="search-input" value={form.fromId || ""} onChange={(e) => handleCityChange(e, "from")} required>
                <option value="">Select Origin</option>
                {cities.map((city) => (
                  <option key={city.cityId} value={city.cityId}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="search-field">
              <label className="search-label">To</label>
              <select name="to" className="search-input" value={form.toId || ""} onChange={(e) => handleCityChange(e, "to")} required>
                <option value="">Select Destination</option>
                {cities.map((city) => (
                  <option key={city.cityId} value={city.cityId}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="search-grid-row-three">
            <div className="search-field">
              <label className="search-label">Passengers</label>
              <input type="number" name="passengers" min="1" max="50" className="search-input" value={form.passengers} onChange={handleChange} required />
            </div>

            <div className="search-field">
              <label className="search-label">Travel Class</label>
              <select name="travelClass" className="search-input" value={form.travelClass} onChange={handleChange} required>
                <option value="ECONOMY">Economy</option>
                <option value="BUSINESS">Business</option>
                <option value="FIRST">First</option>
              </select>
            </div>

            <div className="search-field">
              <label className="search-label">Date</label>
              <input type="date" name="date" className="search-input" value={form.date} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="search-btn">Search Flights</button>
        </form>
      </div>
    </div>
  );
}

export default SearchBar;