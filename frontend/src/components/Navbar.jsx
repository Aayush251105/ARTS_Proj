import "../styles/navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("userId")
  );

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo">ARTS</div>

      <div className="nav-links">
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