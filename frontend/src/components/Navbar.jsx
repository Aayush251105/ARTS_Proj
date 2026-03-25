import "../styles/navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">ARTS</div>

      <div className="nav-links">
        <a href="/login"><button className="login-btn">Login</button></a>
        <Link to="/signup">
            <button className="signup-btn">Sign Up</button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;