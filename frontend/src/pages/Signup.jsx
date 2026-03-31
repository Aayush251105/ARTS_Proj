import { useState } from "react";
import "../styles/signup.css";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "PASSENGER" }),
      });

      const data = await res.text();
      if (data === "SUCCESS") {
        alert("Signup successful!");
        navigate("/login");
      } else {
        alert(data);
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="auth-toggle">
          <button type="button" className="auth-tab" onClick={() => navigate('/login')}>Login</button>
          <button type="button" className="auth-tab active">Signup</button>
        </div>

        <h2>Create Account</h2>

        {/* Group 1 */}
        <div className="input-group">
          <label>Full Name</label>
          <input type="text" name="username" placeholder="Enter Full Name" onChange={handleChange} required />
        </div>

        {/* Group 2 */}
        <div className="input-group">
          <label>Email Address</label>
          <input type="email" name="email" placeholder="Enter Email Address" onChange={handleChange} required />
        </div>

        {/* Group 3 */}
        <div className="input-group">
          <label>Password</label>
          <input type="password" name="password" placeholder="Enter Password" onChange={handleChange} required />
        </div>

        <button type="submit">Register Now</button>
        
        <p className="footer-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}

export default Signup;