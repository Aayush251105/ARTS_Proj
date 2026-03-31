import "../styles/navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("userId")
  );

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("userId"));
  }, []);

  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
         <span className="navbar-logo-icon">✈</span>
         <span className="navbar-logo-text">Airline System</span>
      </Link>

      <div className="navbar-right">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="navbar-btn-ghost">Login</Link>
            <Link to="/login" className="navbar-btn-solid">Sign Up</Link>
          </>
        ) : (
          <>
            {role === "ADMIN" && (
              <Link to="/admin" className="navbar-btn-ghost" style={{marginRight: '4px'}}>
                Dashboard
              </Link>
            )}
            <Link to="/profile" className="navbar-btn-ghost">
              👤 {username || "Profile"}
            </Link>
            <button className="navbar-btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;