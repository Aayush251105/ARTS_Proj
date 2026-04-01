import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/Profile.css';
import '../styles/Confirmation.css';
import { Ticket } from './Confirmation.jsx';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const editButtonRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const [boardingPasses, setBoardingPasses] = useState([]);
  const [fetchingPasses, setFetchingPasses] = useState(false);
  const [user, setUser] = useState({
    userID: localStorage.getItem("userId") || localStorage.getItem("userID"),
    role: localStorage.getItem("role") || "Passenger",
    username: localStorage.getItem("username") || "Passenger"
  });

  const [editData, setEditData] = useState({ username: '', email: '', password: '' });

  // 1. Fetch Data Once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = user.userID;
        const [userRes, bookingRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/users/${id}`),
          axios.get(`http://localhost:8080/api/bookings/user/${id}`)
        ]);
        
        setEditData({
          username: userRes.data.username || '',
          email: userRes.data.email || '',
          password: ''
        });
        setBookings(bookingRes.data);
      } catch (err) {
        console.error("Initialization failed:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user.userID) fetchData();
    else setLoading(false);
  }, [user.userID]);

  // 2. Handle Outside Click for Dropdown
  useEffect(() => {
    if (!showDropdown) return;
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          editButtonRef.current && !editButtonRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showDropdown]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:8080/api/users/update/${user.userID}`, editData);
      localStorage.setItem("username", res.data.username);
      setUser(prev => ({ ...prev, username: res.data.username }));
      setShowDropdown(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Update failed.");
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
    const confirmMsg = `Cancel flight to ${booking.toLocation}?\nRefund: ${refund.percent}% (₹${refund.amount.toFixed(2)})`;

    if (window.confirm(confirmMsg)) {
      try {
        await axios.delete(`http://localhost:8080/api/bookings/${booking.bookId}`);
        setBookings(prev => prev.map(item => item.bookId === booking.bookId ? { ...item, status: 'CANCELLED' } : item));
        alert("Flight cancelled.");
      } catch (err) {
        alert("Error during cancellation.");
      }
    }
  };

  const handleTogglePasses = async (booking) => {
    if (expandedBookingId === booking.bookId) {
      setExpandedBookingId(null);
      setBoardingPasses([]);
      return;
    }
    setExpandedBookingId(booking.bookId);
    setFetchingPasses(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/bookings/${booking.bookId}/passengers`);
      setBoardingPasses(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch boarding passes.");
      setBoardingPasses([]);
    } finally {
      setFetchingPasses(false);
    }
  };

  if (loading) return <div className="profile-page-wrapper"><div className="profile-container"><p>Loading...</p></div></div>;

  if (!user.userID) {
    return (
      <div className="profile-page-wrapper">
        <div className="profile-container">
          <p style={{textAlign:'center', marginTop:'60px', color:'#6B7280'}}>
            Please <a href="/login" style={{color:'#1E3A8A'}}>log in</a> to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page-wrapper">
      <div className="profile-container">
        
        <div className="user-header">
          <div className="user-info">
            <div className="avatar-circle">{user.username[0].toUpperCase()}</div>
            <div>
              <h1 className="welcome-text">Welcome, {user.username}</h1>
              <small className="user-meta-text">{editData.email} • {user.role}</small>
            </div>
          </div>
          
          <div className="header-actions">
            <button 
                ref={editButtonRef} 
                className="edit-toggle-btn" 
                onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
            >
              Edit Profile ⚙
            </button>
            <button className="back-home-btn" onClick={() => navigate('/')}>
              ← Home
            </button>
          </div>

          {showDropdown && (
            <div className="edit-dropdown" ref={dropdownRef}>
              <h3>Update Account</h3>
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label>Username</label>
                  <input type="text" value={editData.username} onChange={e => setEditData({...editData, username: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" value={editData.password} onChange={e => setEditData({...editData, password: e.target.value})} placeholder="Leave blank to keep current" />
                </div>
                <div className="dropdown-btns">
                  <button type="submit" className="save-btn">Save</button>
                  <button type="button" className="close-btn" onClick={() => setShowDropdown(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}
        </div>

        <h2 className="section-title">Your Booked Trips</h2>
        {bookings.map((b) => (
          <div key={b.bookId} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            <div 
              className={`flight-card ${b.status === 'CANCELLED' ? 'cancelled-card' : ''}`}
              onClick={() => { if (b.status !== 'CANCELLED') handleTogglePasses(b); }}
              style={{ cursor: b.status === 'CANCELLED' ? 'not-allowed' : 'pointer', marginBottom: 0, transition: 'transform 0.2s', border: expandedBookingId === b.bookId ? '2px solid var(--indigo-500, #6366f1)' : '' }}
            >
              <div className="route-section">
                <div className="city-box">
                  {b.status === 'CANCELLED' && <span className="cancelled-badge">CANCELLED</span>}
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
                  <div className={`price-tag ${b.status === 'CANCELLED' ? 'price-tag-cancelled' : ''}`}>₹{b.bookingPrice}</div>
                  <small className="flight-date">{new Date(b.dateOfFlight).toDateString()}</small>
                </div>
                {b.status === 'CANCELLED'
                  ? <span className="refund-status">Refund Processed</span>
                  : <button className="cancel-btn" onClick={(e) => { e.stopPropagation(); handleCancel(b); }}>Cancel</button>
                }
              </div>
            </div>

            {/* Passes Dropdown */}
            {expandedBookingId === b.bookId && (
              <div className="passes-container" style={{ margin: '8px 0', padding: '24px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                {fetchingPasses ? (
                  <div style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>Loading passes...</div>
                ) : (
                  boardingPasses.length > 0 ? (
                    boardingPasses.map((p, idx) => {
                      const realPnr = String(p.pnr).padStart(6, '0');
                      return (
                        <div key={idx} className="boarding-pass-group" style={{ marginBottom: idx === boardingPasses.length - 1 ? 0 : "32px" }}>
                          <Ticket 
                            passengerName={p.passName}
                            pnr={realPnr}
                            bookId={b.bookId}
                            seat={p.seat1 || "Unassigned"}
                            from={b.fromLocation}
                            to={b.via ? b.via : b.toLocation}
                            date={b.dateOfFlight}
                            airline="AIRLINE FLIGHT"
                            flightNum={b.flight1 || "TBA"}
                            travelClass={b.seatClass || "ECONOMY"}
                          />
                          {b.flight2 && (
                            <div style={{ marginTop: '24px' }}>
                              <Ticket 
                                passengerName={p.passName}
                                pnr={realPnr}
                                bookId={b.bookId}
                                seat={p.seat2 || "Unassigned"}
                                from={b.via ? b.via : b.fromLocation}
                                to={b.toLocation}
                                date={b.dateOfFlight}
                                airline="CONNECTING FLIGHT"
                                flightNum={b.flight2 || "TBA"}
                                travelClass={b.seatClass || "ECONOMY"}
                              />
                            </div>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <div style={{ textAlign: "center", color: "#64748b" }}>No passes found.</div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
        {bookings.length === 0 && <p className="empty-msg">No active bookings found.</p>}
      </div>
    </div>
  );
};

export default Profile;
