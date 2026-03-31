import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SeatSelection.css";

function SeatSelection() {
  const data = JSON.parse(localStorage.getItem("selectedFlight"));
  const search = JSON.parse(localStorage.getItem("searchData"));
  const navigate = useNavigate();

  const totalPassengers = data?.passengers || search?.passengers || 1;
  const selectedClass = data?.selectedClass || search?.travelClass || "ECONOMY";

  const isInternational =
    data?.isInternational ||
    data?.fromInternational ||
    data?.toInternational ||
    search?.isInternationalTrip ||
    false;

  const [selectedSeats, setSelectedSeats] = useState({
    flight1: [],
    flight2: [],
  });
  
  // Map of integer Seat ID -> Label string (e.g. 1A)
  const [selectedSeatLabels, setSelectedSeatLabels] = useState({
    flight1: {},
    flight2: {},
  });

  const [bookedSeats, setBookedSeats] = useState({
    flight1: [],
    flight2: [],
  });

  const [passengers, setPassengers] = useState(() =>
    Array.from({ length: totalPassengers }, () => ({
      name: "",
      passport: "",
      seatFlight1: "",
      seatFlight2: "",
    })),
  );

  useEffect(() => {
    if (passengers.length !== totalPassengers) {
      setPassengers((prev) => {
        if (prev.length < totalPassengers) {
          const newPassengers = [...prev];
          while (newPassengers.length < totalPassengers) {
            newPassengers.push({
              name: "",
              passport: "",
              seatFlight1: "",
              seatFlight2: "",
            });
          }
          return newPassengers;
        } else {
          return prev.slice(0, totalPassengers);
        }
      });
    }
  }, [totalPassengers]);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        if (!data?.date) return;

        const res1 = await fetch(
          `http://localhost:8080/api/flights/seats/${data.flight1.flightId}?date=${data.date}`,
        );
        const seats1 = await res1.json();

        let seats2 = [];
        if (data.flight2) {
          const res2 = await fetch(
            `http://localhost:8080/api/flights/seats/${data.flight2.flightId}?date=${data.date}`,
          );
          seats2 = await res2.json();
        }

        setBookedSeats({
          flight1: Array.isArray(seats1) ? seats1 : [],
          flight2: Array.isArray(seats2) ? seats2 : [],
        });
      } catch (err) {
        console.error("Seat fetch error:", err);
      }
    };
    fetchSeats();
  }, [data]);

  if (!data || !data.flight1) {
    return <h2>Invalid booking data. Please go back and select a flight.</h2>;
  }

  // ✅ CLASS-BASED SEAT CONFIGURATION
  const getSeatLayoutConfig = () => {
    if (selectedClass === "FIRST") {
       return { start: 1, end: 20, cols: 4, type: "grid-2x2", letters: ["A", "B", "C", "D"] };
    } else if (selectedClass === "BUSINESS") {
       return { start: 21, end: 40, cols: 4, type: "grid-2x2", letters: ["A", "B", "C", "D"] };
    } else {
       return { start: 41, end: data.flight1.numSeats || 100, cols: 4, type: "grid-2x2", letters: ["A", "B", "C", "D"] };
    }
  };

  const { start, end, cols, type, letters } = getSeatLayoutConfig();

  // ✅ LABEL GENERATION
  const getSeatLabel = (id) => {
     return id; // Restored to strict numbers per user request
  };

  // ✅ GRID ARRAY GENERATION
  const generateGrid = () => {
     const grid = [];
     for (let i = start; i <= end; i++) {
        const index = i - start;
        const col = index % cols;
        
        grid.push({ id: i, label: getSeatLabel(i) });
        
        // 2x2 Layout: Aisle is always after the 2nd column
        if (col === 1) {
           grid.push("aisle"); 
        }
     }
     return grid;
  };

  const handleSeatClick = (seatId, label, flightKey) => {
    const booked = bookedSeats[flightKey] || [];
    const selected = selectedSeats[flightKey] || [];

    if (booked.includes(seatId)) return;

    if (selected.includes(seatId)) {
      // DESELECT
      setSelectedSeats((prev) => ({
        ...prev,
        [flightKey]: selected.filter((s) => s !== seatId),
      }));
      
      setSelectedSeatLabels((prev) => {
         const newLabels = { ...prev };
         delete newLabels[flightKey][seatId];
         return newLabels;
      });

      setPassengers((prev) =>
        prev.map((p) => ({
          ...p,
          [flightKey === "flight1" ? "seatFlight1" : "seatFlight2"]:
            p[flightKey === "flight1" ? "seatFlight1" : "seatFlight2"] === seatId
              ? ""
              : p[flightKey === "flight1" ? "seatFlight1" : "seatFlight2"],
        })),
      );
    } else {
      // SELECT
      if (selected.length < totalPassengers) {
        setSelectedSeats((prev) => ({
          ...prev,
          [flightKey]: [...selected, seatId],
        }));

        setSelectedSeatLabels((prev) => ({
          ...prev,
          [flightKey]: { ...prev[flightKey], [seatId]: label }
        }));

        const passengerIndex = selected.length;
        setPassengers((prev) => {
          const updated = [...prev];
          updated[passengerIndex] = {
            ...updated[passengerIndex],
            [flightKey === "flight1" ? "seatFlight1" : "seatFlight2"]: seatId,
          };
          return updated;
        });
      } else {
        alert(`You can only select ${totalPassengers} seats`);
      }
    }
  };

  const handleConfirmBooking = () => {
    // Check all passengers have required fields
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];

      if (!p.name?.trim()) {
         alert(`Passenger ${i + 1}: Name is required`); return;
      }

      if (isInternational) {
        if (!p.passport?.trim()) {
          alert(`Passenger ${i + 1}: Passport is required for international flights`); return;
        }
        if (p.passport.length < 6 || p.passport.length > 20) {
          alert(`Passenger ${i + 1}: Passport ID must be 6-20 characters`); return;
        }
      }

      if (!p.seatFlight1) {
        alert(`Passenger ${i + 1}: Seat selection required for Flight 1`); return;
      }
      if (data.flight2 && !p.seatFlight2) {
        alert(`Passenger ${i + 1}: Seat selection required for Flight 2`); return;
      }
    }

    const totalSeatsNeeded = totalPassengers * (data.flight2 ? 2 : 1);
    const totalSeatsSelected = (selectedSeats.flight1?.length || 0) + (selectedSeats.flight2?.length || 0);

    if (totalSeatsSelected !== totalSeatsNeeded) {
      alert(`Please select seats for all passengers and flights`); return;
    }

    localStorage.setItem(
      "bookingData",
      JSON.stringify({
        flight1: data.flight1,
        flight2: data.flight2 || null,
        passengers,
        selectedSeats,
        totalPrice: calculateTotalPrice(),
        searchData: search,
      }),
    );
    navigate("/payment");
  };

  const calculateTotalPrice = () => {
    let price = 0;
    const priceKey = selectedClass === "FIRST" ? "pfirst" : selectedClass === "BUSINESS" ? "pbusiness" : "pecon";
    price += data.flight1[priceKey];
    if (data.flight2) price += data.flight2[priceKey];
    
    // Exact 10% group logic
    let finalPerPerson = totalPassengers > 5 ? Math.floor(price * 0.9) : price;
    return finalPerPerson * totalPassengers;
  };

  const renderSeatGrid = (flightKey) => {
    const booked = bookedSeats[flightKey] || [];
    const selected = selectedSeats[flightKey] || [];
    const flightData = flightKey === "flight1" ? data.flight1 : data.flight2;
    const gridElements = generateGrid();

    return (
      <div className="seat-grid-container" style={{marginBottom: "16px"}}>
        <h3 className="seat-grid-title">{flightKey === "flight1" ? "Flight 1" : "Flight 2"}: {flightData.fromLocation} to {flightData.toLocation}</h3>
        
        <div className={type}>
           {gridElements.map((item, idx) => {
              if (item === "aisle") return <div key={`aisle-${idx}`} style={{width: '20px'}} />;
              
              const isBooked = booked.includes(item.id);
              const isSelected = selected.includes(item.id);
              
              let statusClass = "available";
              if (isBooked) statusClass = "booked";
              if (isSelected) statusClass = "selected";

              return (
                 <button
                   key={item.id}
                   type="button"
                   className={`seat-btn ${statusClass}`}
                   onClick={() => handleSeatClick(item.id, item.label, flightKey)}
                   disabled={isBooked}
                 >
                   {item.label}
                 </button>
              );
           })}
        </div>
      </div>
    );
  };

  return (
    <div className="seat-page">
      <div className="seat-container">
         
         {/* FLIGHT INFO CARD */}
         <div className="seat-flight-info">
            <div>
               <div className="seat-info-airline">Airline Flight {data.flight1.flightId} {data.flight2 && `& ${data.flight2.flightId}`}</div>
               <div className="seat-info-route">{data.flight1.fromLocation} → {data.flight2 ? data.flight2.toLocation : data.flight1.toLocation} &nbsp;|&nbsp; {data.date}</div>
            </div>
            <div className="seat-info-class">
               {selectedClass.charAt(0) + selectedClass.slice(1).toLowerCase()} Class
            </div>
         </div>

         {/* SEAT LEGEND */}
         <div className="seat-legend">
            <div className="legend-item"><div className="legend-box available"></div> Available</div>
            <div className="legend-item"><div className="legend-box selected"></div> Selected</div>
            <div className="legend-item"><div className="legend-box booked"></div> Booked</div>
         </div>

         {/* GRIDS */}
         {renderSeatGrid("flight1")}
         {data.flight2 && renderSeatGrid("flight2")}
         
         {/* SELECTED SEATS & PASSENGERS PANEL */}
         <div className="selected-summary-panel">
            <div className="selected-seats-row">
               <div>
                  <div className="selected-seats-list">
                    Selected Seats: 
                    {selectedSeats.flight1.length === 0 && selectedSeats.flight2.length === 0 && <span style={{color: '#6B7280', fontWeight: 'normal', marginLeft: '8px'}}>None selected yet</span>}
                    {selectedSeats.flight1.map(id => <span key={`f1-${id}`} className="seat-badge">{selectedSeatLabels.flight1[id]}</span>)}
                    {selectedSeats.flight2.map(id => <span key={`f2-${id}`} className="seat-badge">{selectedSeatLabels.flight2[id]}</span>)}
                  </div>
                  <div style={{color: '#6B7280', fontSize: '14px', marginTop: '6px', fontWeight: '500'}}>
                     {selectedSeats.flight1.length + (data.flight2 ? selectedSeats.flight2.length : 0)} / {totalPassengers * (data.flight2 ? 2 : 1)} Target Seats
                  </div>
               </div>
               
               <div className="total-price-box">
                  <div style={{fontSize: '13px', color: '#6B7280', fontWeight: '600', marginBottom: '4px'}}>Total Price</div>
                  <div className="total-price">₹{calculateTotalPrice()}</div>
               </div>
            </div>

            <div className="passenger-forms">
               <h3 style={{marginBottom: "20px", color: '#111827'}}>Passenger Details</h3>
               
               {passengers.map((passenger, i) => (
               <div key={i} className="passenger-box">
                  <h4>Passenger {i + 1}</h4>

                  <div style={{ fontSize: "14px", color: "#6B7280", marginBottom: "16px", display: 'flex', gap: '20px' }}>
                     {passenger.seatFlight1 ? (
                     <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}><span style={{color: '#10B981', fontWeight: 'bold'}}>✓</span> Flight 1: <strong style={{color: '#111827'}}>{selectedSeatLabels.flight1[passenger.seatFlight1]}</strong></div>
                     ) : (
                     <div><span style={{color: '#EF4444', fontWeight: 'bold'}}>⊘</span> Flight 1 pending</div>
                     )}

                     {data.flight2 &&
                     (passenger.seatFlight2 ? (
                        <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}><span style={{color: '#10B981', fontWeight: 'bold'}}>✓</span> Flight 2: <strong style={{color: '#111827'}}>{selectedSeatLabels.flight2[passenger.seatFlight2]}</strong></div>
                     ) : (
                        <div><span style={{color: '#EF4444', fontWeight: 'bold'}}>⊘</span> Flight 2 pending</div>
                     ))}
                  </div>

                  <input
                     placeholder="Full Name *"
                     className="passenger-input"
                     value={passenger.name || ""}
                     onChange={(e) =>
                     setPassengers((prev) => {
                        const updated = [...prev];
                        updated[i] = { ...updated[i], name: e.target.value };
                        return updated;
                     })
                     }
                  />

                  {isInternational && (
                     <div style={{marginTop: '20px', padding: '16px', borderRadius: '8px', background: '#F0F9FF', border: '1px solid #BAE6FD', display: 'inline-block'}}>
                        <label style={{display: 'block', fontSize: '13px', color: '#0369A1', fontWeight: '700', marginBottom: '8px'}}>🌐 International Flight — Passport Required</label>
                        <div style={{display: 'flex', alignItems: 'center', background: '#FFFFFF', border: '1px solid #7DD3FC', borderRadius: '6px', overflow: 'hidden'}}>
                           <span style={{padding: '10px 12px', background: '#E0F2FE', borderRight: '1px solid #7DD3FC', fontSize: '16px'}}>🛂</span>
                           <input
                              placeholder="Passport (6-20 chars)"
                              className="passenger-input"
                              style={{border: 'none', margin: '0', padding: '10px 12px', maxWidth: '200px', outline: 'none', boxShadow: 'none'}}
                              value={passenger.passport || ""}
                              maxLength={20}
                              onChange={(e) =>
                                 setPassengers((prev) => {
                                    const updated = [...prev];
                                    updated[i] = { ...updated[i], passport: e.target.value.toUpperCase() };
                                    return updated;
                                 })
                              }
                           />
                        </div>
                     </div>
                  )}
               </div>
               ))}
               
               <button className="continue-btn" onClick={handleConfirmBooking}>
                  Confirm Seats & Continue to Payment
               </button>
            </div>
         </div>
         
      </div>
    </div>
  );
}

export default SeatSelection;
