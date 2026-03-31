import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Payment() {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("bookingData"));
    if (!data) {
      window.location.href = "/";
      return;
    }
    setBookingData(data);
  }, []);

  const handlePayment = async () => {
    setProcessing(true);

    try {
      // Get userId from localStorage
      const userId = localStorage.getItem("userId");

      // Prepare booking data for backend
      const isInternational = bookingData.searchData?.isInternationalTrip || false;
      const bookingPayload = {
        userId: userId ? parseInt(userId) : null,
        flight1: bookingData.flight1?.flightId,
        flight2: bookingData.flight2?.flightId || null,
        seatClass: bookingData.searchData?.travelClass,
        bookingPrice: bookingData.totalPrice,
        fromLocation: bookingData.flight1?.fromLocation,
        toLocation:
          bookingData.flight2?.toLocation || bookingData.flight1?.toLocation,
        numSeatsBook: bookingData.passengers?.length,
        dateOfFlight: bookingData.searchData?.date,
        isInternational,
        passengers: bookingData.passengers.map((p) => ({
          name: p.name,
          passport: isInternational ? (p.passport || null) : null, // only send passport for international
          seatFlight1: p.seatFlight1 || null,
          seatFlight2: p.seatFlight2 || null,
        })),
      };

      // Send booking to backend
      const response = await fetch("http://localhost:8080/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      // Try to parse response as JSON, fallback to text if it fails
      let result;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();
        result = { message: text };
      }

      if (!response.ok) {
        console.error("Backend error:", result);
        throw new Error(result.error || result.message || "Booking failed");
      }

      // Success - prepare boarding pass and redirect
      setTimeout(() => {
        alert(
          `✅ Payment Successful! Your booking is confirmed.\nBooking ID: ${result.bookId}`,
        );
        
        localStorage.setItem("confirmationData", JSON.stringify({
           bookId: result.bookId,
           bookingData: bookingData
        }));
        
        localStorage.removeItem("bookingData");
        localStorage.removeItem("selectedFlight");
        localStorage.removeItem("searchData");
        navigate("/confirmation");
      }, 1500);
    } catch (err) {
      console.error("Payment error:", err);
      alert(`❌ Payment failed: ${err.message}`);
      setProcessing(false);
    }
  };

  if (!bookingData) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={containerStyle}>
      <h2>Payment</h2>

      <div style={cardStyle}>
        <h3>Booking Summary</h3>

        <p>
          <strong>From:</strong> {bookingData.flight1?.fromLocation}
        </p>
        <p>
          <strong>To:</strong>{" "}
          {bookingData.flight2
            ? bookingData.flight2.toLocation
            : bookingData.flight1?.toLocation}
        </p>
        <p>
          <strong>Passengers:</strong> {bookingData.passengers?.length}
        </p>

        <hr />

        <h4>Passenger Details</h4>
        {bookingData.passengers?.map((p, i) => (
          <div key={i} style={passengerStyle}>
            <p>
              <strong>{p.name}</strong>
            </p>
            <p style={{ fontSize: "12px", color: "gray" }}>
              Seat F1: {p.seatFlight1}{" "}
              {p.seatFlight2 && `| Seat F2: ${p.seatFlight2}`}
            </p>
          </div>
        ))}

        <hr />

        <h3 style={{ color: "#3b82f6" }}>
          Total Amount: ₹{bookingData.totalPrice}
        </h3>

        <button
          onClick={handlePayment}
          disabled={processing}
          style={{
            ...btnStyle,
            opacity: processing ? 0.6 : 1,
            cursor: processing ? "not-allowed" : "pointer",
          }}
        >
          {processing ? "Processing..." : "Complete Payment"}
        </button>

        <button
          onClick={() => navigate(-1)}
          style={{ ...btnStyle, background: "#9ca3af", marginLeft: "10px" }}
        >
          Back
        </button>
      </div>

      {/* ✈️ Flight Rules & Refund Policy */}
      <div style={rulesCardStyle}>
        <h3 style={rulesTitleStyle}>✈️ Basic Flight Rules</h3>
        <ul style={rulesListStyle}>
          {[
            "Passengers must carry a valid government-issued ID during check-in and boarding.",
            "Check-in closes 45 minutes before departure for domestic flights.",
            "Each passenger is allowed one cabin bag and one checked bag within weight limits.",
            "Passengers must arrive at the airport at least 2 hours before departure.",
            "Any dangerous or prohibited items are strictly not allowed in baggage.",
          ].map((rule, i) => (
            <li key={i} style={ruleItemStyle}>
              <span style={ruleBulletStyle}>{i + 1}</span>
              {rule}
            </li>
          ))}
        </ul>

        <div style={dividerStyle} />

        <h3 style={refundTitleStyle}>💰 Refund Policy</h3>
        <div style={refundGridStyle}>
          {[
            { pct: "75%", label: "Refund", when: "Cancelled more than 2 days before departure", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
            { pct: "50%", label: "Refund", when: "Cancelled 1 to 2 days before departure",      color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
            { pct: "25%", label: "Refund", when: "Cancelled 12 to 24 hours before departure",   color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
            { pct: "0%",  label: "Refund", when: "Cancelled less than 12 hours before departure", color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
          ].map(({ pct, label, when, color, bg, border }) => (
            <div key={pct} style={{ ...refundTileStyle, background: bg, borderColor: border }}>
              <span style={{ ...refundPctStyle, color }}>{pct}</span>
              <span style={refundLabelStyle}>{label}</span>
              <span style={refundWhenStyle}>{when}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Payment;

const containerStyle = {
  padding: "20px",
  maxWidth: "640px",
  margin: "auto",
};

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "20px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const passengerStyle = {
  padding: "10px",
  marginBottom: "10px",
  background: "#f3f4f6",
  borderRadius: "5px",
};

const btnStyle = {
  padding: "10px 20px",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "15px",
};

/* ---- Rules Card ---- */
const rulesCardStyle = {
  marginTop: "24px",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "24px",
  background: "#fafafa",
  boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
};

const rulesTitleStyle = {
  margin: "0 0 14px 0",
  fontSize: "16px",
  fontWeight: "700",
  color: "#1e3a5f",
};

const rulesListStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const ruleItemStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  fontSize: "13.5px",
  color: "#374151",
  lineHeight: "1.5",
};

const ruleBulletStyle = {
  flexShrink: 0,
  width: "22px",
  height: "22px",
  borderRadius: "50%",
  background: "#3b82f6",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "11px",
  fontWeight: "700",
  marginTop: "1px",
};

const dividerStyle = {
  margin: "20px 0",
  borderTop: "1px dashed #d1d5db",
};

const refundTitleStyle = {
  margin: "0 0 14px 0",
  fontSize: "16px",
  fontWeight: "700",
  color: "#1e3a5f",
};

const refundGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
};

const refundTileStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "3px",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid",
};

const refundPctStyle = {
  fontSize: "22px",
  fontWeight: "800",
  lineHeight: 1,
};

const refundLabelStyle = {
  fontSize: "11px",
  fontWeight: "600",
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const refundWhenStyle = {
  fontSize: "12px",
  color: "#374151",
  lineHeight: "1.4",
  marginTop: "2px",
};
