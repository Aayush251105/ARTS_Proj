import "../styles/navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("userId")
  );

  const role = localStorage.getItem("role");
  const navigate = useNavigate();

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

        {!isLoggedIn ? (
          <>
            <Link to="/login">
              <button className="login-btn">Login</button>
            </Link>

            <Link to="/signup">
              <button className="signup-btn">Sign Up</button>
            </Link>
          </>
        ) : (
          <button className="login-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;