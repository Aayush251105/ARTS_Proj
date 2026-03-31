import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/Profile.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const editButtonRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [bookings, setBookings] = useState([]);
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
        await axios.post(`http://localhost:8080/api/cancellations/${booking.bookId}`);
        setBookings(prev => prev.map(item => item.bookId === booking.bookId ? { ...item, status: 'CANCELLED' } : item));
        alert("Flight cancelled.");
      } catch (err) {
        alert("Error during cancellation.");
      }
    }
  };

  if (loading) return <div className="profile-page-wrapper">Loading...</div>;

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
          <div key={b.bookId} className={`flight-card ${b.status === 'CANCELLED' ? 'cancelled-card' : ''}`}>
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
              {b.status === 'CANCELLED' ? <span className="refund-status">Refund Processed</span> : <button className="cancel-btn" onClick={() => handleCancel(b)}>Cancel</button>}
            </div>
          </div>
        ))}
        {bookings.length === 0 && <p className="empty-msg">No active bookings found.</p>}
      </div>
    </div>
  );
};

export default Profile;