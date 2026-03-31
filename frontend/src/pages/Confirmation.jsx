import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Confirmation.css";

function Confirmation() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const confirmationData = JSON.parse(localStorage.getItem("confirmationData"));
    if (!confirmationData) {
      navigate("/");
      return;
    }
    setData(confirmationData);
  }, [navigate]);

  if (!data) return <div style={{textAlign: "center", marginTop: "100px"}}>Generating Boarding Passes...</div>;

  const { bookId, bookingData } = data;
  const flightDate = bookingData.searchData.date;
  
  return (
    <div className="confirmation-page">
      <div className="confirmation-header">
         <div className="success-icon">✅</div>
         <h1>Booking Confirmed!</h1>
         <p>Your tickets have been successfully issued. Ready for takeoff!</p>
         <button className="home-btn" onClick={() => navigate("/")}>Return to Home</button>
      </div>

      <div className="passes-container">
        {bookingData.passengers.map((passenger, index) => {
           // Generate pseudo PNR string based on bookId and passenger index representing a Passenger ID PNR
           const pnr = `PNR${bookId}0${index + 1}X`;
           
           return (
              <div key={index} className="boarding-pass-group">
                {/* FLIGHT 1 TICKET */}
                <Ticket 
                   passengerName={passenger.name}
                   pnr={pnr}
                   bookId={bookId}
                   seat={passenger.seatFlight1}
                   from={bookingData.flight1.fromLocation}
                   to={bookingData.flight1.toLocation}
                   date={flightDate}
                   airline="AIRLINE FLIGHT"
                   flightNum={bookingData.flight1.flightId}
                   travelClass={bookingData.searchData.travelClass}
                />

                {/* FLIGHT 2 TICKET (if connecting) */}
                {bookingData.flight2 && passenger.seatFlight2 && (
                   <Ticket 
                      passengerName={passenger.name}
                      pnr={pnr}
                      bookId={bookId}
                      seat={passenger.seatFlight2}
                      from={bookingData.flight1.toLocation} // Connecting from intermediate to final destination
                      to={bookingData.flight2.toLocation}
                      date={flightDate}
                      airline="AIRLINE FLIGHT"
                      flightNum={bookingData.flight2.flightId}
                      travelClass={bookingData.searchData.travelClass}
                   />
                )}
              </div>
           );
        })}
      </div>
    </div>
  );
}

function Ticket({ passengerName, pnr, bookId, seat, from, to, date, airline, flightNum, travelClass }) {
  return (
    <div className="ticket-card">
       <div className="ticket-main">
          <div className="ticket-header">
             <div className="airline-brand">✈️ {airline}</div>
             <div className="boarding-tag">BOARDING PASS</div>
          </div>
          
          <div className="ticket-body">
             <div className="route-info">
                <div className="city-block">
                   <div className="city-code">{from.substring(0, 3).toUpperCase()}</div>
                   <div className="city-name">{from}</div>
                </div>
                <div className="flight-route-icon">✈️</div>
                <div className="city-block right">
                   <div className="city-code">{to.substring(0, 3).toUpperCase()}</div>
                   <div className="city-name">{to}</div>
                </div>
             </div>

             <div className="details-grid">
                <div className="detail-item">
                   <label>PASSENGER NAME</label>
                   <div className="value">{passengerName}</div>
                </div>
                <div className="detail-item">
                   <label>FLIGHT</label>
                   <div className="value">{flightNum}</div>
                </div>
                <div className="detail-item">
                   <label>DATE</label>
                   <div className="value">{date}</div>
                </div>
                <div className="detail-item">
                   <label>CLASS</label>
                   <div className="value">{travelClass}</div>
                </div>
                <div className="detail-item">
                   <label>SEAT</label>
                   <div className="value seat-highlight">{seat}</div>
                </div>
             </div>
          </div>
       </div>
       
       <div className="ticket-stub">
          <div>
              <div className="stub-info">
                 <label>PNR (PASSENGER ID)</label>
                 <div className="value">{pnr}</div>
              </div>
              <div className="stub-info">
                 <label>BOOKING REF</label>
                 <div className="value">#{bookId}</div>
              </div>
          </div>
          <div className="barcode-mock">
             || | ||| | || || | ||| | |||
          </div>
       </div>
    </div>
  );
}

export default Confirmation;
