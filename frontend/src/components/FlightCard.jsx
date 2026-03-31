import { useState } from "react";
import { useNavigate } from "react-router-dom";

function FlightCard({ data, search }) {
  const navigate = useNavigate();

  // "search" prop passed from FlightList to avoid parsing localStorage repeatedly
  const s = search || JSON.parse(localStorage.getItem("searchData")) || {};
  const passengers = s.passengers || 1;
  const initialClass = s.travelClass || "ECONOMY";

  const [selectedClass, setSelectedClass] = useState(initialClass);

  const seats = data.seats;

  const handleSelect = () => {
    localStorage.setItem(
      "selectedFlight",
      JSON.stringify({
        ...data,
        selectedClass,
        passengers,
        date: s.date,
      }),
    );
    navigate("/seat-selection");
  };

  // 1. Calculate base price based on class selection
  const getBasePrice = (cls) => {
    let price = 0;
    if (cls === "FIRST") price = data.flight1.pfirst;
    else if (cls === "BUSINESS") price = data.flight1.pbusiness;
    else price = data.flight1.pecon;

    if (data.flight2) {
      if (cls === "FIRST") price += data.flight2.pfirst;
      else if (cls === "BUSINESS") price += data.flight2.pbusiness;
      else price += data.flight2.pecon;
    }
    return price;
  };

  const basePrice = getBasePrice(selectedClass);
  
  // 2. Discount logic for >5 members (10% cheaper)
  const isDiscounted = passengers > 5;
  const finalPrice = isDiscounted ? Math.floor(basePrice * 0.9) : basePrice;

  // 3. calculate Availability
  let availableSeats = 0;
  if (selectedClass === "FIRST") availableSeats = seats.first;
  else if (selectedClass === "BUSINESS") availableSeats = seats.business;
  else availableSeats = seats.economy;

  const isAvailable = availableSeats >= passengers;
  const fewSeats = availableSeats > 0 && availableSeats < 10; // Simple UI warning

  // 4. Calculate Duration dynamically
  const getDuration = () => {
    try {
      if (!data.flight1.takeoffT || !data.flight1.landingT) return "2h 30m";
      const formatTime = (t) => t.split(':').map(Number);
      const [h1, m1] = formatTime(data.flight1.takeoffT);
      const [h2, m2] = formatTime(data.flight1.landingT);
      let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
      if (diff < 0) diff += 24 * 60;
      
      if (data.flight2) {
         const [ch1, cm1] = formatTime(data.flight2.takeoffT);
         const [ch2, cm2] = formatTime(data.flight2.landingT);
         let diff2 = (ch2 * 60 + cm2) - (ch1 * 60 + cm1);
         if (diff2 < 0) diff2 += 24 * 60;
         
         // simple layover padding approx
         diff += diff2 + 90;
      }
      return `${Math.floor(diff / 60)}h ${diff % 60}m`;
    } catch {
      return "2h 30m";
    }
  };

  const formatTime = (timeStr) => {
     if (!timeStr) return "";
     return timeStr.slice(0, 5); // "10:00:00" -> "10:00"
  };

  return (
    <div className="fc-main-card">
      <div className="fc-header">
         <div>
            <div className="fc-airline">Airlines</div>
            <div className="fc-id">Flight {data.flight1.flightId} {data.flight2 ? `+ ${data.flight2.flightId}` : ''}</div>
         </div>
         
         <div className="fc-price-wrap">
            {isDiscounted && (
               <div className="fc-discount-badge">10% OFF GROUP RATE</div>
            )}
            <div className="fc-price-row">
               {isDiscounted ? (
                  <>
                     <span className="fc-price-old">₹{basePrice}</span>
                     <span className="fc-price-discounted">₹{finalPrice}</span>
                  </>
               ) : (
                  <span className="fc-price-normal">₹{finalPrice}</span>
               )}
            </div>
            <div style={{fontSize: '11px', color: '#6B7280', marginTop:'2px'}}>per traveler</div>
         </div>
      </div>

      <div className="fc-route">
         <div className="fc-timebox">
            <div className="fc-time">{formatTime(data.flight1.takeoffT)}</div>
            <div className="fc-city">{data.flight1.fromLocation}</div>
         </div>

         <div className="fc-duration-box">
             <div className="fc-duration-text">{getDuration()}</div>
             <div className="fc-duration-line"></div>
             {data.flight2 && (
               <div className="fc-via">1 Stop via {data.flight1.toLocation}</div>
             )}
         </div>

         <div className="fc-timebox" style={{textAlign: "right"}}>
            <div className="fc-time">{formatTime(data.flight2 ? data.flight2.landingT : data.flight1.landingT)}</div>
            <div className="fc-city">{data.flight2 ? data.flight2.toLocation : data.flight1.toLocation}</div>
         </div>
      </div>

      {/* CLASS & SEAT AVAILABILITY INFO */}
      <div className="fc-classes">
         {["ECONOMY", "BUSINESS", "FIRST"].map(cls => {
            const seatsAvailable = cls === "FIRST" 
               ? seats.first 
               : cls === "BUSINESS" 
                  ? seats.business 
                  : seats.economy;
                  
            return (
               <div
                  key={cls}
                  className={`fc-class-info ${selectedClass === cls ? 'selected' : ''}`}
               >
                  <div className="fc-class-name">{cls.charAt(0) + cls.slice(1).toLowerCase()}</div>
                  <div className="fc-class-seats">
                    {seatsAvailable} seats available
                  </div>
               </div>
            );
         })}
      </div>

      <div className="fc-footer">
         <div className="fc-avail-indicator">
            {!isAvailable ? (
               <span className="fc-avail-bad">Not available for {passengers} passengers</span>
            ) : fewSeats ? (
               <span className="fc-avail-warn">Few Seats Left</span>
            ) : (
               <span className="fc-avail-good">Seats Available</span>
            )}
         </div>

         <button 
           className="fc-select-btn" 
           disabled={!isAvailable} 
           onClick={handleSelect}
         >
           Select Flight
         </button>
      </div>
    </div>
  );
}

export default FlightCard;
