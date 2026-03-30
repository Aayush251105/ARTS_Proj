import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Profile.css';

const Profile = () => {
  const [user] = useState(() => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    return userId ? { userID: userId, role, username: username || "Passenger" } : null;
  });
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelledIds, setCancelledIds] = useState([]);

  useEffect(() => {
    if (user?.userID) fetchBookings(user.userID);
  }, [user]);

  const fetchBookings = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/bookings/user/${id}`);
      setBookings(res.data);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  const calculateExpectedRefund = (flightDate, price) => {
    const now = new Date();
    const flight = new Date(flightDate);
    const diffInHours = (flight - now) / (1000 * 60 * 60);

    if (diffInHours >= 48) return { percent: 75, amount: price * 0.75 };
    if (diffInHours >= 24) return { percent: 50, amount: price * 0.50 };
    if (diffInHours >= 12) return { percent: 25, amount: price * 0.25 };
    return { percent: 0, amount: 0 };
  };

  const handleCancel = async (booking) => {
    const refund = calculateExpectedRefund(booking.dateOfFlight, booking.bookingPrice);
    
    const confirmMsg = `Are you sure you want to cancel your flight to ${booking.toLocation}?
    
------------------------------------
Refund Policy Applied:
Time Remaining: ${((new Date(booking.dateOfFlight) - new Date()) / (1000*60*60)).toFixed(1)} hours
Refund Percentage: ${refund.percent}%
Estimated Refund: ₹${refund.amount.toFixed(2)}
------------------------------------`;

    if (window.confirm(confirmMsg)) {
      try {
        await axios.post(`http://localhost:8080/api/cancellations/${booking.bookId}`);
        setCancelledIds(prev => [...prev, booking.bookId]); 
        alert("Flight cancelled successfully. Refund processed.");
      } catch (err) {
        console.error(err);
        alert("Error processing cancellation.");
      }
    }
  };

  useEffect(() => {
      // 1. When the Profile page loads, force the body to scroll
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';

      // 2. Clean up: When you leave the Profile page, put it back 
      // (so your teammates' splash screen stays the way they want)
      return () => {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
      };
    }, []);

  if (loading) return <div className="profile-page-wrapper"><div className="profile-container">Loading...</div></div>;

  return (
    <div className="profile-page-wrapper">
      <div className="profile-container">
        <div className="profile-card">
          
          {/* Header Section - Duplicate Logout Removed */}
          <div className="user-header">
            <div className="user-info">
              <div className="avatar-circle">{user.username[0].toUpperCase()}</div>
              <div>
                <h1 style={{margin: 0}}>Welcome, {user.username}</h1>
                <small>{user.role} Account • ID: {user.userID}</small>
              </div>
            </div>
          </div>

          {/* List of Flights */}
          <h2 className="section-title">Your Trips</h2>
          
          {bookings.map((b) => {
            const isCancelled = cancelledIds.includes(b.bookId) || b.status === 'CANCELLED';

            return (
              <div key={b.bookId} className={`flight-card ${isCancelled ? 'cancelled-card' : ''}`}>
                <div className="route-section">
                  <div className="city-box">
                    {isCancelled && <span className="cancelled-badge">CANCELLED</span>}
                    <h3>{b.fromLocation}</h3>
                    <span>Origin</span>
                  </div>
                  <div className="plane-divider">✈</div>
                  <div className="city-box">
                    <h3>{b.toLocation}</h3>
                    <span>Destination</span>
                  </div>
                </div>

                <div className="action-section">
                  <div className="price-info">
                    <div className={`price-tag ${isCancelled ? 'price-tag-cancelled' : ''}`}>
                      ₹{b.bookingPrice}
                    </div>
                    <small className="flight-date">{new Date(b.dateOfFlight).toDateString()}</small>
                  </div>
                  
                  {isCancelled ? (
                    <span className="refund-status">Refund Processed</span>
                  ) : (
                    <button className="cancel-btn" onClick={() => handleCancel(b)}>Cancel</button>
                  )}
                </div>
              </div>
            );
          })}

          {bookings.length === 0 && <p className="empty-msg">No active bookings found.</p>}
        </div>
      </div>
    </div>
  );
};

export default Profile;