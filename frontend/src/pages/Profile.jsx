import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Profile.css'; // Import the new CSS file

const Profile = () => {
  const [user] = useState(() => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    return userId ? { userID: userId, role, username: username || "Passenger" } : null;
  });
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userID) fetchBookings(user.userID);
  }, [user]);

  const fetchBookings = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/bookings/user/${id}`);
      setBookings(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCancel = async (bookId) => {
    if (window.confirm("Cancel this flight?")) {
      try {
        await axios.delete(`http://localhost:8080/api/bookings/${bookId}`);
        setBookings(bookings.map(b => b.bookId === bookId ? { ...b, status: 'CANCELLED' } : b));
      // eslint-disable-next-line no-unused-vars
      } catch (err) { alert("Error connecting to server."); }
    }
  };

  if (loading) return <div className="profile-container">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        
        {/* Header Section */}
        <div className="user-header">
          <div className="user-info">
            <div className="avatar-circle">{user.username[0].toUpperCase()}</div>
            <div>
              <h1 style={{margin: 0}}>Welcome, {user.username}</h1>
              <small>{user.role} Account • ID: {user.userID}</small>
            </div>
          </div>
          <button onClick={() => {localStorage.clear(); window.location.href="/login"}} 
                  style={{background: 'none', border: '1px solid white', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}>
            Logout
          </button>
        </div>

        {/* List of Flights */}
        <h2 style={{color: '#334155', marginBottom: '20px'}}>Your Trips</h2>
        
        {bookings.map((b) => (
          <div key={b.bookId} className="flight-card">
            <div className="route-section">
              <div className="city-box">
                <h3>{b.fromLocation}</h3>
                <span>Origin</span>
              </div>
              <div className="plane-divider">✈</div>
              <div className="city-box">
                <h3>{b.toLocation}</h3>
                <span>Destination</span>
              </div>
            </div>

            <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
              <div style={{textAlign: 'right'}}>
                <div className="price-tag">
                  {b.status === 'CANCELLED' ? <s style={{color: '#94a3b8'}}>₹{b.bookingPrice}</s> : `₹${b.bookingPrice}`}
                </div>
                <small style={{color: '#64748b'}}>{new Date(b.dateOfFlight).toDateString()}</small>
              </div>
              {b.status === 'CANCELLED' ? (
                <span style={{padding: '6px 12px', background: '#fee2e2', color: '#ef4444', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold'}}>
                  CANCELLED
                </span>
              ) : (
                <button className="cancel-btn" onClick={() => handleCancel(b.bookId)}>Cancel</button>
              )}
            </div>
          </div>
        ))}

        {bookings.length === 0 && <p style={{textAlign: 'center', color: '#94a3b8'}}>No active bookings.</p>}
      </div>
    </div>
  );
};

export default Profile;