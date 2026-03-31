import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/navbar.css';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("userId")
  );

  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("token");

    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo-link">
        <div className="logo">ARTS</div>
      </Link>

      <div className="nav-links">
        <Link to="/" className="nav-link">
          Home
        </Link>

        {isLoggedIn && (
          <Link to="/profile" className="nav-link">
            Profile
          </Link>
        )}

        {isLoggedIn && role === "ADMIN" && (
          <Link to="/admin" className="nav-link dashboard-link">
            <i className="fa-solid fa-gauge-high"></i>
            Dashboard
          </Link>
        )}

        {isLoggedIn ? (
          <>
            <button className="nav-profile-btn" onClick={() => navigate('/profile')}>
              {username}'s Profile
            </button>
            <button className="nav-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
            <button className="signup-btn" onClick={() => navigate('/signup')}>Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;