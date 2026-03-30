import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <Link to="/" className="logo">ARTS</Link>
      </div>

      <div className="nav-links">
        {username ? (
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